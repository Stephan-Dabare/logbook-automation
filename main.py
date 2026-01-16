from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import io
import logging
from database import engine, Base, get_db
from models import Report, WeekEntry, ReportStatus
import log_generator

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s"
)
logger = logging.getLogger("logbook.api")

# --- STUDENT ENDPOINTS ---

@app.post("/api/student/upload")
async def upload_and_parse(
    start_date: str = Form(...),
    end_date: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    logger.info("Student upload start %s -> %s", start_date, end_date)
    try:
        contents = await file.read()
        weeks_data = log_generator.parse_excel_to_weeks(contents, start_date, end_date)
        logger.info("Parsed %d weeks from upload", len(weeks_data))

        # Create Report
        new_report = Report(student_name="Student", status=ReportStatus.DRAFT)
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        # Create Week Entries
        for week in weeks_data:
            new_week = WeekEntry(
                report_id=new_report.id,
                week_ending=week['week_ending'],
                tasks_summary=week['tasks_summary_text'],
                tasks_json=json.dumps(week['tasks']),
                problems=week['problems'],
                solutions=week['solutions'],
                supervisor_comment=""
            )
            db.add(new_week)
        
        db.commit()
        logger.info("Created report %s with %d weeks", new_report.id, len(weeks_data))
        return {"report_id": new_report.id, "weeks": weeks_data}
    except Exception as e:
        logger.exception("Student upload failed")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/student/reports/{report_id}")
def get_report(report_id: int, db: Session = Depends(get_db)):
    logger.info("Fetching report %s", report_id)
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        logger.warning("Report %s not found", report_id)
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@app.post("/api/student/reports/{report_id}/submit")
def submit_report(report_id: int, db: Session = Depends(get_db)):
    logger.info("Submitting report %s", report_id)
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        logger.warning("Report %s not found for submit", report_id)
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = ReportStatus.SUBMITTED
    db.commit()
    return {"status": "submitted"}

@app.get("/api/student/reports/{report_id}/preview")
def preview_report(report_id: int, db: Session = Depends(get_db)):
    """Get structured preview data for the report"""
    logger.info("Previewing report %s", report_id)
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        logger.warning("Report %s not found for preview", report_id)
        raise HTTPException(status_code=404, detail="Report not found")
    
    weeks_preview = []
    for week in report.weeks:
        tasks = json.loads(week.tasks_json)
        weeks_preview.append({
            "week_ending": week.week_ending,
            "tasks": tasks,
            "problems": week.problems,
            "solutions": week.solutions,
            "supervisor_comment": week.supervisor_comment or ""
        })
    
    return {
        "report_id": report.id,
        "status": report.status,
        "weeks": weeks_preview
    }

@app.post("/api/student/reports/{report_id}/download")
async def download_student_report(report_id: int, db: Session = Depends(get_db)):
    """Download Excel file without signature (for student preview)"""
    logger.info("Student download report %s", report_id)
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        logger.warning("Report %s not found for download", report_id)
        raise HTTPException(status_code=404, detail="Report not found")
    
    weeks_data = []
    for week in report.weeks:
        weeks_data.append({
            "week_ending": week.week_ending,
            "tasks": json.loads(week.tasks_json),
            "problems": week.problems,
            "solutions": week.solutions,
            "supervisor_comment": week.supervisor_comment or ""
        })
        
    excel_file = log_generator.create_final_excel(weeks_data, signature_img_bytes=None)
    logger.info("Generated preview workbook for report %s", report_id)

    return StreamingResponse(
        excel_file, 
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=log_book_preview_{report_id}.xlsx"}
    )


# --- SUPERVISOR ENDPOINTS ---

@app.get("/api/supervisor/reports")
def list_reports(db: Session = Depends(get_db)):
    logger.info("Supervisor fetching submitted reports")
    return db.query(Report).filter(Report.status == ReportStatus.SUBMITTED).all()

@app.get("/api/reports/{report_id}/weeks")
def get_report_weeks(report_id: int, db: Session = Depends(get_db)):
    logger.info("Fetching weeks for report %s", report_id)
    weeks = db.query(WeekEntry).filter(WeekEntry.report_id == report_id).all()
    return weeks

@app.post("/api/supervisor/weeks/{week_id}/comment")
def update_comment(week_id: int, comment: str = Form(...), db: Session = Depends(get_db)):
    logger.info("Updating comment for week %s", week_id)
    week = db.query(WeekEntry).filter(WeekEntry.id == week_id).first()
    if not week:
        logger.warning("Week %s not found for comment", week_id)
        raise HTTPException(status_code=404, detail="Week entry not found")
    week.supervisor_comment = comment
    db.commit()
    return {"status": "updated"}

@app.post("/api/supervisor/weeks/{week_id}/generate-ai-comment")
def generate_ai_comment(week_id: int, db: Session = Depends(get_db)):
    logger.info("Generating AI comment for week %s", week_id)
    week = db.query(WeekEntry).filter(WeekEntry.id == week_id).first()
    if not week:
        logger.warning("Week %s not found for AI comment", week_id)
        raise HTTPException(status_code=404, detail="Week entry not found")
    
    comment = log_generator.generate_supervisor_comment_with_ollama(week.tasks_summary)
    week.supervisor_comment = comment
    db.commit()
    return {"comment": comment}

@app.post("/api/supervisor/reports/{report_id}/comment-all")
def update_all_comments(report_id: int, comment: str = Form(...), db: Session = Depends(get_db)):
    """Apply the same comment to all weeks in a report"""
    logger.info("Updating all comments for report %s", report_id)
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        logger.warning("Report %s not found for bulk comment", report_id)
        raise HTTPException(status_code=404, detail="Report not found")

    weeks = db.query(WeekEntry).filter(WeekEntry.report_id == report_id).all()
    for week in weeks:
        week.supervisor_comment = comment

    db.commit()
    logger.info("Updated %d weeks with bulk comment", len(weeks))
    return {"status": "updated", "weeks_updated": len(weeks)}

@app.post("/api/supervisor/reports/{report_id}/generate-ai-comments-all")
def generate_ai_comments_all(report_id: int, db: Session = Depends(get_db)):
    """Generate AI comments for all weeks in a report"""
    logger.info("Generating AI comments for all weeks in report %s", report_id)
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        logger.warning("Report %s not found for bulk AI comment", report_id)
        raise HTTPException(status_code=404, detail="Report not found")

    weeks = db.query(WeekEntry).filter(WeekEntry.report_id == report_id).all()
    updated_weeks = []

    for week in weeks:
        comment = log_generator.generate_supervisor_comment_with_ollama(week.tasks_summary)
        week.supervisor_comment = comment
        updated_weeks.append({
            "id": week.id,
            "comment": comment
        })

    db.commit()
    logger.info("Generated AI comments for %d weeks", len(weeks))
    return {"weeks": updated_weeks}

@app.post("/api/supervisor/reports/{report_id}/finalize")
async def finalize_report(
    report_id: int,
    signature: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    logger.info("Finalizing report %s", report_id)
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        logger.warning("Report %s not found for finalize", report_id)
        raise HTTPException(status_code=404, detail="Report not found")
    
    signature_bytes = await signature.read()
    
    weeks_data = []
    for week in report.weeks:
        weeks_data.append({
            "week_ending": week.week_ending,
            "tasks": json.loads(week.tasks_json),
            "problems": week.problems,
            "solutions": week.solutions,
            "supervisor_comment": week.supervisor_comment
        })
        
    excel_file = log_generator.create_final_excel(weeks_data, signature_bytes)
    
    report.status = ReportStatus.COMPLETED
    db.commit()
    logger.info("Report %s finalized with %d weeks", report_id, len(weeks_data))

    return StreamingResponse(
        excel_file, 
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=log_book_final.xlsx"}
    )

@app.get("/health")
def health_check():
    logger.info("Health check ping")
    return {"status": "ok"}

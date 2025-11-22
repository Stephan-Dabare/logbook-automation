from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from database import Base
import datetime
import enum

class ReportStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    COMPLETED = "COMPLETED"

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String, index=True, default="Student") # Placeholder, can be expanded
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default=ReportStatus.DRAFT)
    
    # Relationships
    weeks = relationship("WeekEntry", back_populates="report", cascade="all, delete-orphan")

class WeekEntry(Base):
    __tablename__ = "week_entries"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"))
    week_ending = Column(String) # Storing as YYYY-MM-DD string for simplicity
    tasks_summary = Column(Text)
    tasks_json = Column(Text) # Storing JSON string of tasks list
    problems = Column(Text)
    solutions = Column(Text)
    supervisor_comment = Column(Text, nullable=True)
    
    # Relationships
    report = relationship("Report", back_populates="weeks")

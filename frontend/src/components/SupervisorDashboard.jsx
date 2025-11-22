import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SupervisorDashboard() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [weeks, setWeeks] = useState([]);
    const [signature, setSignature] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/supervisor/reports');
            setReports(res.data);
        } catch (err) {
            console.error("Error fetching reports", err);
        }
    };

    const handleSelectReport = async (report) => {
        setSelectedReport(report);
        try {
            const res = await axios.get(`http://localhost:8000/api/reports/${report.id}/weeks`);
            setWeeks(res.data);
        } catch (err) {
            console.error("Error fetching weeks", err);
        }
    };

    const handleCommentChange = async (weekId, comment) => {
        // Optimistic update
        setWeeks(weeks.map(w => w.id === weekId ? { ...w, supervisor_comment: comment } : w));
    };

    const saveComment = async (weekId, comment) => {
        try {
            const formData = new FormData();
            formData.append('comment', comment);
            await axios.post(`http://localhost:8000/api/supervisor/weeks/${weekId}/comment`, formData);
        } catch (err) {
            console.error("Error saving comment", err);
        }
    };

    const generateAIComment = async (weekId) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/supervisor/weeks/${weekId}/generate-ai-comment`);
            setWeeks(weeks.map(w => w.id === weekId ? { ...w, supervisor_comment: res.data.comment } : w));
        } catch (err) {
            console.error("Error generating AI comment", err);
        }
    };

    const handleFinalize = async () => {
        if (!signature) {
            alert("Please upload a signature.");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('signature', signature);

        try {
            const res = await axios.post(`http://localhost:8000/api/supervisor/reports/${selectedReport.id}/finalize`, formData, {
                responseType: 'blob'
            });

            // Download file
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `log_book_${selectedReport.id}.xlsx`);
            document.body.appendChild(link);
            link.click();

            alert("Report finalized and downloaded!");
            setSelectedReport(null);
            fetchReports();
        } catch (err) {
            console.error("Error finalizing report", err);
            alert("Failed to finalize report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard supervisor-dashboard">
            <div className="dashboard-header">
                <h2>Supervisor Dashboard</h2>
                <p className="dashboard-subtitle">Review and finalize student log books</p>
            </div>

            {!selectedReport ? (
                <div className="reports-list-container">
                    <div className="reports-list-header">
                        <h3>Pending Reviews</h3>
                        <span className="badge">{reports.length} Pending</span>
                    </div>

                    {reports.length === 0 ? (
                        <div className="empty-state">
                            <p>No reports pending review.</p>
                        </div>
                    ) : (
                        <div className="reports-list-view">
                            {reports.map(report => (
                                <div key={report.id} className="report-list-item" onClick={() => handleSelectReport(report)}>
                                    <div className="report-item-content">
                                        <div className="report-icon-large">📄</div>
                                        <div className="report-details">
                                            <h4>Report #{report.id}</h4>
                                            <div className="report-meta">
                                                <span>👤 {report.student_name}</span>
                                                <span>📅 {new Date(report.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="action-arrow">
                                        Review Now <span>→</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="review-container">
                    <div className="review-nav">
                        <button className="secondary-btn" onClick={() => setSelectedReport(null)}>
                            ← Back to Reports
                        </button>
                    </div>

                    <div className="review-header">
                        <h3>Reviewing Report #{selectedReport.id}</h3>
                        <span className="student-badge">{selectedReport.student_name}</span>
                    </div>

                    <div className="weeks-list">
                        {weeks.map(week => (
                            <div key={week.id} className="week-card">
                                <div className="week-header-row">
                                    <h4>Week Ending: {week.week_ending}</h4>
                                    <span className="week-tasks-count">{JSON.parse(week.tasks_json || '[]').length} Tasks</span>
                                </div>

                                <span className="section-label">Tasks Summary</span>
                                <div className="tasks-preview">
                                    {week.tasks_summary}
                                </div>

                                <div className="problems-solutions-grid">
                                    <div className="grid-item">
                                        <span className="section-label">Problems Encountered</span>
                                        <p>{week.problems}</p>
                                    </div>
                                    <div className="grid-item">
                                        <span className="section-label">Solutions Found</span>
                                        <p>{week.solutions}</p>
                                    </div>
                                </div>

                                <div className="supervisor-actions">
                                    <label>Supervisor's Comment</label>
                                    <div className="comment-box-wrapper">
                                        <textarea
                                            value={week.supervisor_comment || ''}
                                            onChange={(e) => handleCommentChange(week.id, e.target.value)}
                                            onBlur={(e) => saveComment(week.id, e.target.value)}
                                            placeholder="Enter your comments here..."
                                        />
                                        <button
                                            className="ai-btn"
                                            onClick={() => generateAIComment(week.id)}
                                        >
                                            <span>✨</span> Generate AI Comment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="finalize-section">
                        <h4>Finalize Report</h4>
                        <p>Upload your signature to sign and download the final Excel report.</p>

                        <div className="signature-upload">
                            <label style={{ display: 'block', marginBottom: '10px', color: '#ccc' }}>Upload Signature (Image)</label>
                            <input type="file" accept="image/*" onChange={e => setSignature(e.target.files[0])} style={{ color: 'white' }} />
                        </div>

                        <button
                            className="finalize-btn"
                            onClick={handleFinalize}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Sign & Download Report"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SupervisorDashboard;

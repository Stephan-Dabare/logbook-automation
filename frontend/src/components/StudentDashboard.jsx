import React, { useState } from 'react';
import axios from 'axios';

const PREVIEW_MODES = {
    SUMMARY: 'summary',
    TABLE: 'table'
};
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function StudentDashboard() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');
    const [previewMode, setPreviewMode] = useState(PREVIEW_MODES.SUMMARY);
    const [activeWeekIndex, setActiveWeekIndex] = useState(0);

    const simulateProgress = () => {
        setProgress(0);
        setProgressMessage('Uploading file...');

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }

                // Update message based on progress
                if (prev < 20) {
                    setProgressMessage('Uploading file...');
                } else if (prev < 40) {
                    setProgressMessage('Parsing Excel data...');
                } else if (prev < 60) {
                    setProgressMessage('Analyzing tasks with AI...');
                } else if (prev < 80) {
                    setProgressMessage('Generating summaries...');
                } else {
                    setProgressMessage('Finalizing report...');
                }

                return prev + 2;
            });
        }, 200);

        return interval;
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !startDate || !endDate) {
            setError("Please fill all fields.");
            return;
        }

        setLoading(true);
        setError('');
        const progressInterval = simulateProgress();

        const formData = new FormData();
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/api/student/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            clearInterval(progressInterval);
            setProgress(100);
            setProgressMessage('Complete!');

            setTimeout(() => {
                setReport(response.data);
                setPreviewMode(PREVIEW_MODES.SUMMARY);
                setActiveWeekIndex(0);
                setLoading(false);
                setProgress(0);
            }, 500);
        } catch (err) {
            clearInterval(progressInterval);
            setError("Upload failed: " + (err.response?.data?.detail || err.message));
            setLoading(false);
            setProgress(0);
        }
    };

    const handleSubmit = async () => {
        if (!report) return;
        try {
            await axios.post(`http://localhost:8000/api/student/reports/${report.report_id}/submit`);
            alert("Report submitted successfully!");
            setReport(null);
            setFile(null);
            setPreviewMode(PREVIEW_MODES.SUMMARY);
            setActiveWeekIndex(0);
        } catch (err) {
            alert("Submission failed.");
        }
    };

    const handleDownload = async () => {
        if (!report) return;
        try {
            const response = await axios.post(
                `http://localhost:8000/api/student/reports/${report.report_id}/download`,
                {},
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `log_book_preview_${report.report_id}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Download failed.");
        }
    };

    const weeks = report?.weeks || [];
    const selectedWeek = weeks[activeWeekIndex] || null;
    const totalTasks = weeks.reduce((sum, week) => sum + (week.tasks?.length || 0), 0);

    return (
        <div className="dashboard student-dashboard">
            <div className="dashboard-header">
                <h2>Student Dashboard</h2>
                <p className="dashboard-subtitle">Manage your log book entries and submissions</p>
            </div>

            {!report ? (
                <form onSubmit={handleUpload} className="upload-form">
                    <h3>Upload Log Book</h3>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Excel File</label>
                        <div className="file-input-wrapper">
                            <input type="file" accept=".xlsx" onChange={e => setFile(e.target.files[0])} required />
                        </div>
                    </div>

                    {loading && (
                        <div className="progress-container">
                            <div className="progress-bar-wrapper">
                                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="progress-message">{progressMessage}</p>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="primary-btn">
                        {loading ? "Processing..." : "Upload & Preview"}
                    </button>
                    {error && <p className="error">{error}</p>}
                </form>
            ) : (
                <div className="report-results">
                    <div className="report-actions-card">
                        <div>
                            <h3>Generated Report Ready</h3>
                            <p className="info-text">Review the weeks below or download the Excel preview before submitting.</p>
                        </div>
                        <div className="report-metrics">
                            <div className="metric">
                                <span className="metric-label">Report ID</span>
                                <span className="metric-value">{report.report_id}</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">Weeks</span>
                                <span className="metric-value">{weeks.length}</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">Total Tasks</span>
                                <span className="metric-value">{totalTasks}</span>
                            </div>
                        </div>
                        <div className="action-buttons compact">
                            <button className="secondary-btn" onClick={handleDownload}>Download Excel</button>
                            <button className="primary-btn" onClick={handleSubmit}>Submit to Supervisor</button>
                        </div>
                    </div>

                    <div className="report-layout">
                        <aside className="summary-pane">
                            <div className="summary-pane-header">
                                <h4>Weeks Overview</h4>
                                <p>Choose a week to inspect its details.</p>
                            </div>
                            <div className="summary-week-list">
                                {weeks.map((week, idx) => (
                                    <button
                                        key={idx}
                                        className={`summary-week-card ${idx === activeWeekIndex ? 'active' : ''}`}
                                        onClick={() => setActiveWeekIndex(idx)}
                                    >
                                        <div className="week-card-header">
                                            <span>Week {idx + 1}</span>
                                            <strong style={{ fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                                                {week.week_ending}
                                            </strong>
                                        </div>
                                        <div className="week-card-body">
                                            <span>{week.tasks.length} task(s)</span>
                                            <span>{week.problems ? 'Issues logged' : 'No issues noted'}</span>
                                        </div>
                                    </button>
                                ))}
                                {!weeks.length && <p className="empty-preview">No weeks were generated for this report.</p>}
                            </div>
                        </aside>

                        <section className="detail-pane">
                            <div className="detail-pane-header">
                                <div>
                                    <p className="detail-pane-subtitle">Week {activeWeekIndex + 1}{selectedWeek ? ` • Ending ${selectedWeek.week_ending}` : ''}</p>
                                    <h3>{previewMode === PREVIEW_MODES.TABLE ? 'Task Table' : 'Weekly Summary'}</h3>
                                </div>
                                <div className="preview-toggle">
                                    <button
                                        type="button"
                                        className={previewMode === PREVIEW_MODES.SUMMARY ? 'active' : ''}
                                        onClick={() => setPreviewMode(PREVIEW_MODES.SUMMARY)}
                                    >
                                        Summary
                                    </button>
                                    <button
                                        type="button"
                                        className={previewMode === PREVIEW_MODES.TABLE ? 'active' : ''}
                                        onClick={() => setPreviewMode(PREVIEW_MODES.TABLE)}
                                        style={{ marginLeft: '0.75rem' }}
                                    >
                                        Table
                                    </button>
                                </div>
                            </div>

                            {selectedWeek ? (
                                <div className="preview-content">
                                    {previewMode === PREVIEW_MODES.TABLE ? (
                                        <div className="table-preview single-week">
                                            <table className="log-table">
                                                <thead>
                                                    <tr>
                                                        <th>Day</th>
                                                        <th>Date</th>
                                                        <th>Description of Work Carried Out</th>
                                                        <th>Activity No.</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {DAYS_OF_WEEK.map((day, i) => {
                                                        const task = selectedWeek.tasks.find(t => {
                                                            const taskDate = new Date(t.date);
                                                            const weekEnd = new Date(selectedWeek.week_ending);
                                                            const daysDiff = Math.floor((weekEnd - taskDate) / (1000 * 60 * 60 * 24));
                                                            return daysDiff === (6 - i);
                                                        });

                                                        return (
                                                            <tr key={day}>
                                                                <td>{day}</td>
                                                                <td>{task ? task.date : ''}</td>
                                                                <td>{task ? task.description : ''}</td>
                                                                <td>{task ? task.activity_no : ''}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="week-summary-panel">
                                            <div className="summary-row">
                                                <div className="summary-col">
                                                    <strong>Problems Encountered</strong>
                                                    <p>{selectedWeek.problems || 'No problems documented for this week.'}</p>
                                                </div>
                                                <div className="summary-col">
                                                    <strong>Solutions Found</strong>
                                                    <p>{selectedWeek.solutions || 'No solutions documented for this week.'}</p>
                                                </div>
                                            </div>
                                            {selectedWeek.supervisor_comment && (
                                                <div className="supervisor-section">
                                                    <strong>Supervisor's Comments</strong>
                                                    <p>{selectedWeek.supervisor_comment}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="empty-preview">
                                    <p>Select a week from the left to view its details.</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;

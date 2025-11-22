import React from 'react';
import { useNavigate } from 'react-router-dom';

function RoleSelection() {
    const navigate = useNavigate();

    return (
        <div className="role-selection">
            <div className="hero-content">

                <h2>Shape Your Log Book<br />with AI Precision</h2>
                <p>
                    Discover the power of automated log book generation.
                    Empower your academic journey with AI-driven summaries and professional reporting.
                </p>

                <div className="role-cards">
                    <div className="role-card" onClick={() => navigate('/student')}>
                        <img src="/student.png" alt="Student" className="role-card-image" onError={(e) => e.target.style.display = 'none'} />
                        <div className="role-card-content">
                            <h3>I am a Student</h3>
                            <p>Upload logs, generate summaries, and submit for review.</p>
                        </div>

                    </div>

                    <div className="role-card" onClick={() => navigate('/supervisor')}>
                        <img src="/supervisor.png" alt="Supervisor" className="role-card-image" onError={(e) => e.target.style.display = 'none'} />
                        <div className="role-card-content">
                            <h3>I am a Supervisor</h3>
                            <p>Review submissions, add comments, and finalize reports.</p>
                        </div>

                    </div>
                </div>
            </div>

            <div className="hero-image-container">
                <img src="/hero-image.png" alt="Log Book Automation" className="hero-main-image" onError={(e) => e.target.src = 'https://placehold.co/500x600/EFF6FF/2563EB?text=Hero+Image'} />

                <div className="floating-badge badge-blue">
                    <span style={{ fontSize: '1.5rem' }}>☄</span>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>AI Powered</div>
                        <div style={{ fontSize: '0.7rem'}}>Instant Summaries</div>
                    </div>
                </div>

                <div className="floating-badge badge-white">
                    <span style={{ fontSize: '1.5rem' }}>ツ</span>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Verified</div>
                        <div style={{ fontSize: '0.7rem'}}>Supervisor Approved</div>
                    </div>
                </div>
            </div>

            <div className="stats-container" style={{ gridColumn: '1 / -1' }}>
                <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Accuracy Rate</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Reports Generated</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Availability</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">A+</span>
                    <span className="stat-label">Quality Score</span>
                </div>
            </div>
        </div>
    );
}

export default RoleSelection;

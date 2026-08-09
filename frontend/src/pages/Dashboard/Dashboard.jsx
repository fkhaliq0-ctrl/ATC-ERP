import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { api } from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [inquiries, setInquiries] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('inquiries');

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [statsData, inquiriesData, submissionsData] = await Promise.all([
                api.getStats(),
                api.getInquiries(),
                api.getMenuSubmissions()
            ]);
            setStats(statsData);
            setInquiries(inquiriesData);
            setSubmissions(submissionsData);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="dashboard-loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>ATC ERP Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Inquiries</h3>
                    <p className="stat-number">{stats?.total_inquiries || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Menu Submissions</h3>
                    <p className="stat-number">{stats?.total_menu_submissions || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Inquiries</h3>
                    <p className="stat-number">{stats?.pending_inquiries || 0}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="dashboard-tabs">
                <button 
                    className={activeTab === 'inquiries' ? 'active' : ''}
                    onClick={() => setActiveTab('inquiries')}
                >
                    Inquiries ({inquiries.length})
                </button>
                <button 
                    className={activeTab === 'submissions' ? 'active' : ''}
                    onClick={() => setActiveTab('submissions')}
                >
                    Menu Submissions ({submissions.length})
                </button>
            </div>

            {/* Inquiries Table */}
            {activeTab === 'inquiries' && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Type</th>
                                <th>Religion</th>
                                <th>Status</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inquiry) => (
                                <tr key={inquiry.id}>
                                    <td>#{inquiry.id}</td>
                                    <td>{inquiry.customer_name || 'N/A'}</td>
                                    <td>{inquiry.customer_phone}</td>
                                    <td>{inquiry.customer_type}</td>
                                    <td>{inquiry.religion === 'M' ? 'Muslim' : inquiry.religion === 'NM' ? 'Non-Muslim' : 'N/A'}</td>
                                    <td>
                                        <span className={`status-badge status-${inquiry.status?.toLowerCase() || 'new'}`}>
                                            {inquiry.status || 'New'}
                                        </span>
                                    </td>
                                    <td>{new Date(inquiry.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {inquiries.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="no-data">No inquiries yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Menu Submissions Table */}
            {activeTab === 'submissions' && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Gathering Type</th>
                                <th>Venue</th>
                                <th>Pax</th>
                                <th>Event Date</th>
                                <th>Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((submission) => (
                                <tr key={submission.id}>
                                    <td>#{submission.id}</td>
                                    <td>{submission.customer_name || 'N/A'}</td>
                                    <td>{submission.customer_phone}</td>
                                    <td>{submission.gathering_type || 'N/A'}</td>
                                    <td>{submission.venue || 'N/A'}</td>
                                    <td>{submission.pax || 'N/A'}</td>
                                    <td>{submission.event_date ? new Date(submission.event_date).toLocaleDateString() : 'N/A'}</td>
                                    <td>{new Date(submission.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {submissions.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="no-data">No menu submissions yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
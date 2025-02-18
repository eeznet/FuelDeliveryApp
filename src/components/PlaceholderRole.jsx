import React from 'react';

export const PlaceholderRole = ({ role }) => {
    return (
        <div className="placeholder-role">
            <h2>{role} Dashboard</h2>
            <p>This feature is coming soon!</p>
            <p>Contact the owner to activate this role.</p>
            {role === 'Supervisor' && (
                <div className="feature-list">
                    <h3>Upcoming Features:</h3>
                    <ul>
                        <li>Driver Management</li>
                        <li>Schedule Optimization</li>
                        <li>Emergency Response</li>
                        <li>Performance Monitoring</li>
                    </ul>
                </div>
            )}
            {role === 'Finance Manager' && (
                <div className="feature-list">
                    <h3>Upcoming Features:</h3>
                    <ul>
                        <li>Invoice Management</li>
                        <li>Financial Reporting</li>
                        <li>Credit Control</li>
                        <li>Accounting Integration</li>
                    </ul>
                </div>
            )}
        </div>
    );
}; 
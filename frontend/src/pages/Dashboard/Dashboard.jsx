import React from 'react';
import { MdDashboard, MdPeople, MdReceipt, MdTrendingUp } from 'react-icons/md';

const Dashboard = () => {
  return (
    <div style={{ 
      padding: '24px', 
      color: '#fff', 
      background: '#0a0a0a', 
      minHeight: '100vh',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h1 style={{ color: '#f5c842', fontSize: '28px', marginBottom: '4px' }}>
        <MdDashboard style={{ verticalAlign: 'middle', marginRight: '8px' }} />
        Zebaish Dashboard
      </h1>
      <p style={{ color: '#888', marginBottom: '24px' }}>Allied Trading Corporation - ERP System</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #2a2a2a' }}>
          <h3 style={{ color: '#888', fontSize: '14px' }}>Today's Sales</h3>
          <p style={{ color: '#f5c842', fontSize: '24px', fontWeight: 'bold' }}>?0</p>
        </div>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #2a2a2a' }}>
          <h3 style={{ color: '#888', fontSize: '14px' }}>Month's Sales</h3>
          <p style={{ color: '#f5c842', fontSize: '24px', fontWeight: 'bold' }}>?0</p>
        </div>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #2a2a2a' }}>
          <h3 style={{ color: '#888', fontSize: '14px' }}>Total Customers</h3>
          <p style={{ color: '#f5c842', fontSize: '24px', fontWeight: 'bold' }}>0</p>
        </div>
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #2a2a2a' }}>
          <h3 style={{ color: '#888', fontSize: '14px' }}>Total Invoices</h3>
          <p style={{ color: '#f5c842', fontSize: '24px', fontWeight: 'bold' }}>0</p>
        </div>
      </div>
      
      <div style={{ 
        background: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '12px', 
        border: '1px solid #2a2a2a',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>Dashboard is being rebuilt. Features will be available soon.</p>
      </div>
    </div>
  );
};

export default Dashboard;
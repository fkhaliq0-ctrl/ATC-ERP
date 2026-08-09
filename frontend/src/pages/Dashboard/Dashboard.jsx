import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    purchaseOrders: 0,
    salesOrders: 0,
    lowStock: 0
  });
  const [loading, setLoading] = useState(true);

  const MENU_LINK = 'https://free-flies-say.loca.lt/book-event?category=Normal%20Booking';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, customersRes, purchaseOrdersRes, salesOrdersRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/items/'),
          fetch('http://127.0.0.1:8000/api/customers/'),
          fetch('http://127.0.0.1:8000/api/purchase-orders/'),
          fetch('http://127.0.0.1:8000/api/sales-orders/')
        ]);

        const items = await itemsRes.json();
        const customers = await customersRes.json();
        const purchaseOrders = await purchaseOrdersRes.json();
        const salesOrders = await salesOrdersRes.json();

        const lowStockItems = items.filter(item => item.stock_quantity <= item.reorder_level);

        setStats({
          products: items.length,
          customers: customers.length,
          purchaseOrders: purchaseOrders.length,
          salesOrders: salesOrders.length,
          lowStock: lowStockItems.length
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Welcome back, Admin! Here is your business summary.</p>
      </div>

      {/* Menu Link Section */}
      <div className="menu-link-card">
        <h3>🔗 Customer Menu Selection Link</h3>
        <p>Share this link with customers to let them customize their menu:</p>
        <div className="menu-link-box">
          <input type="text" value={MENU_LINK} readOnly />
          <button onClick={() => navigator.clipboard.writeText(MENU_LINK)}>📋 Copy</button>
        </div>
        <a href={MENU_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary">
          🌐 Open Menu Link
        </a>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>📦 Total Products</h3>
          <p className="stat-number">{stats.products}</p>
          <small>Click to manage inventory</small>
        </div>
        <div className="stat-card">
          <h3>👥 Total Customers</h3>
          <p className="stat-number">{stats.customers}</p>
          <small>Click to view customers</small>
        </div>
        <div className="stat-card">
          <h3>🛒 Purchase Orders</h3>
          <p className="stat-number">{stats.purchaseOrders}</p>
          <small>Total purchase orders</small>
        </div>
        <div className="stat-card">
          <h3>📦 Sales Orders</h3>
          <p className="stat-number">{stats.salesOrders}</p>
          <small>Total sales orders</small>
        </div>
        <div className="stat-card">
          <h3>⚠️ Low Stock Alert</h3>
          <p className="stat-number">{stats.lowStock}</p>
          <small>Items below reorder level</small>
        </div>
      </div>

      <div className="recent-section">
        <h2>📋 Recent Activity</h2>
        <p style={{ color: '#888' }}>Recent orders will appear here soon.</p>
      </div>
    </div>
  );
};

export default Dashboard;

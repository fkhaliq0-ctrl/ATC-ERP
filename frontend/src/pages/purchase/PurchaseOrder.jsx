import React, { useState, useEffect } from 'react';

const PurchaseOrder = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch purchase orders and vendors
        const ordersRes = await fetch('http://192.168.100.75:8000/api/purchase-orders/');
        const vendorsRes = await fetch('http://192.168.100.75:8000/api/vendors/');
        
        if (!ordersRes.ok || !vendorsRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const ordersData = await ordersRes.json();
        const vendorsData = await vendorsRes.json();
        
        setPurchaseOrders(ordersData);
        setVendors(vendorsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get vendor name by ID
  const getVendorName = (vendorId) => {
    if (!vendors || vendors.length === 0) return 'Loading...';
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : 'Unknown Vendor';
  };

  if (loading) {
    return <div className="loading">Loading purchase orders...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="purchase-order-container">
      <h1>?? Purchase Orders</h1>
      <button className="btn-primary">+ New Purchase Order</button>

      {purchaseOrders.length === 0 ? (
        <p>No purchase orders found. Create your first one!</p>
      ) : (
        <table className="purchase-order-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Vendor</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.po_number}</td>
                <td>{getVendorName(order.vendor)}</td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>?{order.total_amount}</td>
                <td>
                  <span className={`status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="btn-edit">?? Edit</button>
                  <button className="btn-view">??? View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PurchaseOrder;

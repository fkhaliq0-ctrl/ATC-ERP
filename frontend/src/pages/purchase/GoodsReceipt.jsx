import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000/api';

const GoodsReceipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receiptsRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/goods-receipts/`),
          fetch(`${API_URL}/purchase-orders/`)
        ]);
        const receiptsData = await receiptsRes.json();
        const ordersData = await ordersRes.json();
        setReceipts(receiptsData);
        setPurchaseOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPONumber = (id) => {
    const order = purchaseOrders.find(o => o.id === id);
    return order ? order.po_number : 'N/A';
  };

  if (loading) return <div>Loading goods receipts...</div>;

  return (
    <div className="purchase-container">
      <h1>📦 Goods Receipt</h1>
      <button className="btn-primary">+ New Goods Receipt</button>
      
      {receipts.length === 0 ? (
        <p>No goods receipts found.</p>
      ) : (
        <table className="purchase-table">
          <thead>
            <tr>
              <th>Receipt ID</th>
              <th>PO Number</th>
              <th>Receipt Date</th>
              <th>Received By</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.id}>
                <td>GR-{receipt.id}</td>
                <td>{getPONumber(receipt.purchase_order)}</td>
                <td>{new Date(receipt.receipt_date).toLocaleDateString()}</td>
                <td>{receipt.received_by}</td>
                <td>{receipt.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GoodsReceipt;

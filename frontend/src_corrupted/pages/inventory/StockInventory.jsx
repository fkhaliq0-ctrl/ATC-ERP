import React, { useState } from 'react';

const StockInventory = () => {
  const [stockList, setStockList] = useState([
    {
      id: 'STK-001',
      itemName: 'Boneless Chicken',
      warehouse: 'Main Central Godown',
      batchNo: 'BATCH-20260804-A',
      currentStock: 400,
      unit: 'Kg',
      unitCost: 180,
      totalValue: 72000,
      expiryDate: '2026-08-10',
      status: 'Healthy'
    },
    {
      id: 'STK-002',
      itemName: 'Whole Chicken',
      warehouse: 'Cold Storage Unit 1',
      batchNo: 'BATCH-20260802-B',
      currentStock: 150,
      unit: 'Kg',
      unitCost: 150,
      totalValue: 22500,
      expiryDate: '2026-08-06',
      status: 'Near Expiry'
    }
  ]);

  const [transferData, setTransferData] = useState({
    item: 'Boneless Chicken',
    fromWarehouse: 'Main Central Godown',
    toWarehouse: 'Cold Storage Unit 1',
    qty: '',
    notes: ''
  });

  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    setTransferData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferData.qty || parseFloat(transferData.qty) <= 0) {
      return alert('Please enter a valid transfer quantity.');
    }
    alert('Stock transfer entry saved successfully!');
    setTransferData({
      item: 'Boneless Chicken',
      fromWarehouse: 'Main Central Godown',
      toWarehouse: 'Cold Storage Unit 1',
      qty: '',
      notes: ''
    });
  };

  const totalStockValue = stockList.reduce((acc, curr) => acc + curr.totalValue, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📦 Real-Time Stock & Godown Inventory</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <div style={{ background: '#007bff', color: '#fff', padding: '15px 20px', borderRadius: '8px', flex: '1' }}>
          <span style={{ fontSize: '13px', textTransform: 'uppercase' }}>Total Godown Valuation</span>
          <h2 style={{ margin: '5px 0 0 0' }}>₹{totalStockValue.toLocaleString('en-IN')}</h2>
        </div>
        <div style={{ background: '#28a745', color: '#fff', padding: '15px 20px', borderRadius: '8px', flex: '1' }}>
          <span style={{ fontSize: '13px', textTransform: 'uppercase' }}>Total Live Batches</span>
          <h2 style={{ margin: '5px 0 0 0' }}>{stockList.length} Batches</h2>
        </div>
        <div style={{ background: '#ffc107', color: '#000', padding: '15px 20px', borderRadius: '8px', flex: '1' }}>
          <span style={{ fontSize: '13px', textTransform: 'uppercase' }}>Near Expiry Items</span>
          <h2 style={{ margin: '5px 0 0 0' }}>1 Batch</h2>
        </div>
      </div>

      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #dee2e6' }}>
        <h3>🔄 Inter-Godown Stock Transfer</h3>
        <form onSubmit={handleTransferSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Item</label>
            <select name='item' value={transferData.item} onChange={handleTransferChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value='Boneless Chicken'>Boneless Chicken</option>
              <option value='Whole Chicken'>Whole Chicken</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>From Godown</label>
            <select name='fromWarehouse' value={transferData.fromWarehouse} onChange={handleTransferChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value='Main Central Godown'>Main Central Godown</option>
              <option value='Cold Storage Unit 1'>Cold Storage Unit 1</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>To Godown</label>
            <select name='toWarehouse' value={transferData.toWarehouse} onChange={handleTransferChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value='Cold Storage Unit 1'>Cold Storage Unit 1</option>
              <option value='Main Central Godown'>Main Central Godown</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Transfer Qty (Kg)</label>
            <input type='number' name='qty' value={transferData.qty} onChange={handleTransferChange} placeholder='e.g. 50' style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <button type='submit' style={{ padding: '9px 15px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Execute Transfer
          </button>
        </form>
      </div>

      <h3>Live Batch Stock Register</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#343a40', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Stock ID</th>
            <th style={{ padding: '10px' }}>Item Name</th>
            <th style={{ padding: '10px' }}>Warehouse / Godown</th>
            <th style={{ padding: '10px' }}>Batch No.</th>
            <th style={{ padding: '10px' }}>Qty On Hand</th>
            <th style={{ padding: '10px' }}>Unit Cost</th>
            <th style={{ padding: '10px' }}>Total Value</th>
            <th style={{ padding: '10px' }}>Expiry Date</th>
            <th style={{ padding: '10px' }}>Health</th>
          </tr>
        </thead>
        <tbody>
          {stockList.map((s) => (
            <tr key={s.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.id}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.itemName}</td>
              <td style={{ padding: '10px' }}>{s.warehouse}</td>
              <td style={{ padding: '10px', fontFamily: 'monospace' }}>{s.batchNo}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.currentStock} {s.unit}</td>
              <td style={{ padding: '10px' }}>₹{s.unitCost}</td>
              <td style={{ padding: '10px', fontWeight: 'bold', color: '#28a745' }}>₹{s.totalValue.toLocaleString('en-IN')}</td>
              <td style={{ padding: '10px' }}>{s.expiryDate}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  background: s.status === 'Healthy' ? '#d4edda' : '#fff3cd',
                  color: s.status === 'Healthy' ? '#155724' : '#856404',
                  padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold'
                }}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockInventory;

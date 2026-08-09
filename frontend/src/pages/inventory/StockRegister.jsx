import React, { useState } from 'react';
const StockRegister = () => {
  const [stocks, setStocks] = useState([
    { id: 1, item: 'Chicken Whole', category: 'Chicken', currentQty: 250, unit: 'Kg', minQty: 50 },
    { id: 2, item: 'Mutton Curry Cut', category: 'Mutton', currentQty: 120, unit: 'Kg', minQty: 30 },
    { id: 3, item: 'Fish Rohu', category: 'Fish', currentQty: 15, unit: 'Kg', minQty: 20 },
  ]);
  const [adjustItem, setAdjustItem] = useState('');
  const [adjustQty, setAdjustQty] = useState('');
  const [type, setType] = useState('Add');

  const handleAdjust = (e) => {
    e.preventDefault();
    if (!adjustItem || !adjustQty) return;
    setStocks(stocks.map(s => {
      if (s.item.toLowerCase() === adjustItem.toLowerCase()) {
        const delta = type === 'Add' ? Number(adjustQty) : -Number(adjustQty);
        return { ...s, currentQty: Math.max(0, s.currentQty + delta) };
      }
      return s;
    }));
    setAdjustItem(''); setAdjustQty(''); alert('Stock level adjusted!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Real-Time Inventory & Stock Register</h2>
      <form onSubmit={handleAdjust} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input type='text' placeholder='Item Name (e.g. Chicken Whole)' value={adjustItem} onChange={e=>setAdjustItem(e.target.value)} required style={{ flex: 2, padding: '8px' }} />
        <select value={type} onChange={e=>setType(e.target.value)} style={{ padding: '8px' }}>
          <option value='Add'>+ Add Stock (Inward)</option>
          <option value='Deduct'>- Deduct Stock (Outward / Damage)</option>
        </select>
        <input type='number' placeholder='Qty' value={adjustQty} onChange={e=>setAdjustQty(e.target.value)} required style={{ flex: 1, padding: '8px' }} />
        <button type='submit' style={{ padding: '8px 20px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px' }}>Update Stock</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: '#343a40', color: '#fff' }}><th style={{ padding: '10px' }}>Item Name</th><th style={{ padding: '10px' }}>Category</th><th style={{ padding: '10px' }}>Live Stock</th><th style={{ padding: '10px' }}>UOM</th><th style={{ padding: '10px' }}>Stock Alert</th></tr></thead>
        <tbody>
          {stocks.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.item}</td>
              <td style={{ padding: '10px' }}>{s.category}</td>
              <td style={{ padding: '10px', fontSize: '16px', fontWeight: 'bold' }}>{s.currentQty}</td>
              <td style={{ padding: '10px' }}>{s.unit}</td>
              <td style={{ padding: '10px' }}>
                {s.currentQty <= s.minQty ? (
                  <span style={{ backgroundColor: '#dc3545', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>Low Stock Alert</span>
                ) : (
                  <span style={{ backgroundColor: '#28a745', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>Optimal</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default StockRegister;
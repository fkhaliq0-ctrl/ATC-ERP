import React, { useState } from 'react';
const SalesOrder = () => {
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState([{ item: '', qty: 1, price: 0 }]);
  const addItem = () => setItems([...items, { item: '', qty: 1, price: 0 }]);
  const submit = (e) => {
    e.preventDefault();
    const grand = items.reduce((a, b) => a + (Number(b.qty)*Number(b.price)), 0);
    setOrders([...orders, { id: 'SO-'+Date.now().toString().slice(-4), customer, grand }]);
    setCustomer(''); setItems([{ item: '', qty: 1, price: 0 }]);
  };
  return (
    <div style={{ padding: '20px' }}>
      <h2>Sales Order (SO)</h2>
      <form onSubmit={submit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <input type='text' placeholder='Customer Name *' value={customer} onChange={e=>setCustomer(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} />
        {items.map((it, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <input type='text' placeholder='Item Name' value={it.item} onChange={e=>{const u=[...items]; u[idx].item=e.target.value; setItems(u);}} required style={{ padding: '8px' }} />
            <input type='number' placeholder='Qty' value={it.qty} onChange={e=>{const u=[...items]; u[idx].qty=e.target.value; setItems(u);}} required style={{ padding: '8px' }} />
            <input type='number' placeholder='Price (₹)' value={it.price} onChange={e=>{const u=[...items]; u[idx].price=e.target.value; setItems(u);}} required style={{ padding: '8px' }} />
          </div>
        ))}
        <button type='button' onClick={addItem} style={{ padding: '6px 12px', marginBottom: '15px' }}>+ Add Row</button>
        <button type='submit' style={{ display: 'block', padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>Save Sales Order</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: '#343a40', color: '#fff' }}><th style={{ padding: '8px' }}>SO #</th><th style={{ padding: '8px' }}>Customer</th><th style={{ padding: '8px' }}>Amount</th></tr></thead>
        <tbody>{orders.map(o => <tr key={o.id} style={{ borderBottom: '1px solid #ccc' }}><td style={{ padding: '8px' }}>{o.id}</td><td style={{ padding: '8px' }}>{o.customer}</td><td style={{ padding: '8px' }}>₹{o.grand}</td></tr>)}</tbody>
      </table>
    </div>
  );
};
export default SalesOrder;
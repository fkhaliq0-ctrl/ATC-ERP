import React, { useState } from 'react';
const DeliveryChallan = () => {
  const [challans, setChallans] = useState([]);
  const [form, setForm] = useState({ soNo: '', customer: '', vehicleNo: '', dispatchQty: '' });
  const submit = (e) => { e.preventDefault(); setChallans([...challans, { ...form, id: 'DC-'+Date.now().toString().slice(-4) }]); setForm({ soNo: '', customer: '', vehicleNo: '', dispatchQty: '' }); };
  return (
    <div style={{ padding: '20px' }}>
      <h2>Delivery Challan (Dispatch)</h2>
      <form onSubmit={submit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <input type='text' placeholder='SO Ref #' value={form.soNo} onChange={e=>setForm({...form, soNo: e.target.value})} style={{ padding: '8px' }} />
          <input type='text' placeholder='Customer Name' value={form.customer} onChange={e=>setForm({...form, customer: e.target.value})} required style={{ padding: '8px' }} />
          <input type='text' placeholder='Vehicle No.' value={form.vehicleNo} onChange={e=>setForm({...form, vehicleNo: e.target.value})} style={{ padding: '8px' }} />
          <input type='number' placeholder='Dispatched Qty' value={form.dispatchQty} onChange={e=>setForm({...form, dispatchQty: e.target.value})} required style={{ padding: '8px' }} />
        </div>
        <button type='submit' style={{ padding: '8px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>Generate Delivery Challan</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: '#343a40', color: '#fff' }}><th style={{ padding: '8px' }}>Challan #</th><th style={{ padding: '8px' }}>Customer</th><th style={{ padding: '8px' }}>Vehicle</th><th style={{ padding: '8px' }}>Qty</th></tr></thead>
        <tbody>{challans.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #ccc' }}><td style={{ padding: '8px' }}>{c.id}</td><td style={{ padding: '8px' }}>{c.customer}</td><td style={{ padding: '8px' }}>{c.vehicleNo}</td><td style={{ padding: '8px' }}>{c.dispatchQty}</td></tr>)}</tbody>
      </table>
    </div>
  );
};
export default DeliveryChallan;
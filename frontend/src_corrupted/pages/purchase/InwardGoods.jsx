import React, { useState } from 'react';
const InwardGoods = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ poNo: '', item: '', qty: '', batch: '' });
  const submit = (e) => { e.preventDefault(); setLogs([...logs, { ...form, id: 'GRN-'+Date.now().toString().slice(-4) }]); setForm({ poNo: '', item: '', qty: '', batch: '' }); };
  return (
    <div style={{ padding: '20px' }}>
      <h2>Inward Goods / GRN</h2>
      <form onSubmit={submit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <input type='text' placeholder='PO Ref #' value={form.poNo} onChange={e=>setForm({...form, poNo: e.target.value})} style={{ padding: '8px' }} />
          <input type='text' placeholder='Item Name *' value={form.item} onChange={e=>setForm({...form, item: e.target.value})} required style={{ padding: '8px' }} />
          <input type='number' placeholder='Received Qty *' value={form.qty} onChange={e=>setForm({...form, qty: e.target.value})} required style={{ padding: '8px' }} />
          <input type='text' placeholder='Batch No.' value={form.batch} onChange={e=>setForm({...form, batch: e.target.value})} style={{ padding: '8px' }} />
        </div>
        <button type='submit' style={{ padding: '8px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>Record GRN</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: '#343a40', color: '#fff' }}><th style={{ padding: '8px' }}>GRN #</th><th style={{ padding: '8px' }}>PO #</th><th style={{ padding: '8px' }}>Item</th><th style={{ padding: '8px' }}>Qty</th></tr></thead>
        <tbody>{logs.map(l => <tr key={l.id} style={{ borderBottom: '1px solid #ccc' }}><td style={{ padding: '8px' }}>{l.id}</td><td style={{ padding: '8px' }}>{l.poNo}</td><td style={{ padding: '8px' }}>{l.item}</td><td style={{ padding: '8px' }}>{l.qty}</td></tr>)}</tbody>
      </table>
    </div>
  );
};
export default InwardGoods;
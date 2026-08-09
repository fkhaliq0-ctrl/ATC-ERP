import React, { useState } from 'react';
const TaxInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({ customer: '', amount: '', taxRate: '18' });
  const submit = (e) => {
    e.preventDefault();
    const tax = Number(form.amount) * (Number(form.taxRate)/100);
    setInvoices([...invoices, { ...form, tax, total: Number(form.amount)+tax, id: 'INV-'+Date.now().toString().slice(-4) }]);
    setForm({ customer: '', amount: '', taxRate: '18' });
  };
  return (
    <div style={{ padding: '20px' }}>
      <h2>GST Tax Invoice</h2>
      <form onSubmit={submit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <input type='text' placeholder='Customer Name *' value={form.customer} onChange={e=>setForm({...form, customer: e.target.value})} required style={{ padding: '8px' }} />
          <input type='number' placeholder='Taxable Amount (₹) *' value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} required style={{ padding: '8px' }} />
          <select value={form.taxRate} onChange={e=>setForm({...form, taxRate: e.target.value})} style={{ padding: '8px' }}>
            <option value='0'>0% GST</option><option value='5'>5% GST</option><option value='12'>12% GST</option><option value='18'>18% GST</option><option value='28'>28% GST</option>
          </select>
        </div>
        <button type='submit' style={{ padding: '8px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>Create Tax Invoice</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: '#343a40', color: '#fff' }}><th style={{ padding: '8px' }}>Invoice #</th><th style={{ padding: '8px' }}>Customer</th><th style={{ padding: '8px' }}>Taxable</th><th style={{ padding: '8px' }}>GST</th><th style={{ padding: '8px' }}>Total Amount</th></tr></thead>
        <tbody>{invoices.map(i => <tr key={i.id} style={{ borderBottom: '1px solid #ccc' }}><td style={{ padding: '8px' }}>{i.id}</td><td style={{ padding: '8px' }}>{i.customer}</td><td style={{ padding: '8px' }}>₹{i.amount}</td><td style={{ padding: '8px' }}>₹{i.tax.toFixed(2)}</td><td style={{ padding: '8px', fontWeight: 'bold', color: '#28a745' }}>₹{i.total.toFixed(2)}</td></tr>)}</tbody>
      </table>
    </div>
  );
};
export default TaxInvoice;
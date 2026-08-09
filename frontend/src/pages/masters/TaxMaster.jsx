import React, { useState } from 'react';

const TaxMaster = () => {
  const [taxList, setTaxList] = useState([
    { id: 'TAX-0001', taxName: 'GST 0% (Exempt)', rate: 0, cgst: 0, sgst: 0, igst: 0, taxType: 'Exempt', description: 'Nil rated or exempted goods' },
    { id: 'TAX-0002', taxName: 'GST 5%', rate: 5, cgst: 2.5, sgst: 2.5, igst: 5, taxType: 'Standard', description: 'Essential food and items' },
    { id: 'TAX-0003', taxName: 'GST 12%', rate: 12, cgst: 6, sgst: 6, igst: 12, taxType: 'Standard', description: 'Processed items and apparel' },
    { id: 'TAX-0004', taxName: 'GST 18%', rate: 18, cgst: 9, sgst: 9, igst: 18, taxType: 'Standard', description: 'Services and standard goods' },
    { id: 'TAX-0005', taxName: 'GST 28%', rate: 28, cgst: 14, sgst: 14, igst: 28, taxType: 'Standard', description: 'Luxury and sin goods' }
  ]);

  const [formData, setFormData] = useState({
    taxName: '',
    rate: 18,
    cgst: 9,
    sgst: 9,
    igst: 18,
    taxType: 'Standard',
    description: ''
  });

  const handleRateChange = (totalRate) => {
    const rateVal = parseFloat(totalRate) || 0;
    const half = rateVal / 2;
    setFormData((prev) => ({
      ...prev,
      rate: rateVal,
      cgst: half,
      sgst: half,
      igst: rateVal
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rate') {
      handleRateChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.taxName) {
      return alert('Tax Name is required');
    }

    setTaxList([
      ...taxList,
      {
        ...formData,
        id: 'TAX-' + Date.now().toString().slice(-4)
      }
    ]);

    setFormData({
      taxName: '',
      rate: 18,
      cgst: 9,
      sgst: 9,
      igst: 18,
      taxType: 'Standard',
      description: ''
    });

    alert('Tax Slab saved successfully!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🏛️ Tax Master</h2>

      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #dee2e6' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tax Name / Label *</label>
            <input
              type='text'
              name='taxName'
              value={formData.taxName}
              onChange={handleChange}
              required
              placeholder='e.g. GST 18%, Exempt Goods'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Tax Type</label>
            <select
              name='taxType'
              value={formData.taxType}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value='Standard'>Standard GST</option>
              <option value='Exempt'>Exempt / Nil Rated</option>
              <option value='Special'>Special / Cess</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
            <input
              type='text'
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Notes on applicability'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ background: '#eef2f5', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>GST Breakdown</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Total Rate (%)</label>
              <input
                type='number'
                name='rate'
                value={formData.rate}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>CGST (%)</label>
              <input
                type='number'
                name='cgst'
                value={formData.cgst}
                disabled
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#e9ecef' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>SGST (%)</label>
              <input
                type='number'
                name='sgst'
                value={formData.sgst}
                disabled
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#e9ecef' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>IGST (%)</label>
              <input
                type='number'
                name='igst'
                value={formData.igst}
                disabled
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#e9ecef' }}
              />
            </div>
          </div>
        </div>

        <button type='submit' style={{ padding: '10px 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Save Tax Master
        </button>
      </form>

      <h3>Configured Tax Slabs</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#343a40', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Tax ID</th>
            <th style={{ padding: '10px' }}>Tax Name</th>
            <th style={{ padding: '10px' }}>Type</th>
            <th style={{ padding: '10px' }}>Total Rate</th>
            <th style={{ padding: '10px' }}>Breakdown (CGST / SGST / IGST)</th>
            <th style={{ padding: '10px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {taxList.map((t) => (
            <tr key={t.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{t.id}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{t.taxName}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ background: t.taxType === 'Exempt' ? '#d4edda' : '#e2e3e5', color: t.taxType === 'Exempt' ? '#155724' : '#383d41', padding: '3px 8px', borderRadius: '4px' }}>
                  {t.taxType}
                </span>
              </td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{t.rate}%</td>
              <td style={{ padding: '10px' }}>CGST: {t.cgst}% | SGST: {t.sgst}% | IGST: {t.igst}%</td>
              <td style={{ padding: '10px' }}>{t.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaxMaster;

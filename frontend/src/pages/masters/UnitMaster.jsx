import React, { useState } from 'react';

const UnitMaster = () => {
  const [units, setUnits] = useState([
    { id: 'UNIT-0001', unitName: 'Kilograms', unitCode: 'KGS', description: 'Weight measurement' },
    { id: 'UNIT-0002', unitName: 'Meters', unitCode: 'MTR', description: 'Length measurement' },
    { id: 'UNIT-0003', unitName: 'Pieces', unitCode: 'PCS', description: 'Countable items' },
    { id: 'UNIT-0004', unitName: 'Box', unitCode: 'BOX', description: 'Box packaging' },
    { id: 'UNIT-0005', unitName: 'Packet', unitCode: 'PKT', description: 'Small packets' },
    { id: 'UNIT-0006', unitName: 'Lump Sum', unitCode: 'LUM', description: 'Fixed whole amount' },
    { id: 'UNIT-0007', unitName: 'Monthly', unitCode: 'MTH', description: 'Recurring monthly charge' }
  ]);

  const [formData, setFormData] = useState({
    unitName: '',
    unitCode: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.unitName || !formData.unitCode) {
      return alert('Unit Name and Unit Code are required');
    }

    setUnits([
      ...units,
      {
        ...formData,
        unitCode: formData.unitCode.toUpperCase(),
        id: 'UNIT-' + Date.now().toString().slice(-4)
      }
    ]);

    setFormData({
      unitName: '',
      unitCode: '',
      description: ''
    });

    alert('Unit saved successfully!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📏 Unit Master (UOM)</h2>

      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #dee2e6' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Unit Name *</label>
            <input
              type='text'
              name='unitName'
              value={formData.unitName}
              onChange={handleChange}
              required
              placeholder='e.g. Kilograms, Pieces, Box'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Unit Code / Abbreviation *</label>
            <input
              type='text'
              name='unitCode'
              value={formData.unitCode}
              onChange={handleChange}
              required
              placeholder='e.g. KGS, PCS, BOX'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
            <input
              type='text'
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Optional notes or usage context'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <button type='submit' style={{ padding: '10px 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Save Unit Master
        </button>
      </form>

      <h3>Defined Measurement Units</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#343a40', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Unit ID</th>
            <th style={{ padding: '10px' }}>Unit Name</th>
            <th style={{ padding: '10px' }}>Unit Code</th>
            <th style={{ padding: '10px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {units.length === 0 ? (
            <tr><td colSpan='4' style={{ padding: '15px', color: '#6c757d' }}>No units defined yet.</td></tr>
          ) : (
            units.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{u.id}</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{u.unitName}</td>
                <td style={{ padding: '10px' }}><span style={{ background: '#e9ecef', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{u.unitCode}</span></td>
                <td style={{ padding: '10px' }}>{u.description || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UnitMaster;

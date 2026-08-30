import React, { useState } from 'react';

const WarehouseMaster = () => {
  const [warehouses, setWarehouses] = useState([
    {
      id: 'WH-0001',
      name: 'Main Central Godown',
      code: 'WH-MAIN',
      type: 'Central Warehouse',
      address: 'Plot 42, Industrial Area, Phase-2',
      city: 'Delhi',
      contactPerson: 'Rajesh Kumar',
      phone: '9876543210',
      isDefault: true
    },
    {
      id: 'WH-0002',
      name: 'Cold Storage Unit 1',
      code: 'WH-COLD1',
      type: 'Cold Storage',
      address: 'Gate No. 3, Wholesale Market',
      city: 'Delhi',
      contactPerson: 'Suresh Verma',
      phone: '9812345678',
      isDefault: false
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Godown',
    address: '',
    city: '',
    contactPerson: '',
    phone: '',
    isDefault: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      return alert('Warehouse Name and Code are required.');
    }

    const updatedList = formData.isDefault
      ? warehouses.map((w) => ({ ...w, isDefault: false }))
      : [...warehouses];

    setWarehouses([
      ...updatedList,
      {
        ...formData,
        code: formData.code.toUpperCase(),
        id: 'WH-' + Date.now().toString().slice(-4)
      }
    ]);

    setFormData({
      name: '',
      code: '',
      type: 'Godown',
      address: '',
      city: '',
      contactPerson: '',
      phone: '',
      isDefault: false
    });

    alert('Warehouse saved successfully!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🏭 Warehouse / Godown Master</h2>

      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #dee2e6' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Warehouse / Godown Name *</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              placeholder='e.g. Main Godown, Cold Store B'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Short Code *</label>
            <input
              type='text'
              name='code'
              value={formData.code}
              onChange={handleChange}
              required
              placeholder='e.g. WH-MAIN, CS-01'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Storage Type</label>
            <select
              name='type'
              value={formData.type}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value='Godown'>Standard Godown</option>
              <option value='Central Warehouse'>Central Warehouse</option>
              <option value='Cold Storage'>Cold Storage</option>
              <option value='Transit Storage'>Transit / Buffer Hub</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Address</label>
            <input
              type='text'
              name='address'
              value={formData.address}
              onChange={handleChange}
              placeholder='Street address / Plot number'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>City / Location</label>
            <input
              type='text'
              name='city'
              value={formData.city}
              onChange={handleChange}
              placeholder='e.g. Delhi, Gurgaon'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Contact Person / In-Charge</label>
            <input
              type='text'
              name='contactPerson'
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder='Manager name'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Contact Phone</label>
            <input
              type='text'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              placeholder='Mobile number'
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <input
              type='checkbox'
              name='isDefault'
              checked={formData.isDefault}
              onChange={handleChange}
              style={{ width: '18px', height: '18px' }}
            />
            <span>⭐ Set as Primary Receiving Warehouse</span>
          </label>
        </div>

        <button type='submit' style={{ padding: '10px 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Save Warehouse
        </button>
      </form>

      <h3>Configured Warehouses & Godowns</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#343a40', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>WH ID</th>
            <th style={{ padding: '10px' }}>Warehouse Name</th>
            <th style={{ padding: '10px' }}>Code</th>
            <th style={{ padding: '10px' }}>Type</th>
            <th style={{ padding: '10px' }}>Address & City</th>
            <th style={{ padding: '10px' }}>In-Charge</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((w) => (
            <tr key={w.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{w.id}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{w.name}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ background: '#e9ecef', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                  {w.code}
                </span>
              </td>
              <td style={{ padding: '10px' }}>{w.type}</td>
              <td style={{ padding: '10px' }}>
                {w.address ? w.address : ''}{w.city ? ', ' + w.city : ''}
              </td>
              <td style={{ padding: '10px' }}>
                {w.contactPerson ? w.contactPerson : '-'}{w.phone ? ' (' + w.phone + ')' : ''}
              </td>
              <td style={{ padding: '10px' }}>
                {w.isDefault ? (
                  <span style={{ background: '#fff3cd', color: '#856404', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    ⭐ Primary Location
                  </span>
                ) : (
                  <span style={{ background: '#e2e3e5', color: '#383d41', padding: '3px 8px', borderRadius: '4px' }}>
                    Secondary
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WarehouseMaster;

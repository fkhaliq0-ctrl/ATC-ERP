import React from 'react';
import { Link } from 'react-router-dom';
import './MastersModule.css';

const MastersModule = () => {
  const masters = [
    { name: 'Customer', path: '/masters/customer', icon: '👤' },
    { name: 'Vendor', path: '/masters/vendor', icon: '🏢' },
    { name: 'Item', path: '/masters/item', icon: '📦' },
    { name: 'Tax', path: '/masters/tax', icon: '💰' },
    { name: 'Unit', path: '/masters/unit', icon: '📐' },
    { name: 'Warehouse', path: '/masters/warehouse', icon: '🏠' },
  ];

  return (
    <div className="masters-container">
      <h1>🗂️ Masters</h1>
      <p>Select a master to manage:</p>

      <div className="masters-grid">
        {masters.map((item) => (
          <Link to={item.path} key={item.name} className="master-card">
            <div className="master-icon">{item.icon}</div>
            <div className="master-name">{item.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MastersModule;

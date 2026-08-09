import React from 'react';
import '../../styles/Shared.css';

const ItemMaster = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">📦 Item Master</h1>
      <p className="page-subtitle">Add and manage your products</p>

      <div className="card">
        <h3 className="card-title">Add New Item</h3>
        <form>
          <div className="form-row">
            <div className="form-group">
              <label>Item Name *</label>
              <input type="text" placeholder="Product name" />
            </div>
            <div className="form-group">
              <label>SKU *</label>
              <input type="text" placeholder="Product code" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input type="text" placeholder="e.g. 50000.00" />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input type="text" placeholder="e.g. 10" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unit</label>
              <select>
                <option>Pieces</option>
                <option>Kilograms</option>
                <option>Meters</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tax</label>
              <select>
                <option>GST 18%</option>
                <option>GST 5%</option>
                <option>None</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Warehouse</label>
            <select>
              <option>Main Warehouse</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">Save Item</button>
        </form>
      </div>

      <div className="card">
        <h3 className="card-title">Saved Items List</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>
                  No items recorded yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemMaster;

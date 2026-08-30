import React, { useState } from 'react';

const TaxInvoice = () => {
  return (
    <div style={{ padding: '4px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ background: '#1b5e20', color: 'white', padding: '4px 12px', borderRadius: '3px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>ALLIED TRADING CORPORATION | GST INV-1</span>
        <button style={{ background: 'white', color: '#1b5e20', border: 'none', borderRadius: '2px', padding: '2px 10px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>+ Add New</button>
      </div>

      {/* INVOICE DETAILS */}
      <div style={{ background: 'white', padding: '4px 8px', borderRadius: '3px', marginBottom: '4px', border: '1px solid #e0e0e0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr', gap: '2px 8px', alignItems: 'center' }}>
          <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#555' }}>Invoice No.</label>
          <input type="text" value="1411" readOnly style={{ width: '60px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '10px', height: '18px', background: '#f5f5f5' }} />
          
          <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#555' }}>Invoice Date</label>
          <input type="date" value="2026-08-19" style={{ width: '110px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '10px', height: '18px' }} />
          
          <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#555' }}>Order No.</label>
          <input type="text" placeholder="Order No." style={{ width: '80px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '10px', height: '18px' }} />
          
          <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#555' }}>Order Date</label>
          <input type="date" style={{ width: '110px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '10px', height: '18px' }} />
          
          <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#555' }}>Book No.</label>
          <input type="text" placeholder="Book No." style={{ width: '80px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '10px', height: '18px' }} />
          
          <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#555' }}>Place of Supply</label>
          <input type="text" value="New Delhi" style={{ width: '100px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '10px', height: '18px' }} />
        </div>
      </div>

      {/* TRANSPORT DETAILS */}
      <div style={{ background: 'white', padding: '4px 8px', borderRadius: '3px', marginBottom: '4px', border: '1px solid #e0e0e0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr', gap: '2px 8px', alignItems: 'center' }}>
          <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#555' }}>GR No.</label>
          <input type="text" placeholder="GR No." style={{ width: '80px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '10px', height: '18px' }} />
          
          <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#555' }}>GR Date</label>
          <input type="date" style={{ width: '110px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '10px', height: '18px' }} />
          
          <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#555' }}>Transport Name</label>
          <input type="text" placeholder="Transport Name" style={{ width: '100px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '10px', height: '18px' }} />
          
          <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#555' }}>Mode</label>
          <select style={{ width: '80px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '10px', height: '18px' }}>
            <option>By Road</option><option>By Rail</option><option>By Air</option>
          </select>
          
          <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#555' }}>Vehicle No.</label>
          <input type="text" placeholder="Vehicle No." style={{ width: '80px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '10px', height: '18px' }} />
        </div>
      </div>

      {/* RECEIVER & CONSIGNEE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
        
        {/* RECEIVER */}
        <div style={{ background: 'white', padding: '4px 8px', borderRadius: '3px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#1b5e20', margin: '0 0 3px 0' }}>Receiver (Billed to)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1px 6px', alignItems: 'center' }}>
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>Select</label>
            <select style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }}><option>-- Select --</option></select>
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>Name *</label>
            <input type="text" placeholder="Name" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>Address *</label>
            <input type="text" placeholder="Address" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>City</label>
            <input type="text" placeholder="City" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>State</label>
            <input type="text" placeholder="State" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>State Code</label>
            <input type="text" placeholder="Code" style={{ width: '50px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>Phone</label>
            <input type="text" placeholder="Phone" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>GST</label>
            <input type="text" placeholder="GST" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>Doc No.</label>
            <input type="text" placeholder="Doc No." style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
          </div>
        </div>

        {/* CONSIGNEE */}
        <div style={{ background: 'white', padding: '4px 8px', borderRadius: '3px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#1b5e20', margin: '0 0 3px 0' }}>Consignee (Shipped to)</h3>
          <div style={{ background: '#e8f5e9', padding: '1px 4px', borderRadius: '2px', marginBottom: '3px', fontSize: '7px', color: '#2e7d32' }}>✅ Auto-filled from Receiver</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1px 6px', alignItems: 'center' }}>
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>Name *</label>
            <input type="text" placeholder="Name" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>Address *</label>
            <input type="text" placeholder="Address" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>City</label>
            <input type="text" placeholder="City" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>State</label>
            <input type="text" placeholder="State" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>State Code</label>
            <input type="text" placeholder="Code" style={{ width: '50px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>Phone</label>
            <input type="text" placeholder="Phone" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>GST</label>
            <input type="text" placeholder="GST" style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
            
            <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>Doc No.</label>
            <input type="text" placeholder="Doc No." style={{ width: '100%', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <div style={{ background: 'white', padding: '4px 8px', borderRadius: '3px', marginBottom: '4px', border: '1px solid #e0e0e0' }}>
        <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#1b5e20', margin: '0 0 3px 0' }}>Items</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px' }}>
            <thead>
              <tr style={{ background: '#f5f6fa' }}>
                <th style={{ padding: '1px 4px', border: '1px solid #ddd', textAlign: 'center' }}>#</th>
                <th style={{ padding: '1px 4px', border: '1px solid #ddd', textAlign: 'left' }}>Item</th>
                <th style={{ padding: '1px 4px', border: '1px solid #ddd', textAlign: 'center' }}>HSN</th>
                <th style={{ padding: '1px 4px', border: '1px solid #ddd', textAlign: 'center' }}>Unit</th>
                <th style={{ padding: '1px 4px', border: '1px solid #ddd', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '1px 4px', border: '1px solid #ddd', textAlign: 'right' }}>Rate</th>
                <th style={{ padding: '1px 4px', border: '1px solid #ddd', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '1px 4px', border: '1px solid #ddd', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '1px 4px', border: '1px solid #ddd', textAlign: 'center' }}>1</td>
                <td style={{ padding: '1px 4px', border: '1px solid #ddd' }}><input type="text" placeholder="Item" style={{ width: '100%', padding: '1px 3px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '8px', height: '16px' }} /></td>
                <td style={{ padding: '1px 4px', border: '1px solid #ddd' }}><input type="text" placeholder="HSN" style={{ width: '50px', padding: '1px 3px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '8px', height: '16px' }} /></td>
                <td style={{ padding: '1px 4px', border: '1px solid #ddd' }}><input type="text" placeholder="Unit" style={{ width: '40px', padding: '1px 3px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '8px', height: '16px' }} /></td>
                <td style={{ padding: '1px 4px', border: '1px solid #ddd' }}><input type="number" placeholder="Qty" style={{ width: '40px', padding: '1px 3px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '8px', height: '16px' }} /></td>
                <td style={{ padding: '1px 4px', border: '1px solid #ddd' }}><input type="number" placeholder="Rate" style={{ width: '50px', padding: '1px 3px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '8px', height: '16px' }} /></td>
                <td style={{ padding: '1px 4px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>₹0.00</td>
                <td style={{ padding: '1px 4px', border: '1px solid #ddd', textAlign: 'center' }}><button style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '7px', padding: '0px 4px' }}>✕</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: '7px', color: '#999', marginTop: '2px' }}>▶ Press ENTER to add next item</div>
      </div>

      {/* TOTALS */}
      <div style={{ background: 'white', padding: '4px 8px', borderRadius: '3px', marginBottom: '4px', border: '1px solid #e0e0e0', maxWidth: '300px', marginLeft: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
          <span>Total Taxable:</span>
          <span>₹0.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', borderTop: '1px solid #333', paddingTop: '2px' }}>
          <span>Grand Total:</span>
          <span>₹0.00</span>
        </div>
      </div>

      {/* BANK DETAILS */}
      <div style={{ background: 'white', padding: '4px 8px', borderRadius: '3px', marginBottom: '4px', border: '1px solid #e0e0e0' }}>
        <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#1b5e20', margin: '0 0 3px 0' }}>Bank Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr', gap: '2px 8px', alignItems: 'center' }}>
          <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>Bank Name</label>
          <input type="text" placeholder="Bank" style={{ width: '100px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
          
          <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>A/C No.</label>
          <input type="text" placeholder="A/C" style={{ width: '100px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
          
          <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>IFSC</label>
          <input type="text" placeholder="IFSC" style={{ width: '80px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
          
          <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#555' }}>Branch</label>
          <input type="text" placeholder="Branch" style={{ width: '80px', padding: '1px 4px', border: '1px solid #ddd', borderRadius: '2px', fontSize: '9px', height: '18px' }} />
        </div>
      </div>

      {/* PRINT OPTIONS */}
      <div style={{ background: 'white', padding: '4px 8px', borderRadius: '3px', border: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button style={{ padding: '2px 12px', background: '#4a9eff', color: 'white', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '9px' }}>🖨️ Print</button>
          <button style={{ padding: '2px 12px', background: '#25D366', color: 'white', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '9px' }}>📱 WhatsApp</button>
          <button style={{ padding: '2px 12px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '9px' }}>🔄 Correction</button>
        </div>
      </div>

    </div>
  );
};

export default TaxInvoice;

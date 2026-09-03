import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import SendAPKModal from '../components/SendAPKModal';

const MainLayout = ({ children }) => {
  const [mastersOpen, setMastersOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [cateringOpen, setCateringOpen] = useState(false);
  const [sendAPKOpen, setSendAPKOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const showHistory = location.pathname.includes('/sales/invoice') || 
                      location.pathname.includes('/purchase/invoice');
  
  // Hide sidebar on Zebaish/Catering pages (they have their own layout)
  const isZebaishPage = location.pathname === '/menu-selection' || location.pathname === '/agent';

  // Dynamic page title based on route
  useEffect(() => {
    const titles = {
      '/': 'Zebaish Dashboard',
      '/dashboard': 'Zebaish Dashboard',
      '/agent': 'Zebaish Channel Partner',
      '/masters/customer': 'Customer Master',
      '/masters/vendor': 'Vendor Master',
      '/masters/item': 'Item Master',
      '/masters/tax': 'Tax Master',
      '/masters/unit': 'Unit Master',
      '/sales/invoice': 'Sales Invoice',
      '/purchase/invoice': 'Purchase Invoice',
      '/menu-selection': 'Menu Selection',
      '/menu-calculator': 'AI Menu Calculator',
      '/apk-download': 'Download APK',
    };
    document.title = titles[location.pathname] || 'Zebaish';
  }, [location.pathname]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('https://atc-geca.onrender.com/api/invoices/', { timeout: 5000 });
        setInvoices(response.data?.invoices || []);
      } catch (error) {
        // Backend may be offline — sidebar still renders without history
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#f5f7fa'
    }}>
      
      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        padding: isZebaishPage ? '0' : '4px 6px',
        boxSizing: 'border-box'
      }}>
        {children || <Outlet />}
      </div>

      {/* RIGHT SIDEBARS - hidden on Zebaish pages */}
      {!isZebaishPage && (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        flexShrink: 0,
        borderLeft: '1px solid #333'
      }}>
        
        {/* COLUMN 1: INVOICE HISTORY */}
        {showHistory && (
          <div style={{
            width: '155px',
            minWidth: '155px',
            maxWidth: '155px',
            height: '100%',
            background: '#1a1a1a',
            padding: '10px 8px',
            overflow: 'hidden',
            boxSizing: 'border-box',
            borderRight: '1px solid #333'
          }}>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              color: '#4CAF50', 
              margin: '0 0 10px 0', 
              borderBottom: '1px solid #444', 
              paddingBottom: '6px' 
            }}>
              📋 Invoice History
            </h4>
            
            <div style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ fontSize: '11px', color: '#888', textAlign: 'center', padding: '10px 0' }}>Loading...</div>
              ) : invoices.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#888', textAlign: 'center', padding: '10px 0' }}>No invoices yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {invoices.map((inv) => (
                    <div 
                      key={inv.id}
                      style={{
                        background: '#2a2a2a',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #333',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => window.location.href = "/sales/invoice?edit=" + inv.id}
                      onMouseOver={(e) => e.currentTarget.style.background = '#333'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#2a2a2a'}
                    >
                      <div style={{ fontWeight: 'bold', color: '#4CAF50', fontSize: '11px' }}>{inv.invoice_no}</div>
                      <div style={{ color: '#ccc', fontSize: '10px', marginTop: '2px' }}>{inv.customer_name}</div>
                    </div>
                  ))}
        </div>
      )}

      {/* Send APK Modal */}
      <SendAPKModal open={sendAPKOpen} onClose={() => setSendAPKOpen(false)} />
    </div>
          </div>
        )}

        {/* COLUMN 2: DASHBOARD SIDEBAR */}
        <div style={{
          width: '135px',
          minWidth: '135px',
          maxWidth: '135px',
          height: '100vh',
          background: '#000000',
          color: '#ffffff',
          overflow: 'hidden',
          padding: '10px 8px',
          boxSizing: 'border-box'
        }}>
          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '15px', fontWeight: 'bold', display: 'block', color: '#fff' }}>📊 ATC</span>
            <span style={{ fontSize: '10px', opacity: 0.7, color: '#aaa' }}>Allied Trading Corp</span>
          </div>
          
          <div style={{ height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {/* Dashboard */}
              <li style={{ marginBottom: '5px', padding: '5px 8px', borderRadius: '4px', background: location.pathname === '/dashboard' ? '#2a2a2a' : '#1a1a1a' }}>
                <Link to="/dashboard" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '12px', display: 'block' }}>
                  📊 Dashboard
                </Link>
              </li>
              
              {/* Masters */}
              <li style={{ marginBottom: '5px', padding: '5px 8px', borderRadius: '4px' }}>
                <span onClick={() => setMastersOpen(!mastersOpen)} style={{ cursor: 'pointer', color: '#ddd', fontSize: '12px', display: 'block' }}>
                  📁 Masters {mastersOpen ? '▼' : '▶'}
                </span>
                {mastersOpen && (
                  <ul style={{ listStyle: 'none', paddingLeft: '16px', margin: '4px 0' }}>
                    <li style={{ padding: '3px 0' }}>
                      <Link to="/masters/customer" style={{ color: location.pathname === '/masters/customer' ? '#ffffff' : '#aaa', textDecoration: 'none', fontSize: '11px', display: 'block' }}>Customer</Link>
                    </li>
                    <li style={{ padding: '3px 0' }}>
                      <Link to="/masters/vendor" style={{ color: location.pathname === '/masters/vendor' ? '#ffffff' : '#aaa', textDecoration: 'none', fontSize: '11px', display: 'block' }}>Vendor</Link>
                    </li>
                    <li style={{ padding: '3px 0' }}>
                      <Link to="/masters/item" style={{ color: location.pathname === '/masters/item' ? '#ffffff' : '#aaa', textDecoration: 'none', fontSize: '11px', display: 'block' }}>Item</Link>
                    </li>
                    <li style={{ padding: '3px 0' }}>
                      <Link to="/masters/tax" style={{ color: location.pathname === '/masters/tax' ? '#ffffff' : '#aaa', textDecoration: 'none', fontSize: '11px', display: 'block' }}>Tax</Link>
                    </li>
                    <li style={{ padding: '3px 0' }}>
                      <Link to="/masters/unit" style={{ color: location.pathname === '/masters/unit' ? '#ffffff' : '#aaa', textDecoration: 'none', fontSize: '11px', display: 'block' }}>Unit</Link>
                    </li>
                  </ul>
                )}
              </li>
              
              {/* Purchase */}
              <li style={{ marginBottom: '5px', padding: '5px 8px', borderRadius: '4px' }}>
                <span onClick={() => setPurchaseOpen(!purchaseOpen)} style={{ cursor: 'pointer', color: '#ddd', fontSize: '12px', display: 'block' }}>
                  🛒 Purchase {purchaseOpen ? '▼' : '▶'}
                </span>
                {purchaseOpen && (
                  <ul style={{ listStyle: 'none', paddingLeft: '16px', margin: '4px 0' }}>
                    <li style={{ padding: '3px 0' }}>
                      <Link to="/purchase/invoice" style={{ color: location.pathname === '/purchase/invoice' ? '#ffffff' : '#ddd', textDecoration: 'none', fontSize: '11px', display: 'block' }}>Invoice</Link>
                    </li>
                  </ul>
                )}
              </li>
              
              {/* Sales */}
              <li style={{ marginBottom: '5px', padding: '5px 8px', borderRadius: '4px', background: '#1b5e20' }}>
                <span onClick={() => setSalesOpen(!salesOpen)} style={{ cursor: 'pointer', color: '#ffffff', fontSize: '12px', display: 'block' }}>
                  📦 Sales {salesOpen ? '▼' : '▶'}
                </span>
                {salesOpen && (
                  <ul style={{ listStyle: 'none', paddingLeft: '16px', margin: '4px 0' }}>
                    <li style={{ padding: '3px 0' }}>
                      <Link to="/sales/invoice" style={{ color: location.pathname === '/sales/invoice' ? '#ffffff' : '#ddd', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold', display: 'block' }}>Invoice</Link>
                    </li>
                  </ul>
                )}
              </li>
              
              {/* Catering */}
              <li style={{ marginBottom: '5px', padding: '5px 8px', borderRadius: '4px' }}>
                <span onClick={() => setCateringOpen(!cateringOpen)} style={{ cursor: 'pointer', color: '#ddd', fontSize: '12px', display: 'block' }}>
                  🍽️ Catering {cateringOpen ? '▼' : '▶'}
                </span>
                {cateringOpen && (
                  <ul style={{ listStyle: 'none', paddingLeft: '16px', margin: '4px 0' }}>
                    <li style={{ padding: '3px 0' }}>
                      <Link to="/menu-selection" style={{ color: location.pathname === '/menu-selection' ? '#ffffff' : '#ddd', textDecoration: 'none', fontSize: '11px', display: 'block' }}>Menu Selection</Link>
                    </li>
                    <li style={{ padding: '3px 0' }}>
                      <Link to="/agent" style={{ color: location.pathname === '/agent' ? '#ffffff' : '#ddd', textDecoration: 'none', fontSize: '11px', display: 'block' }}>Channel Partner</Link>
                    </li>
                    <li style={{ padding: '3px 0' }}>
                      <span onClick={() => setSendAPKOpen(true)} style={{ cursor: 'pointer', color: '#ddd', fontSize: '11px', display: 'block' }}>📱 Send APK</span>
                    </li>
                  </ul>
                )}
              </li>

              {/* Inventory */}
              <li style={{ marginBottom: '5px', padding: '5px 8px', borderRadius: '4px' }}>
                <Link to="/inventory" style={{ color: location.pathname === '/inventory' ? '#ffffff' : '#ddd', textDecoration: 'none', fontSize: '12px', display: 'block' }}>
                  📦 Inventory
                </Link>
              </li>


              
              {/* Accounts */}
              <li style={{ marginBottom: '5px', padding: '5px 8px', borderRadius: '4px' }}>
                <Link to="/accounts" style={{ color: location.pathname === '/accounts' ? '#ffffff' : '#ddd', textDecoration: 'none', fontSize: '12px', display: 'block' }}>
                  💰 Accounts
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default MainLayout;


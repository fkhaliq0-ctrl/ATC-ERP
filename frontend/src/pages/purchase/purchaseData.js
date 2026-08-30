// Shared data, helpers, and constants for the Purchase & Supplier Management Module

// ─── Company Details ───────────────────────────────────────────────
export const COMPANY_DETAILS = {
  name: 'ALLIED TRADING CORPORATION',
  address: 'R-25, Basement, Masjid Amania Lane, Nehar Bazar, Metro Pillar 197-198, Main Road, Maujpur, Delhi-110053',
  gstin: '07ALFPK0050N2Z5',
  state: 'DELHI',
  stateCode: '07',
  email: 'atcdelhi@outlook.com',
  phone: '+91-9999950056'
};

// ─── Default Suppliers (Seed Data) ─────────────────────────────────
export const SEED_SUPPLIERS = [
  {
    id: 'SUPP-001',
    companyName: 'A.S. ENTERPRISES',
    contactPerson: 'Mr. Arun Sharma',
    address: 'Plot 42, Okhla Industrial Area Phase 3',
    city: 'New Delhi',
    state: 'Delhi',
    stateCode: '07',
    pinCode: '110020',
    country: 'India',
    phone: '+91 9876543210',
    email: 'arun@asenterprises.in',
    gstin: '07AABCA1234C1Z5',
    pan: 'AABCA1234C',
    paymentTerms: '30 Days',
    category: 'Raw Materials',
    openingBalance: 0,
    status: 'Active'
  },
  {
    id: 'SUPP-002',
    companyName: 'SHRI PARSVNATH TRADERS',
    contactPerson: 'Mr. Praveen Jain',
    address: 'G-12, Chandni Chowk',
    city: 'Delhi',
    state: 'Delhi',
    stateCode: '07',
    pinCode: '110006',
    country: 'India',
    phone: '+91 9811122233',
    email: 'parsvnath@gmail.com',
    gstin: '07AAACP9876D1Z2',
    pan: 'AAACP9876D',
    paymentTerms: '15 Days',
    category: 'Packaging',
    openingBalance: 12500,
    status: 'Active'
  },
  {
    id: 'SUPP-003',
    companyName: 'AP FABRICS & CATERING SUPPLIES',
    contactPerson: 'Mr. Rajesh Agarwal',
    address: '104, Transport Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    stateCode: '08',
    pinCode: '302003',
    country: 'India',
    phone: '+91 9414012345',
    email: 'apfabrics@rediffmail.com',
    gstin: '08AAACA5678E1Z9',
    pan: 'AAACA5678E',
    paymentTerms: '45 Days',
    category: 'Equipment',
    openingBalance: 45000,
    status: 'Active'
  },
  {
    id: 'SUPP-004',
    companyName: 'FRESH POULTRY FARMS LTD',
    contactPerson: 'Dr. K.M. Singh',
    address: 'Industrial Area, Sector 5',
    city: 'Gurugram',
    state: 'Haryana',
    stateCode: '06',
    pinCode: '122005',
    country: 'India',
    phone: '+91 1244567890',
    email: 'orders@freshpoultry.in',
    gstin: '06AAACF1111P1Z3',
    pan: 'AAACF1111P',
    paymentTerms: '7 Days',
    category: 'Raw Materials',
    openingBalance: 78000,
    status: 'Active'
  }
];

// ─── Default Master Items ──────────────────────────────────────────
export const SEED_ITEMS = [
  { code: 'ITM-001', name: 'Chicken Wings (Boneless)', desc: 'Fresh Boneless Cuts', hsn: '0207', unit: 'Kgs', price: 220, gstRate: 5, stockQty: 50 },
  { code: 'ITM-002', name: 'Basmati Rice (Premium)', desc: 'Extra Long Grain 1121', hsn: '1006', unit: 'Kgs', price: 95, gstRate: 5, stockQty: 200 },
  { code: 'ITM-003', name: 'Cooking Oil (Sunflower)', desc: '15L Tin', hsn: '1512', unit: 'Tin', price: 1850, gstRate: 12, stockQty: 15 },
  { code: 'ITM-004', name: 'Tissue Napkins Pack', desc: '100 Pcs per pack', hsn: '4818', unit: 'Packet', price: 45, gstRate: 18, stockQty: 300 },
  { code: 'ITM-005', name: 'Whole Chicken', desc: 'Fresh Grade A', hsn: '0207', unit: 'Kgs', price: 150, gstRate: 5, stockQty: 120 },
  { code: 'ITM-006', name: 'Disposable Plates (Round)', desc: '25 Pcs per pack', hsn: '4823', unit: 'Packet', price: 35, gstRate: 18, stockQty: 500 }
];

// ─── Default Warehouses ────────────────────────────────────────────
export const WAREHOUSES = ['Main Central Godown', 'Cold Storage Unit 1', 'Cold Storage Unit 2'];

// ─── PIN Code → State Mapping ──────────────────────────────────────
export const getStateFromPin = (pin) => {
  if (!pin || pin.length < 2) return { state: '', code: '' };
  const prefix = pin.substring(0, 2);
  const pinMap = {
    '11': { state: 'Delhi', code: '07' },
    '12': { state: 'Haryana', code: '06' },
    '13': { state: 'Haryana', code: '06' },
    '14': { state: 'Punjab', code: '03' },
    '15': { state: 'Punjab', code: '03' },
    '16': { state: 'Chandigarh', code: '04' },
    '17': { state: 'Himachal Pradesh', code: '02' },
    '18': { state: 'Jammu & Kashmir', code: '01' },
    '20': { state: 'Uttar Pradesh', code: '09' },
    '21': { state: 'Uttar Pradesh', code: '09' },
    '22': { state: 'Uttar Pradesh', code: '09' },
    '23': { state: 'Uttar Pradesh', code: '09' },
    '24': { state: 'Uttar Pradesh', code: '09' },
    '25': { state: 'Uttar Pradesh', code: '09' },
    '26': { state: 'Uttarakhand', code: '05' },
    '27': { state: 'Uttarakhand', code: '05' },
    '28': { state: 'Uttar Pradesh', code: '09' },
    '30': { state: 'Rajasthan', code: '08' },
    '31': { state: 'Rajasthan', code: '08' },
    '32': { state: 'Rajasthan', code: '08' },
    '33': { state: 'Rajasthan', code: '08' },
    '34': { state: 'Rajasthan', code: '08' },
    '38': { state: 'Gujarat', code: '24' },
    '39': { state: 'Gujarat', code: '24' },
    '40': { state: 'Maharashtra', code: '27' },
    '41': { state: 'Maharashtra', code: '27' },
    '42': { state: 'Maharashtra', code: '27' },
    '43': { state: 'Maharashtra', code: '27' },
    '44': { state: 'Maharashtra', code: '27' },
    '50': { state: 'Telangana', code: '36' },
    '51': { state: 'Andhra Pradesh', code: '37' },
    '52': { state: 'Andhra Pradesh', code: '37' },
    '53': { state: 'Andhra Pradesh', code: '37' },
    '56': { state: 'Karnataka', code: '29' },
    '57': { state: 'Karnataka', code: '29' },
    '58': { state: 'Karnataka', code: '29' },
    '59': { state: 'Karnataka', code: '29' },
    '60': { state: 'Tamil Nadu', code: '33' },
    '61': { state: 'Tamil Nadu', code: '33' },
    '62': { state: 'Tamil Nadu', code: '33' },
    '63': { state: 'Tamil Nadu', code: '33' },
    '64': { state: 'Tamil Nadu', code: '33' },
    '67': { state: 'Kerala', code: '32' },
    '68': { state: 'Kerala', code: '32' },
    '69': { state: 'Kerala', code: '32' },
    '70': { state: 'West Bengal', code: '19' },
    '71': { state: 'West Bengal', code: '19' },
    '72': { state: 'West Bengal', code: '19' },
    '73': { state: 'West Bengal', code: '19' },
    '74': { state: 'West Bengal', code: '19' },
    '75': { state: 'Odisha', code: '21' },
    '76': { state: 'Odisha', code: '21' },
    '77': { state: 'Odisha', code: '21' },
    '78': { state: 'Assam', code: '18' },
    '80': { state: 'Bihar', code: '10' },
    '81': { state: 'Bihar', code: '10' },
    '82': { state: 'Bihar', code: '10' },
    '83': { state: 'Jharkhand', code: '20' },
    '84': { state: 'Bihar', code: '10' },
    '85': { state: 'Bihar', code: '10' }
  };
  return pinMap[prefix] || { state: 'Other State', code: '99' };
};

// ─── Number to Words (Indian System) ───────────────────────────────
export const numberToWords = (num) => {
  if (!num || isNaN(num) || num === 0) return 'Zero Rupees Only';

  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    let str = '';
    if (n > 19) {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
    } else {
      str += a[n];
    }
    return str;
  };

  let integerPart = Math.floor(num);
  let decimalPart = Math.round((num - integerPart) * 100);

  let crore = Math.floor(integerPart / 10000000);
  integerPart %= 10000000;
  let lakh = Math.floor(integerPart / 100000);
  integerPart %= 100000;
  let thousand = Math.floor(integerPart / 1000);
  integerPart %= 1000;
  let hundred = Math.floor(integerPart / 100);
  integerPart %= 100;

  let res = '';
  if (crore) res += inWords(crore) + 'Crore ';
  if (lakh) res += inWords(lakh) + 'Lakh ';
  if (thousand) res += inWords(thousand) + 'Thousand ';
  if (hundred) res += inWords(hundred) + 'Hundred ';
  if (integerPart) res += inWords(integerPart);

  res = res.trim() ? res.trim() + ' Rupees' : '';
  if (decimalPart > 0) {
    res += ' and ' + inWords(decimalPart).trim() + ' Paise';
  }
  return res ? res + ' Only' : '';
};

// ─── Currency Formatter ────────────────────────────────────────────
export const formatINR = (amount, decimals = 2) => {
  const val = parseFloat(amount) || 0;
  return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

// ─── Date Helpers ──────────────────────────────────────────────────
export const todayISO = () => new Date().toISOString().split('T')[0];

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ─── Generate Sequential IDs ───────────────────────────────────────
export const generateId = (prefix, existingCount, padLength = 4, startNum = 1) => {
  return `${prefix}-${String(existingCount + startNum).padStart(padLength, '0')}`;
};

// ─── GST Calculation Helper ────────────────────────────────────────
export const calculateGST = (items, supplierStateCode, companyStateCode = '07') => {
  const subTotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
  }, 0);

  const totalGST = items.reduce((sum, item) => {
    const lineSub = (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
    return sum + (lineSub * (parseFloat(item.gstRate) || 0)) / 100;
  }, 0);

  const isIntraState = supplierStateCode === companyStateCode;
  const cgst = isIntraState ? totalGST / 2 : 0;
  const sgst = isIntraState ? totalGST / 2 : 0;
  const igst = !isIntraState ? totalGST : 0;
  const grandTotal = subTotal + totalGST;

  return { subTotal, totalGST, cgst, sgst, igst, grandTotal, isIntraState };
};

// ─── Status Badge Style Helper ─────────────────────────────────────
export const statusBadge = (status) => {
  const styles = {
    Active: { bg: '#d4edda', color: '#155724' },
    Inactive: { bg: '#f8d7da', color: '#721c24' },
    Pending: { bg: '#fff3cd', color: '#856404' },
    Approved: { bg: '#d4edda', color: '#155724' },
    Rejected: { bg: '#f8d7da', color: '#721c24' },
    Completed: { bg: '#d1ecf1', color: '#0c5460' },
    'Partially Received': { bg: '#fff3cd', color: '#856404' },
    Received: { bg: '#d4edda', color: '#155724' },
    Passed: { bg: '#d4edda', color: '#155724' },
    Conditional: { bg: '#fff3cd', color: '#856404' },
    Paid: { bg: '#d4edda', color: '#155724' },
    Unpaid: { bg: '#f8d7da', color: '#721c24' },
    'Partially Paid': { bg: '#fff3cd', color: '#856404' },
    Open: { bg: '#d1ecf1', color: '#0c5460' },
    Closed: { bg: '#e2e3e5', color: '#383d41' }
  };
  const s = styles[status] || { bg: '#e2e3e5', color: '#383d41' };
  return {
    background: s.bg,
    color: s.color,
    padding: '3px 10px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '12px',
    display: 'inline-block'
  };
};

// ─── Shared Input Style ────────────────────────────────────────────
export const inputStyle = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '13px',
  boxSizing: 'border-box'
};

export const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 'bold',
  marginBottom: '5px',
  color: '#333'
};

export const cardStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  marginBottom: '20px'
};

export const tableHeaderStyle = {
  background: '#343a40',
  color: '#fff',
  textAlign: 'left',
  fontSize: '13px'
};
// Shared data, helpers, and constants for the Sales Module
// Re-exports common helpers from the Purchase module so the Sales module
// stays consistent with the rest of the ERP without duplicating logic.

export {
  COMPANY_DETAILS,
  numberToWords,
  formatINR,
  formatDate,
  todayISO,
  generateId,
  calculateGST,
  statusBadge,
  inputStyle,
  labelStyle,
  cardStyle,
  tableHeaderStyle
} from '../purchase/purchaseData';

// ─── Default Customers (Seed Data) ─────────────────────────────────
export const SEED_CUSTOMERS = [
  {
    id: 'CUST-001',
    companyName: 'M/s ALPINE SALES',
    contactPerson: 'Mr. Rakesh Mehra',
    address: 'First Floor, A-261, New Friends Colony',
    city: 'New Delhi',
    state: 'DELHI',
    stateCode: '07',
    pinCode: '110025',
    country: 'India',
    phone: '+91 9810011222',
    email: 'alpinesales@gmail.com',
    gstin: '07CBDPR8732C1ZM',
    pan: 'CBDPR8732C',
    paymentTerms: '30 Days',
    category: 'Retailer',
    openingBalance: 0,
    status: 'Active'
  },
  {
    id: 'CUST-002',
    companyName: 'SHRI BALAJI TRADERS',
    contactPerson: 'Mr. Suresh Agarwal',
    address: 'Shop 14, Karol Bagh Market',
    city: 'New Delhi',
    state: 'DELHI',
    stateCode: '07',
    pinCode: '110005',
    country: 'India',
    phone: '+91 9899777654',
    email: 'balajitraders@yahoo.in',
    gstin: '07AAGCB1234F1Z5',
    pan: 'AAGCB1234F',
    paymentTerms: '15 Days',
    category: 'Wholesaler',
    openingBalance: 18500,
    status: 'Active'
  },
  {
    id: 'CUST-003',
    companyName: 'JAIPUR FANCY STORE',
    contactPerson: 'Mr. Mahaveer Jain',
    address: '12, Johari Bazar',
    city: 'Jaipur',
    state: 'Rajasthan',
    stateCode: '08',
    pinCode: '302003',
    country: 'India',
    phone: '+91 9414098765',
    email: 'jaipurfancy@rediffmail.com',
    gstin: '08AAGCJ5678K1Z2',
    pan: 'AAGCJ5678K',
    paymentTerms: '45 Days',
    category: 'Retailer',
    openingBalance: 32000,
    status: 'Active'
  }
];

// ─── Default Sales Items (Seed Data) ───────────────────────────────
export const SEED_SALES_ITEMS = [
  { code: 'ITM-101', name: 'AMMA DEKH', desc: 'Decor Box Handcrafted', hsn: '7018', unit: 'BOX', price: 90, gstRate: 0, stockQty: 400 },
  { code: 'ITM-102', name: 'GB FANCY', desc: 'Glass Bangle Fancy', hsn: '7018', unit: 'BOX', price: 40, gstRate: 0, stockQty: 400 },
  { code: 'ITM-103', name: 'STEEL TUMBLER SET', desc: '6 Pcs Stainless Steel', hsn: '7323', unit: 'SET', price: 350, gstRate: 12, stockQty: 120 },
  { code: 'ITM-104', name: 'CERAMIC DINNER PLATE', desc: 'Pack of 4', hsn: '6912', unit: 'PACK', price: 480, gstRate: 12, stockQty: 80 }
];

// ─── Payment Status Options ────────────────────────────────────────
export const PAYMENT_STATUS_OPTIONS = ['Unpaid', 'Partially Paid', 'Paid'];

// ─── Payment Mode Options ──────────────────────────────────────────
export const PAYMENT_MODE_OPTIONS = [
  'Bank Transfer (NEFT/RTGS)',
  'UPI / GPay',
  'Cash',
  'Cheque',
  'IMPS',
  'Card (Debit/Credit)'
];
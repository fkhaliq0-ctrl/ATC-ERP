import React, { useState } from "react";
import "./SalesModule.css";
import { SEED_CUSTOMERS } from "./salesData";
import SalesInvoiceList from "./SalesInvoiceList";
import CustomerPayments from "./CustomerPayments";

const numberToWords = (num) => {
  if (!num || isNaN(num) || num === 0) return "Zero Rupees Only";

  const a = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n) => {
    let str = "";
    if (n > 19) {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : " ");
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

  let res = "";
  if (crore) res += inWords(crore) + "Crore ";
  if (lakh) res += inWords(lakh) + "Lakh ";
  if (thousand) res += inWords(thousand) + "Thousand ";
  if (hundred) res += inWords(hundred) + "Hundred ";
  if (integerPart) res += inWords(integerPart);

  res = res.trim() ? res.trim() + " Rupees" : "";
  if (decimalPart > 0) {
    res += " and " + inWords(decimalPart).trim() + " Paise";
  }
  return res ? res + " Only" : "";
};

const SalesModule = () => {
  const COMPANY_DETAILS = {
    formType: "FORM GST INV - 1",
    name: "ALLIED TRADING CORPORATION",
    address: "R-25, Basement, Masjid Amania Lane, Nehar Bazar, Metro Pillar 197-198, Main Road, Maujpur, Delhi-110053",
    gstin: "07ALFPK0050N2Z5",
    state: "DELHI",
    stateCode: "7",
    email: "atcdelhi@outlook.com",
    phone: "+91-9999950056"
  };

  const [logoUrl, setLogoUrl] = useState("/logo.svg");
  const [activeTab, setActiveTab] = useState("entry");

  const [customers] = useState(SEED_CUSTOMERS || []);
  const [salesInvoices, setSalesInvoices] = useState([]);
  const [payments, setPayments] = useState([]);

  const salesTabs = [
    { id: "invoices", label: "Sales Invoices", icon: "ðŸ“„" },
    { id: "payments", label: "Customer Payments", icon: "ðŸ’³" },
    { id: "entry", label: "Tax Invoice Entry", icon: "âœï¸" }
  ];

  const salesTabBtnStyle = (tab) => ({
    padding: "8px 16px",
    background: activeTab === tab.id ? "#0b1b80" : "#f8f9fa",
    color: activeTab === tab.id ? "#fff" : "#333",
    border: "1px solid #dee2e6",
    borderBottom: activeTab === tab.id ? "2px solid #0b1b80" : "1px solid #dee2e6",
    borderRadius: "4px 4px 0 0",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  });

  const [masterItems] = useState([
    { code: "ITM-101", name: "AMMA DEKH", desc: "Decor Box Handcrafted", hsn: "7018", unit: "BOX", price: 90, purchaseRate: 65, stockQty: 400, gstRate: 0 },
    { code: "ITM-102", name: "GB FANCY", desc: "Glass Bangle Fancy", hsn: "7018", unit: "BOX", price: 40, purchaseRate: 25, stockQty: 400, gstRate: 0 }
  ]);

  const [header, setHeader] = useState({
    invoiceNo: "1406",
    invoiceDate: "2026-07-06",
    transportName: "Self",
    transportMode: "By Road",
    vehNo: "-",
    placeOfSupply: "New Delhi"
  });

  const [billing] = useState({
    name: "M/s ALPINE SALES",
    address: "First Floor, A-261, New Friends Colony",
    city: "NEW DELHI",
    state: "DELHI",
    stateCode: "7",
    gstin: "07CBDPR8732C1ZM"
  });

  const [items, setItems] = useState([
    { id: 1, itemCode: "ITM-101", name: "AMMA DEKH", hsn: "7018", qty: 400, unit: "BOX", price: 90, discount: 0, gstRate: 0 },
    { id: 2, itemCode: "ITM-102", name: "GB FANCY", hsn: "7018", qty: 400, unit: "BOX", price: 40, discount: 0, gstRate: 0 }
  ]);

  const [charges] = useState({ freight: 0 });

  const [bankDetails] = useState({
    bankName: "AU SMALL FINANCE BANK",
    accountNo: "2221244240401510",
    ifscCode: "AUBL0002442"
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogoUrl(URL.createObjectURL(file));
  };

  const handleItemSelect = (index, itemCode) => {
    const selected = masterItems.find((m) => m.code === itemCode);
    if (!selected) return;

    const updated = [...items];
    updated[index] = {
      ...updated[index],
      itemCode: selected.code,
      name: selected.name,
      hsn: selected.hsn,
      unit: selected.unit,
      price: selected.price,
      gstRate: selected.gstRate
    };
    setItems(updated);
  };

  const handleItemValueChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      { id: Date.now(), itemCode: "", name: "", hsn: "", qty: 1, unit: "PCS", price: 0, discount: 0, gstRate: 0 }
    ]);
  };

  const isIntraState = billing.stateCode === COMPANY_DETAILS.stateCode;

  const totalTaxable = items.reduce((sum, item) => {
    const baseAmt = (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
    const lineTotal = baseAmt - (parseFloat(item.discount) || 0);
    return sum + Math.max(lineTotal, 0);
  }, 0);

  const totalGst = items.reduce((sum, item) => {
    const baseAmt = (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
    const lineTotal = baseAmt - (parseFloat(item.discount) || 0);
    const tax = Math.max(lineTotal, 0) * ((parseFloat(item.gstRate) || 0) / 100);
    return sum + tax;
  }, 0);

  const cgst = isIntraState ? totalGst / 2 : 0;
  const sgst = isIntraState ? totalGst / 2 : 0;
  const igst = !isIntraState ? totalGst : 0;

  const grossTotal = totalTaxable + totalGst + (parseFloat(charges.freight) || 0);
  const roundedGrandTotal = Math.round(grossTotal);
  const autoRoundOff = roundedGrandTotal - grossTotal;

  const fillRowsCount = Math.max(0, 10 - items.length);

  return (
    <div className="invoice-outer-wrapper">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-invoice, .printable-invoice * { visibility: visible; }
          .printable-invoice { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          @page { size: A4 portrait; margin: 6mm; }
        }
      `}</style>

      {/* â”€â”€â”€ Sales Module Tab Navigation â”€â”€â”€ */}
      <div className="no-print" style={{ background: "#fff", padding: "10px 20px 0 20px", borderBottom: "2px solid #dee2e6", display: "flex", flexWrap: "wrap", gap: "2px", marginBottom: "10px" }}>
        {salesTabs.map((tab) => (
          <button key={tab.id} style={salesTabBtnStyle(tab)} onClick={() => setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* â”€â”€â”€ Tab: Sales Invoices â”€â”€â”€ */}
      {activeTab === "invoices" && (
        <SalesInvoiceList
          customers={customers}
          salesInvoices={salesInvoices}
          setSalesInvoices={setSalesInvoices}
          payments={payments}
        />
      )}

      {/* â”€â”€â”€ Tab: Customer Payments â”€â”€â”€ */}
      {activeTab === "payments" && (
        <CustomerPayments
          customers={customers}
          salesInvoices={salesInvoices}
          payments={payments}
          setPayments={setPayments}
          setSalesInvoices={setSalesInvoices}
        />
      )}

      {/* â”€â”€â”€ Tab: Existing Tax Invoice Entry form â”€â”€â”€ */}
      {activeTab === "entry" && (
        <>
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", background: "#fff", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}>
        <h2 style={{ margin: 0, fontSize: "16px", color: "#333" }}>Tax Invoice Entry</h2>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <label style={{ fontSize: "10px" }}>
            Change Logo: <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: "10px" }} />
          </label>
          <button onClick={() => alert("Invoice Saved!")} style={{ backgroundColor: "#28a745", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "3px", cursor: "pointer", fontWeight: "bold" }}>Save</button>
          <button onClick={() => window.print()} style={{ backgroundColor: "#17a2b8", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "3px", cursor: "pointer", fontWeight: "bold" }}>Print A4</button>
        </div>
      </div>

      <div className="printable-invoice" style={{ background: "#fff", border: "1px solid #000", padding: "8px", fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#000", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #000", paddingBottom: "5px", marginBottom: "5px" }}>
          <div style={{ width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/logo.jpeg" alt="ATC Logo" onError={(e) => { e.target.style.display = "none"; }} style={{ width: "80px", height: "80px", objectFit: "contain" }} />
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "8px", fontWeight: "bold" }}>{COMPANY_DETAILS.formType}</div>
            <h1 style={{ margin: "1px 0", fontSize: "16px", fontWeight: "bold", color: "#0b1b80" }}>{COMPANY_DETAILS.name}</h1>
            <div style={{ fontSize: "9px" }}>{COMPANY_DETAILS.address}</div>
            <div style={{ fontWeight: "bold", fontSize: "9px", marginTop: "1px" }}>GSTIN: {COMPANY_DETAILS.gstin} | State: {COMPANY_DETAILS.state} (Code: {COMPANY_DETAILS.stateCode})</div>
            <div style={{ fontSize: "8px", color: "#333" }}>Email: {COMPANY_DETAILS.email} | Mobile: {COMPANY_DETAILS.phone}</div>
          </div>
          <div style={{ width: "110px" }}></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px", borderBottom: "1px solid #000", paddingBottom: "5px", marginBottom: "5px", fontSize: "9px" }}>
          <div><strong>Invoice No.:</strong> <input type="text" value={header.invoiceNo} onChange={(e) => setHeader({ ...header, invoiceNo: e.target.value })} style={{ width: "45px" }} className="no-print" /><span className="print-only">{header.invoiceNo}</span></div>
          <div><strong>Invoice Date:</strong> <input type="date" value={header.invoiceDate} onChange={(e) => setHeader({ ...header, invoiceDate: e.target.value })} className="no-print" /><span className="print-only">{header.invoiceDate}</span></div>
          <div><strong>Place of Supply:</strong> {header.placeOfSupply}</div>
          <div><strong>Transport:</strong> {header.transportName}</div>
          <div><strong>Mode:</strong> {header.transportMode}</div>
          <div><strong>Vehicle No.:</strong> {header.vehNo}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #000", paddingBottom: "5px", marginBottom: "5px", gap: "8px", fontSize: "9px" }}>
          <div style={{ borderRight: "1px solid #ccc", paddingRight: "6px" }}>
            <div style={{ fontWeight: "bold", borderBottom: "1px solid #eee", paddingBottom: "2px", marginBottom: "2px" }}>Details of Receiver (Billed to)</div>
            <div><strong>Name:</strong> {billing.name}</div>
            <div><strong>Address:</strong> {billing.address}, {billing.city}</div>
            <div><strong>State:</strong> {billing.state} (Code: {billing.stateCode})</div>
            <div><strong>GSTIN:</strong> {billing.gstin}</div>
          </div>
          <div>
            <div style={{ fontWeight: "bold", borderBottom: "1px solid #eee", paddingBottom: "2px", marginBottom: "2px" }}>Details of Consignee (Shipped to)</div>
            <div><strong>Name:</strong> {billing.name}</div>
            <div><strong>Address:</strong> {billing.address}, {billing.city}</div>
            <div><strong>State:</strong> {billing.state} (Code: {billing.stateCode})</div>
            <div><strong>GSTIN:</strong> {billing.gstin}</div>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000", fontSize: "9px" }}>
          <thead>
            <tr style={{ background: "#f0f0f0", borderBottom: "1px solid #000" }}>
              <th style={{ borderRight: "1px solid #000", padding: "3px", width: "25px" }}>#</th>
              <th style={{ borderRight: "1px solid #000", padding: "3px", textAlign: "left" }}>Item Name</th>
              <th style={{ borderRight: "1px solid #000", padding: "3px", width: "45px" }}>HSN</th>
              <th style={{ borderRight: "1px solid #000", padding: "3px", width: "40px" }}>Qty</th>
              <th style={{ borderRight: "1px solid #000", padding: "3px", width: "35px" }}>Unit</th>
              <th style={{ borderRight: "1px solid #000", padding: "3px", width: "55px" }}>Rate</th>
              <th style={{ borderRight: "1px solid #000", padding: "3px", width: "65px" }}>Amount</th>
              <th style={{ borderRight: "1px solid #000", padding: "3px", width: "40px" }}>Disc</th>
              <th style={{ padding: "3px", width: "70px" }}>Taxable</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const baseAmt = (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
              const lineTotal = baseAmt - (parseFloat(item.discount) || 0);
              return (
                <tr key={item.id} style={{ borderBottom: "1px solid #ddd", height: "20px" }}>
                  <td style={{ borderRight: "1px solid #000", padding: "2px", textAlign: "center" }}>{idx + 1}</td>
                  <td style={{ borderRight: "1px solid #000", padding: "2px" }}>
                    <select value={item.itemCode} onChange={(e) => handleItemSelect(idx, e.target.value)} className="no-print" style={{ width: "100%", fontSize: "9px" }}>
                      <option value="">-- Select --</option>
                      {masterItems.map((m) => (<option key={m.code} value={m.code}>{m.name}</option>))}
                    </select>
                    <span>{item.name}</span>
                  </td>
                  <td style={{ borderRight: "1px solid #000", padding: "2px", textAlign: "center" }}>{item.hsn}</td>
                  <td style={{ borderRight: "1px solid #000", padding: "2px", textAlign: "right" }}>
                    <input type="number" value={item.qty} onChange={(e) => handleItemValueChange(idx, "qty", e.target.value)} className="no-print" style={{ width: "30px", fontSize: "9px" }} />
                    <span className="print-only">{item.qty}</span>
                  </td>
                  <td style={{ borderRight: "1px solid #000", padding: "2px", textAlign: "center" }}>{item.unit}</td>
                  <td style={{ borderRight: "1px solid #000", padding: "2px", textAlign: "right" }}>{item.price.toFixed(2)}</td>
                  <td style={{ borderRight: "1px solid #000", padding: "2px", textAlign: "right" }}>{baseAmt.toFixed(2)}</td>
                  <td style={{ borderRight: "1px solid #000", padding: "2px", textAlign: "right" }}>{item.discount}</td>
                  <td style={{ padding: "2px", textAlign: "right", fontWeight: "bold" }}>{Math.max(lineTotal, 0).toFixed(2)}</td>
                </tr>
              );
            })}

            {[...Array(fillRowsCount)].map((_, i) => (
              <tr key={`empty-${i}`} style={{ height: "25px", borderBottom: "1px solid #eee" }}>
                <td style={{ borderRight: "1px solid #000" }}></td>
                <td style={{ borderRight: "1px solid #000" }}></td>
                <td style={{ borderRight: "1px solid #000" }}></td>
                <td style={{ borderRight: "1px solid #000" }}></td>
                <td style={{ borderRight: "1px solid #000" }}></td>
                <td style={{ borderRight: "1px solid #000" }}></td>
                <td style={{ borderRight: "1px solid #000" }}></td>
                <td style={{ borderRight: "1px solid #000" }}></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="no-print" style={{ marginTop: "3px", marginBottom: "5px" }}>
          <button onClick={addItemRow} style={{ fontSize: "9px" }}>+ Add Row</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "6px", borderTop: "1px solid #000", paddingTop: "4px", fontSize: "9px" }}>
          <div>
            <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "3px", marginBottom: "3px" }}>
              <strong>Amount Chargeable:</strong> <br />
              <span style={{ fontStyle: "italic", fontWeight: "bold" }}>{numberToWords(roundedGrandTotal)}</span>
            </div>
            <div style={{ fontSize: "8px", lineHeight: "1.3" }}>
              <div><strong>Bank Name:</strong> {bankDetails.bankName}</div>
              <div><strong>A/C No.:</strong> {bankDetails.accountNo}</div>
              <div><strong>IFS CODE:</strong> {bankDetails.ifscCode}</div>
            </div>
            <div style={{ fontSize: "7.5px", marginTop: "3px", color: "#444" }}>
              <div>Certified that the particulars given above are true and correct.</div>
              <div>1. Interest @ 24% p.a. charged after due date.</div>
              <div>2. All disputes subject to Delhi Jurisdiction.</div>
            </div>
          </div>

          <div style={{ borderLeft: "1px solid #ccc", paddingLeft: "6px", fontSize: "9px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2px" }}>
              <div>Total Taxable Amount:</div><div>{totalTaxable.toFixed(2)}</div>
              <div>Add CGST:</div><div>{cgst.toFixed(2)}</div>
              <div>Add SGST:</div><div>{sgst.toFixed(2)}</div>
              <div>Add IGST:</div><div>{igst.toFixed(2)}</div>
              <div>Freight Charges:</div><div>{charges.freight}</div>
              <div>Round Off:</div><div>{autoRoundOff.toFixed(2)}</div>
              <div style={{ borderTop: "1px solid #000", fontWeight: "bold", fontSize: "9.5px", paddingTop: "2px" }}>Total Invoice Amount:</div>
              <div style={{ borderTop: "1px solid #000", fontWeight: "bold", fontSize: "9.5px", paddingTop: "2px" }}>INR {roundedGrandTotal.toFixed(2)}</div>
            </div>

            <div style={{ marginTop: "4px", textAlign: "right" }}>
              <div style={{ fontWeight: "bold", fontSize: "8.5px" }}>For {COMPANY_DETAILS.name}</div>
              <div style={{ height: "42px", margin: "2px 0", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180" style={{ height: "42px", width: "130px", overflow: "visible" }}>
                  <g fill="none" stroke="#0b1b80" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 40 110 C 25 70 30 40 45 25 C 60 12 75 35 65 65 C 55 95 35 120 55 135 C 75 145 95 120 80 90 C 65 60 85 30 105 50 C 120 65 100 115 80 135 C 65 148 90 155 110 130" />
                    <path d="M 110 130 C 130 105 150 65 140 48 C 130 30 110 55 122 85 C 134 115 155 145 180 125 C 198 110 210 85 200 70 C 190 55 202 65 212 85 C 222 105 235 135 250 140 C 262 142 278 120 270 98 C 262 75 285 62 302 85 C 320 110 330 135 352 125 C 370 105 385 85 375 70 C 365 55 378 68 392 88 C 402 110 422 135 442 120" />
                    <circle cx="462" cy="105" r="4.5" fill="#0b1b80" stroke="none" />
                    <circle cx="480" cy="98" r="4.5" fill="#0b1b80" stroke="none" />
                  </g>
                </svg>
              </div>
              <div style={{ fontWeight: "bold", fontSize: "8.5px", borderTop: "1px solid #000", display: "inline-block", paddingTop: "2px", width: "130px" }}>Authorised Signatory</div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default SalesModule;









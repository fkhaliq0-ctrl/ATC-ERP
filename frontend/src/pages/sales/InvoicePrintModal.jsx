import React from 'react';

export default function InvoicePrintModal({ invoice, onClose }) {
  if (!invoice) return null;

  const items = invoice.items || [];
  const minRows = 6;
  const emptyRowsCount = Math.max(0, minRows - items.length);
  const emptyRows = Array(emptyRowsCount).fill({});

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
        
        {/* Modal Action Bar (Hidden during print) */}
        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200 print:hidden">
          <h2 className="text-lg font-bold text-gray-800">Invoice Preview</h2>
          <div className="space-x-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable A4 Invoice Container */}
        <div className="p-8 bg-white text-black font-sans text-xs leading-snug min-h-[297mm] flex flex-col justify-between print:p-6">
          
          <div>
            {/* Top Header: Form Title & Company Info */}
            <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-3">
              <div>
                <p className="font-bold text-[11px] uppercase tracking-wider text-gray-600">Form GST INV - 1</p>
                <h1 className="text-lg font-extrabold tracking-wide uppercase mt-0.5">Allied Trading Corporation</h1>
                <p className="text-[11px] text-gray-800">R-25, Basement, Hall No.5, Main Road, Maujpur, DELHI - 110053</p>
                <p className="text-[11px] text-gray-800 font-semibold mt-0.5">GSTIN: 07ALFPK0050N2Z5</p>
              </div>
              <div className="flex items-center space-x-3">
                <img src="/logo.jpeg" alt="ATC Logo" className="h-14 w-auto object-contain border border-gray-200 p-1 rounded" />
              </div>
            </div>

            {/* Invoice Meta Grid matching Benchmark */}
            <div className="grid grid-cols-3 border border-black text-[11px] mb-3 divide-x divide-black">
              <div className="p-2 space-y-1">
                <p><strong className="font-semibold">Invoice No.:</strong> {invoice.invoiceNo || '1406'}</p>
                <p><strong className="font-semibold">Invoice Date:</strong> {invoice.date || '06-07-2026'}</p>
                <p><strong className="font-semibold">State:</strong> DELHI (Code: 7)</p>
              </div>
              <div className="p-2 space-y-1">
                <p><strong className="font-semibold">Transport Name:</strong> {invoice.transportName || 'Self'}</p>
                <p><strong className="font-semibold">Transportation Mode:</strong> {invoice.transportMode || 'By Road'}</p>
                <p><strong className="font-semibold">Veh. No.:</strong> {invoice.vehicleNo || '-'}</p>
              </div>
              <div className="p-2 space-y-1">
                <p><strong className="font-semibold">Date & Time of Supply:</strong></p>
                <p><strong className="font-semibold">Place of Supply:</strong> New Delhi</p>
              </div>
            </div>

            {/* Billed & Shipped Parties */}
            <div className="grid grid-cols-2 border border-black text-[11px] mb-4 divide-x divide-black">
              <div className="p-2 space-y-1">
                <p className="font-bold underline text-gray-700 mb-1">Details of Receiver (Billed to)</p>
                <p><strong className="font-semibold">Name:</strong> {invoice.customerName || 'M/s ALPINE SALES'}</p>
                <p><strong className="font-semibold">Address:</strong> {invoice.customerAddress || 'First Floor, A-261, New Friends Colony, NEW DELHI'}</p>
                <p><strong className="font-semibold">State:</strong> DELHI (Code: 7)</p>
                <p><strong className="font-semibold">GSTIN/Unique ID:</strong> {invoice.customerGstin || '07CBDPR8732C1ZM'}</p>
              </div>
              <div className="p-2 space-y-1">
                <p className="font-bold underline text-gray-700 mb-1">Details of Consignee (Shipped to)</p>
                <p><strong className="font-semibold">Name:</strong> {invoice.consigneeName || invoice.customerName || 'M/s ALPINE SALES'}</p>
                <p><strong className="font-semibold">Address:</strong> {invoice.consigneeAddress || invoice.customerAddress || 'First Floor, A-261, New Friends Colony, NEW DELHI'}</p>
                <p><strong className="font-semibold">State:</strong> DELHI (Code: 7)</p>
                <p><strong className="font-semibold">GSTIN/Unique ID:</strong> {invoice.consigneeGstin || invoice.customerGstin || '07CBDPR8732C1ZM'}</p>
              </div>
            </div>

            {/* Item Table */}
            <table className="w-full border-collapse border border-black mb-4 text-[11px]">
              <thead>
                <tr className="bg-gray-100 border-b border-black text-center font-bold">
                  <th className="border-r border-black p-1.5 w-8">#</th>
                  <th className="border-r border-black p-1.5 text-left">Item Name</th>
                  <th className="border-r border-black p-1.5 w-16">HSN CODE</th>
                  <th className="border-r border-black p-1.5 w-16">Quantity</th>
                  <th className="border-r border-black p-1.5 w-14">Unit</th>
                  <th className="border-r border-black p-1.5 w-16">Rate</th>
                  <th className="border-r border-black p-1.5 w-20">Amount</th>
                  <th className="border-r border-black p-1.5 w-16">Discount</th>
                  <th className="p-1.5 w-20">Taxable Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-black">
                    <td className="border-r border-black p-1.5 text-center">{idx + 1}</td>
                    <td className="border-r border-black p-1.5 font-medium">{item.name || item.itemName}</td>
                    <td className="border-r border-black p-1.5 text-center">{item.hsn || '7018'}</td>
                    <td className="border-r border-black p-1.5 text-right">{Number(item.qty || item.quantity).toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-center">{item.unit || 'BOX'}</td>
                    <td className="border-r border-black p-1.5 text-right">{Number(item.rate || 0).toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-right">{Number(item.amount || 0).toFixed(2)}</td>
                    <td className="border-r border-black p-1.5 text-right">{Number(item.discount || 0).toFixed(2)}</td>
                    <td className="p-1.5 text-right">{Number(item.taxable || item.amount || 0).toFixed(2)}</td>
                  </tr>
                ))}
                {emptyRows.map((_, idx) => (
                  <tr key={`empty-${idx}`} className="border-b border-black h-7">
                    <td className="border-r border-black p-1.5 text-center text-transparent">{items.length + idx + 1}</td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="border-r border-black p-1.5"></td>
                    <td className="p-1.5"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals & Financial Summary */}
            <div className="grid grid-cols-2 gap-4 border-t-2 border-black pt-3">
              <div className="space-y-3">
                <div>
                  <p className="font-bold mb-0.5">Amount Chargeable (in words):</p>
                  <p className="italic text-gray-800 font-semibold">{invoice.amountInWords || 'Fifty Two Thousand Only.'}</p>
                </div>
                <div className="border border-black p-2 text-[10px] space-y-0.5 bg-gray-50">
                  <p><strong className="font-semibold">Bank Name:</strong> AU SMALL FINANCE BANK</p>
                  <p><strong className="font-semibold">A/C No.:</strong> 2221244240401510</p>
                  <p><strong className="font-semibold">IFS CODE:</strong> AUBL0002442</p>
                </div>
              </div>

              <div className="space-y-1 text-right text-[11px]">
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span>Total Taxable Amount</span>
                  <span className="font-semibold">{Number(invoice.totalTaxable || 52000).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span>Add CGST</span>
                  <span className="font-semibold">{Number(invoice.cgst || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span>Add SGST</span>
                  <span className="font-semibold">{Number(invoice.sgst || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span>Add IGST</span>
                  <span className="font-semibold">{Number(invoice.igst || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span>Tax Amount: GST</span>
                  <span className="font-semibold">0.00</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span>Freight Charges</span>
                  <span className="font-semibold">{Number(invoice.freight || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-gray-200">
                  <span>Round Off</span>
                  <span className="font-semibold">{Number(invoice.roundOff || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1.5 text-sm font-bold border-t-2 border-black">
                  <span>Total Invoice Amount</span>
                  <span>{Number(invoice.totalAmount || 52000).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Terms & Signatory */}
          <div className="border-t border-black pt-3 mt-4 flex justify-between items-end text-[10px]">
            <div className="space-y-1">
              <p>Certified that the particulars given above are true & correct and the amount indicated represents the price actually charged.</p>
              <p className="font-bold mt-2">1. Interest @ 24% p.a. will be charged after due date</p>
              <p className="font-bold">2. All disputes subject to Delhi Jurisdiction</p>
            </div>
            <div className="text-right">
              <p className="font-bold mb-6">For Allied Trading Corporation</p>
              <p className="border-t border-black pt-1 font-semibold">Authorised Signatory</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

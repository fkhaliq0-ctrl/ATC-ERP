const fs = require('fs');
const file = 'E:/zebaish-standalone/src/pages/MenuSelection.jsx';
let src = fs.readFileSync(file, 'utf8');

// Helper: format date as "11 November 2026"
const dateHelperCode = `
    // Helper: format date
    const fmtDate = (d) => {
      if (!d) return '-';
      try {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const parts = d.split('-');
        if (parts.length === 3) {
          const dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          return dt.getDate() + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear();
        }
        return d;
      } catch(e) { return d; }
    };
    const capitalize = (s) => s ? s.replace(/\\b\\w/g, c => c.toUpperCase()) : s || '-';
`;

// Helper: format date
const fmtDate = (d) => {
  if (!d) return '-';
  try {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const parts = d.split('-');
    if (parts.length === 3) {
      const dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return dt.getDate() + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear();
    }
    return d;
  } catch(e) { return d; }
};

// Build the new genPDF function
const oldFnStart = '  // Issue 3: Multi-page PDF\n  const genPDF = useCallback(async () => {';
const oldFnEnd = '  }, [selectedItems, quantities, eventData, preWeddingFunctions]);';

const startIdx = src.indexOf(oldFnStart);
const endIdx = src.indexOf(oldFnEnd, startIdx);
if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find genPDF function boundaries');
  console.log('startIdx:', startIdx, 'endIdx:', endIdx);
  process.exit(1);
}

const oldFn = src.substring(startIdx, endIdx + oldFnEnd.length);

const newFn = `  // Professional PDF generation
  const genPDF = useCallback(async () => {
    console.log('PDF generation started');
    let html2canvas, jsPDF;
    try {
      const h2c = await import('html2canvas');
      html2canvas = h2c.default;
      const jsp = await import('jspdf');
      jsPDF = jsp.default;
      console.log('Libraries loaded OK:', typeof html2canvas, typeof jsPDF);
    } catch(e) {
      console.error('Failed to load PDF libraries:', e);
      alert('PDF libraries failed to load. Please refresh the page and try again.');
      return;
    }

    // Helper: format date as "11 November 2026"
    const fmtDate = (d) => {
      if (!d) return '-';
      try {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const parts = d.split('-');
        if (parts.length === 3) {
          const dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          return dt.getDate() + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear();
        }
        return d;
      } catch(e) { return d; }
    };
    const capitalize = (s) => s ? s.replace(/\\\\b\\\\w/g, c => c.toUpperCase()) : '-';
    const pName = capitalize(eventData.fullName || 'Customer');
    const gender = eventData.gender || 'Mr./Ms.';
    const pTitle = gender + ' ' + pName;
    const pVenue = capitalize(eventData.venue || '-');
    const pCity = capitalize(eventData.city || '-');

    // Build PDF content in a hidden container
    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;left:-9999px;top:0;width:700px;font-family:Georgia,serif;color:#333333;background:#ffffff;padding:0;margin:0;';
    document.body.appendChild(container);

    // Build menu HTML
    let menuHtml = '', idx = 0;
    Object.entries(selectedItems).forEach(([cn, items]) => {
      menuHtml += '<div style="margin-bottom:16px;page-break-inside:avoid;">';
      menuHtml += '<h3 style="color:#1a237e;font-size:13px;margin:0 0 8px;padding:6px 10px;background:#f0f0f5;border-left:4px solid #1a237e;border-radius:0 4px 4px 0;font-weight:700;letter-spacing:0.5px;">' + cn + '</h3>';
      items.forEach(it => {
        idx++;
        menuHtml += '<div style="margin:3px 0;font-size:11px;color:#333;padding:4px 10px;background:' + (idx%2===0?'#f8f8fc':'#ffffff') + ';border-bottom:1px solid #f0f0f0;"><span style="color:#1a237e;font-weight:600;margin-right:6px;">' + idx + '.</span>' + it + '</div>';
      });
      menuHtml += '</div>';
    });
    const totalItems = Object.values(selectedItems).reduce((s,c) => s+c.length, 0);

    // Pre-wedding functions
    let preWedHtml = '';
    if (preWeddingFunctions.length > 0) {
      preWedHtml = '<h3 style="color:#1a237e;font-size:13px;margin:14px 0 8px;font-weight:700;">Pre-Wedding Functions</h3>';
      preWedHtml += '<table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:14px;">';
      preWedHtml += '<tr style="background:#f0f0f5;"><th style="padding:5px 10px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Function</th><th style="padding:5px 10px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Date</th><th style="padding:5px 10px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Time</th><th style="padding:5px 10px;text-align:left;border:1px solid #e0e0e0;color:#1a237e;font-weight:700;">Venue</th></tr>';
      preWeddingFunctions.forEach(f => {
        preWedHtml += '<tr><td style="padding:5px 10px;border:1px solid #e0e0e0;">' + f.name + '</td><td style="padding:5px 10px;border:1px solid #e0e0e0;">' + f.date + '</td><td style="padding:5px 10px;border:1px solid #e0e0e0;">' + f.time + '</td><td style="padding:5px 10px;border:1px solid #e0e0e0;">' + f.venue + '</td></tr>';
      });
      preWedHtml += '</table>';
    }

    // Build full HTML content — SINGLE PAGE with everything
    container.innerHTML = ''
      // HEADER with SVG logo
      + '<div style="text-align:center;padding:30px 30px 20px;border-bottom:3px solid #1a237e;">'
      + '<img src="Zehaish_Golden_Logo.svg" alt="Zebaish Caterers" style="height:70px;display:block;margin:0 auto 10px;" onerror="this.style.display=\\'none\\'"/>'
      + '<p style="color:#666;font-size:11px;margin:2px 0 0;letter-spacing:1px;">A Unit of Allied Trading Corporation</p>'
      + '</div>'

      // TITLE
      + '<div style="text-align:center;padding:16px 30px 12px;">'
      + '<h2 style="color:#1a237e;font-size:20px;margin:0;font-weight:700;letter-spacing:0.5px;">Customized Menu for ' + pTitle + '</h2>'
      + '<p style="color:#666;font-size:11px;margin:6px 0 0;">Prepared on ' + fmtDate(eventData.eventDate || new Date().toISOString().split('T')[0]) + '</p>'
      + '</div>'

      // EVENT SUMMARY — Grid layout
      + '<div style="padding:0 30px 16px;">'
      + '<h3 style="color:#1a237e;font-size:14px;margin:0 0 8px;padding-bottom:4px;border-bottom:2px solid #1a237e;font-weight:700;">Event Summary</h3>'
      + '<table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e0e0e0;">'
      + '<tr><td style="padding:6px 10px;border:1px solid #e0e0e0;background:#f0f0f5;width:50%;"><b style="color:#1a237e;">Name</b></td><td style="padding:6px 10px;border:1px solid #e0e0e0;">' + pTitle + '</td></tr>'
      + '<tr><td style="padding:6px 10px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Phone</b></td><td style="padding:6px 10px;border:1px solid #e0e0e0;">' + (eventData.phone || '-') + '</td></tr>'
      + '<tr><td style="padding:6px 10px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Venue</b></td><td style="padding:6px 10px;border:1px solid #e0e0e0;">' + pVenue + (eventData.location ? ', ' + capitalize(eventData.location) : '') + '</td></tr>'
      + '<tr><td style="padding:6px 10px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">City</b></td><td style="padding:6px 10px;border:1px solid #e0e0e0;">' + pCity + '</td></tr>'
      + '<tr><td style="padding:6px 10px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">PAX</b></td><td style="padding:6px 10px;border:1px solid #e0e0e0;">' + (eventData.pax || '-') + '</td></tr>'
      + '<tr><td style="padding:6px 10px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Function</b></td><td style="padding:6px 10px;border:1px solid #e0e0e0;">' + (eventData.functionType || '-') + '</td></tr>'
      + '<tr><td style="padding:6px 10px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Service</b></td><td style="padding:6px 10px;border:1px solid #e0e0e0;">' + (eventData.serviceRequired || '-') + '</td></tr>'
      + '<tr><td style="padding:6px 10px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Gathering</b></td><td style="padding:6px 10px;border:1px solid #e0e0e0;">' + (eventData.gatheringType || '-') + '</td></tr>'
      + '<tr><td style="padding:6px 10px;border:1px solid #e0e0e0;background:#f0f0f5;"><b style="color:#1a237e;">Date & Time</b></td><td style="padding:6px 10px;border:1px solid #e0e0e0;">' + fmtDate(eventData.eventDate) + ' at ' + (eventData.eventTime || '-') + '</td></tr>'
      + '</table>'
      + preWedHtml
      + '</div>'

      // SELECTED MENU
      + '<div style="padding:0 30px 16px;">'
      + '<h3 style="color:#1a237e;font-size:14px;margin:0 0 10px;padding-bottom:4px;border-bottom:2px solid #1a237e;font-weight:700;">Selected Menu (' + totalItems + ' items)</h3>'
      + menuHtml
      + '</div>'

      // PAYMENT TERMS
      + '<div style="padding:0 30px 16px;">'
      + '<div style="background:#f0f0f5;padding:14px 16px;border:1px solid #e0e0e0;text-align:center;">'
      + '<b style="color:#1a237e;font-size:13px;">PAYMENT TERMS</b><br/>'
      + '<span style="color:#666;font-size:11px;">30% at Booking &nbsp;·&nbsp; 30% one week before &nbsp;·&nbsp; 40% day before the function &nbsp;·&nbsp; GST 18% Extra</span>'
      + '</div></div>'

      // SIGNATURE SPACE
      + '<div style="padding:20px 30px 0;display:flex;justify-content:space-between;">'
      + '<div style="width:45%;text-align:center;">'
      + '<div style="border-top:1px solid #ccc;margin-top:50px;padding-top:6px;font-size:11px;color:#666;">Customer Signature</div>'
      + '</div>'
      + '<div style="width:45%;text-align:center;">'
      + '<div style="border-top:1px solid #ccc;margin-top:50px;padding-top:6px;font-size:11px;color:#666;">For Zebaish Caterers</div>'
      + '</div>'
      + '</div>'

      // FOOTER
      + '<div style="text-align:center;margin-top:30px;padding:16px 30px;border-top:3px solid #1a237e;">'
      + '<p style="font-size:10px;color:#1a237e;margin:0 0 6px;font-weight:700;">Zebaish Caterers | A Unit of Allied Trading Corporation</p>'
      + '<p style="font-size:14px;font-weight:700;color:#1a237e;margin:0;font-style:italic;">"We would love to make your cherishable memories, memorable for you and your loved ones"</p>'
      + '</div>';

    // Capture with html2canvas
    try {
      console.log('Calling html2canvas...');
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false });
      console.log('html2canvas done, canvas size:', canvas.width, 'x', canvas.height);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = -(imgHeight - heightLeft);
        doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const cn = pName.replace(/[^a-zA-Z0-9]/g, '_');
      const cv = (eventData.venue || 'Venue').replace(/[^a-zA-Z0-9]/g, '_');
      const cd = eventData.eventDate || new Date().toISOString().split('T')[0];
      console.log('Saving PDF as:', cn + '_' + cv + '_' + cd + '.pdf');
      doc.save(cn + '_' + cv + '_' + cd + '.pdf');
    } catch(e) {
      console.error('PDF error:', e);
      alert('Error generating PDF: ' + e.message);
    }

    document.body.removeChild(container);
  }, [selectedItems, quantities, eventData, preWeddingFunctions]);`;

const newSrc = src.substring(0, startIdx) + newFn + src.substring(endIdx + oldFnEnd.length);
fs.writeFileSync(file, newSrc, 'utf8');
console.log('genPDF function completely rewritten');

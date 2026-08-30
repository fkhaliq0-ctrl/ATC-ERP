from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.platypus import Table, TableStyle
import io, math


# --- Number to Indian Words ---
_ONES = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
    'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen',
    'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
]
_TENS = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety',
]


def _two_digits(n):
    if n == 0:
        return ''
    if n < 20:
        return _ONES[n]
    return _TENS[n // 10] + ('' if n % 10 == 0 else ' ' + _ONES[n % 10])


def number_to_words(amount):
    """Convert an amount to Indian-English words (INR)."""
    if amount == 0:
        return 'Zero Only.'
    rupees = int(amount)
    paise = round((amount - rupees) * 100)

    parts = []
    if rupees >= 10000000:
        parts.append(_two_digits(rupees // 10000000) + ' Crore')
        rupees %= 10000000
    if rupees >= 100000:
        parts.append(_two_digits(rupees // 100000) + ' Lakh')
        rupees %= 100000
    if rupees >= 1000:
        parts.append(_two_digits(rupees // 1000) + ' Thousand')
        rupees %= 1000
    if rupees >= 100:
        parts.append(_ONES[rupees // 100] + ' Hundred')
        rupees %= 100
    if rupees > 0:
        parts.append(_two_digits(rupees))

    result = ' '.join(p for p in parts if p).strip()
    if paise:
        result += f' and {_two_digits(paise)} Paise'
    return result + ' Only.'


# --- Helpers ---
def _safe(val, default=''):
    return default if val is None else str(val)


def _num(val, default=0):
    try:
        return float(val)
    except (TypeError, ValueError):
        return default


def _draw_line(c, x1, y, x2):
    c.line(x1, y, x2, y)


def _draw_rect(c, x, y, w, h):
    c.rect(x, y, w, h)


# --- Main PDF Generator ---
def generate_sales_invoice_pdf(invoice, customer, brand='Zebaish'):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    W, H = A4  # 595.28 x 841.89 points

    # Margins
    LM = 40      # left margin
    RM = W - 40  # right margin
    TM = H - 35  # top margin
    CW = RM - LM  # content width ~515

    y = TM  # current drawing cursor

    # --- colours ---
    GREEN = colors.HexColor('#1b5e20')
    LIGHT_GREEN = colors.HexColor('#e8f5e9')
    BLACK = colors.black
    GREY = colors.HexColor('#666666')
    WHITE = colors.white

    # ==================================================================
    # 1. COMPANY HEADER
    # ==================================================================
    c.setFont('Helvetica-Bold', 18)
    c.setFillColor(GREEN)
    c.drawCentredString(W / 2, y, 'ALLIED TRADING CORPORATION')
    y -= 18

    c.setFont('Helvetica', 10)
    c.setFillColor(BLACK)
    c.drawCentredString(W / 2, y, 'Form GST INV - 1')
    y -= 16

    c.setFont('Helvetica', 8)
    c.setFillColor(GREY)
    c.drawCentredString(W / 2, y, 'R-25, Basement, Hall No 5, Main Road, Maupur, Delhi - 110053')
    y -= 13
    c.drawCentredString(W / 2, y, 'GSTIN: 07ALFPK0050N2Z5')
    y -= 18

    # thin line
    c.setStrokeColor(GREEN)
    c.setLineWidth(1)
    _draw_line(c, LM, y, RM)
    y -= 18

    # ==================================================================
    # 2. INVOICE NO and DATE (in a small table box)
    # ==================================================================
    box_w = 200
    box_h = 18
    box_x = RM - box_w
    c.setStrokeColor(BLACK)
    c.setLineWidth(0.5)
    _draw_rect(c, box_x, y - box_h, box_w, box_h)

    c.setFont('Helvetica', 9)
    c.setFillColor(BLACK)
    c.drawString(box_x + 5, y - 13, 'Invoice No.: ' + _safe(invoice.invoice_no))
    date_str = invoice.invoice_date.strftime('%d-%m-%Y') if invoice.invoice_date else ''
    c.drawRightString(RM - 5, y - 13, 'Date: ' + date_str)
    y -= (box_h + 10)

    # ==================================================================
    # 3. TRANSPORT DETAILS
    # ==================================================================
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(GREEN)
    c.drawString(LM, y, 'Transport Details')
    y -= 2

    c.setStrokeColor(BLACK)
    c.setLineWidth(0.3)
    _draw_rect(c, LM, y - 30, CW, 30)
    _draw_line(c, LM + CW / 3, y, LM + CW / 3, y - 30)
    _draw_line(c, LM + 2 * CW / 3, y, LM + 2 * CW / 3, y - 30)

    c.setFont('Helvetica', 7)
    c.setFillColor(GREY)
    c.drawString(LM + 3, y - 10, 'Transport Name:')
    c.drawString(LM + 3, y - 22, _safe(getattr(invoice, 'transport_name', ''), '-'))
    c.drawString(LM + CW / 3 + 3, y - 10, 'Mode:')
    c.drawString(LM + CW / 3 + 3, y - 22, _safe(getattr(invoice, 'transport_mode', ''), '-'))
    c.drawString(LM + 2 * CW / 3 + 3, y - 10, 'Veh. No. / GR No. and Date:')
    c.drawString(LM + 2 * CW / 3 + 3, y - 22, _safe(getattr(invoice, 'vehicle_no', ''), '-'))
    y -= 40

    # ==================================================================
    # 4. RECEIVER and CONSIGNEE (side by side boxes)
    # ==================================================================
    half_w = CW / 2 - 5

    # --- Billed To ---
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(GREEN)
    c.drawString(LM, y, 'Details of Receiver (Billed to)')
    y_box = y - 2
    box_h_rcv = 60
    c.setStrokeColor(BLACK)
    c.setLineWidth(0.3)
    _draw_rect(c, LM, y_box - box_h_rcv, half_w, box_h_rcv)

    c.setFont('Helvetica', 7)
    c.setFillColor(BLACK)
    ly = y_box - 12
    c.drawString(LM + 4, ly, 'Name: ' + _safe(invoice.customer_name))
    ly -= 12
    c.drawString(LM + 4, ly, 'Address: ' + _safe(invoice.customer_address, '-'))
    ly -= 12
    c.drawString(LM + 4, ly, 'State: ' + _safe(invoice.customer_state, '-'))
    c.drawString(LM + 80, ly, 'State Code: ' + _safe(invoice.customer_state_code, '-'))
    ly -= 12
    c.drawString(LM + 4, ly, 'PAN: ' + _safe(getattr(invoice, 'customer_pan', ''), '-'))

    # --- Shipped To ---
    rx = LM + half_w + 10
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(GREEN)
    c.drawString(rx, y, 'Details of Consignee (Shipped to)')
    c.setStrokeColor(BLACK)
    c.setLineWidth(0.3)
    _draw_rect(c, rx, y_box - box_h_rcv, half_w, box_h_rcv)

    c.setFont('Helvetica', 7)
    c.setFillColor(BLACK)
    ly = y_box - 12
    cname = _safe(invoice.consignee_name) or _safe(invoice.customer_name)
    caddr = _safe(invoice.consignee_address) or _safe(invoice.customer_address, '-')
    cstate = _safe(invoice.consignee_state) or _safe(invoice.customer_state, '-')
    ccode = _safe(invoice.consignee_state_code) or _safe(invoice.customer_state_code, '-')
    c.drawString(rx + 4, ly, 'Name: ' + cname)
    ly -= 12
    c.drawString(rx + 4, ly, 'Address: ' + caddr)
    ly -= 12
    c.drawString(rx + 4, ly, 'State: ' + cstate)
    c.drawString(rx + 80, ly, 'State Code: ' + ccode)
    ly -= 12
    c.drawString(rx + 4, ly, 'PAN: ' + _safe(getattr(invoice, 'consignee_pan', ''), '-'))

    y = y_box - box_h_rcv - 12

    # ==================================================================
    # 5. ITEMS TABLE
    # ==================================================================
    items = invoice.items_data or []
    max_rows = 12  # blank rows if fewer items
    visible_rows = max(len(items), max_rows)

    col_widths = [22, 135, 50, 38, 35, 58, 40, 65]  # total ~443
    header = ['#', 'Item Name', 'HSN', 'Unit', 'Qty', 'Rate', 'GST%', 'Taxable (Rs.)']
    table_data = [header]

    total_taxable = 0.0
    total_cgst = 0.0
    total_sgst = 0.0
    item_cgst_list = []
    item_sgst_list = []

    for idx, item in enumerate(items, 1):
        qty = _num(item.get('qty', 0))
        rate = _num(item.get('rate', 0))
        gst_pct = _num(item.get('gst_percent', 0))
        taxable = _num(item.get('taxable_amount', qty * rate))
        cgst_amt = round(taxable * gst_pct / 200, 2)
        sgst_amt = round(taxable * gst_pct / 200, 2)
        total_taxable += taxable
        total_cgst += cgst_amt
        total_sgst += sgst_amt
        item_cgst_list.append(cgst_amt)
        item_sgst_list.append(sgst_amt)

        table_data.append([
            str(idx),
            _safe(item.get('item_name', '')),
            _safe(item.get('hsn', '')),
            _safe(item.get('unit', '')),
            '{:.0f}'.format(qty),
            '{:.2f}'.format(rate),
            '{:.0f}%'.format(gst_pct),
            '{:.2f}'.format(taxable),
        ])

    # pad blank rows
    while len(table_data) < visible_rows + 1:
        table_data.append(['', '', '', '', '', '', '', ''])

    row_height = 14
    table_top = y

    t = Table(table_data, colWidths=col_widths, rowHeights=[16] + [row_height] * visible_rows)
    style = TableStyle([
        # header
        ('BACKGROUND', (0, 0), (-1, 0), GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 7),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        # body
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 7),
        ('ALIGN', (0, 1), (0, -1), 'CENTER'),
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),
        ('ALIGN', (2, 1), (2, -1), 'CENTER'),
        ('ALIGN', (3, 1), (3, -1), 'CENTER'),
        ('ALIGN', (4, 1), (4, -1), 'CENTER'),
        ('ALIGN', (5, 1), (5, -1), 'RIGHT'),
        ('ALIGN', (6, 1), (6, -1), 'CENTER'),
        ('ALIGN', (7, 1), (7, -1), 'RIGHT'),
        # grid
        ('GRID', (0, 0), (-1, -1), 0.4, colors.grey),
        ('BOX', (0, 0), (-1, -1), 0.8, GREEN),
    ])
    for i in range(1, len(table_data)):
        if i % 2 == 0:
            style.add('BACKGROUND', (0, i), (-1, i), LIGHT_GREEN)
    t.setStyle(style)

    tw, th = t.wrap(CW, 0)
    t.drawOn(c, LM, table_top - th)
    y = table_top - th - 8

    # ==================================================================
    # 6. TOTALS SECTION (right-aligned)
    # ==================================================================
    right_x = RM - 5

    def _row(label, value, bold=False, dy=0):
        nonlocal y
        y -= dy
        font = 'Helvetica-Bold' if bold else 'Helvetica'
        c.setFont(font, 8)
        c.setFillColor(BLACK)
        c.drawRightString(right_x, y, label + ':  Rs. ' + '{:.2f}'.format(value))
        y -= 2

    _row('Total Taxable Amount', total_taxable, bold=True, dy=2)
    if total_cgst > 0:
        _row('Add: CGST', total_cgst, dy=4)
        _row('Add: SGST', total_sgst, dy=2)

    freight = _num(getattr(invoice, 'freight_charges', 0))
    if freight > 0:
        _row('Freight Charges', freight, dy=4)

    # Round off
    grand_before_round = total_taxable + total_cgst + total_sgst + freight
    rounded = round(grand_before_round)
    round_off = round(rounded - grand_before_round, 2)
    if round_off != 0:
        _row('Round Off', round_off, dy=4)

    grand_total = rounded if round_off != 0 else grand_before_round

    # Grand total box
    y -= 4
    c.setStrokeColor(GREEN)
    c.setLineWidth(1)
    _draw_rect(c, right_x - 180, y - 2, 185, 18)
    c.setFont('Helvetica-Bold', 10)
    c.setFillColor(GREEN)
    c.drawRightString(right_x, y + 3, 'Total Invoice Amount:  Rs. ' + '{:.2f}'.format(grand_total))
    y -= 22

    # ==================================================================
    # 7. AMOUNT IN WORDS
    # ==================================================================
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(BLACK)
    c.drawString(LM, y, 'Amount in Words: ' + number_to_words(grand_total))
    y -= 20

    # ==================================================================
    # 8. BANK DETAILS
    # ==================================================================
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(GREEN)
    c.drawString(LM, y, 'Bank Details')
    y -= 2

    c.setStrokeColor(BLACK)
    c.setLineWidth(0.3)
    _draw_rect(c, LM, y - 50, 250, 50)
    c.setFont('Helvetica', 7)
    c.setFillColor(BLACK)
    bank_y = y - 11
    c.drawString(LM + 4, bank_y, 'Bank: A U SMALL FINANCE BANK')
    c.drawString(LM + 4, bank_y - 12, 'A/C: 2221244240401510')
    c.drawString(LM + 4, bank_y - 24, 'IFSC: AUBL0002442')
    c.drawString(LM + 4, bank_y - 36, 'Branch: Yamuna Vihar')
    y -= 58

    # ==================================================================
    # 9. TERMS and CONDITIONS
    # ==================================================================
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(GREEN)
    c.drawString(LM, y, 'Terms and Conditions')
    y -= 12

    c.setFont('Helvetica', 7)
    c.setFillColor(BLACK)
    terms = [
        '1. Interest @ 24% p.a. will be charged after due date.',
        '2. All disputes subject to Delhi Jurisdiction.',
    ]
    for t_text in terms:
        c.drawString(LM + 4, y, t_text)
        y -= 11
    y -= 4

    # ==================================================================
    # 10. CERTIFICATION
    # ==================================================================
    c.setFont('Helvetica-Oblique', 7)
    c.setFillColor(BLACK)
    c.drawString(LM, y, 'Certified that the particulars given above are true and correct.')
    y -= 20

    # ==================================================================
    # 11. DIGITAL SIGNATURE (right side)
    # ==================================================================
    sig_x = RM - 180
    sig_y = y
    c.setFont('Helvetica-Bold', 10)
    c.setFillColor(GREEN)
    c.drawString(sig_x, sig_y, 'For Allied Trading Corporation')
    c.setFont('Helvetica', 8)
    c.setFillColor(BLACK)
    c.drawString(sig_x + 30, sig_y - 18, 'Authorised Signatory')

    # ==================================================================
    # 12. FOOTER LINE
    # ==================================================================
    c.setStrokeColor(GREEN)
    c.setLineWidth(0.5)
    _draw_line(c, LM, 35, RM, 35)

    # --- save ---
    c.save()
    buffer.seek(0)
    return buffer

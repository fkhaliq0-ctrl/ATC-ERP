import os
import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
import json

class PDFGenerator:
    def __init__(self, invoice_data, file_name):
        self.invoice_data = invoice_data
        self.file_name = file_name
        self.styles = getSampleStyleSheet()
        
    def generate(self):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=25, bottomMargin=20)
        story = []
        
        # Main wrapper with border (ONE BIG BOX)
        main_data = []
        
        # 1. GST Title - CENTER
        main_data.append(self._create_gst_title())
        main_data.append(Spacer(1, 0.05*cm))
        
        # 2. Company Header - CENTER (FULL WIDTH)
        main_data.append(self._create_company_header())
        main_data.append(Spacer(1, 0.05*cm))
        
        # 3. Invoice Details - FULL WIDTH (3 columns)
        main_data.append(self._create_invoice_details())
        main_data.append(Spacer(1, 0.05*cm))
        
        # 4. GR Details - FULL WIDTH (2 columns)
        main_data.append(self._create_gr_details())
        main_data.append(Spacer(1, 0.05*cm))
        
        # 5. Customer & Consignee - FULL WIDTH (2 columns)
        main_data.append(self._create_customer_consignee())
        main_data.append(Spacer(1, 0.05*cm))
        
        # 6. Items Table - FULL WIDTH
        main_data.append(self._create_items_table())
        main_data.append(Spacer(1, 0.05*cm))
        
        # 7. No. of Packages
        main_data.append(self._create_packages())
        main_data.append(Spacer(1, 0.05*cm))
        
        # 8. Summary - FULL WIDTH (Bank Left, Tax Right)
        main_data.append(self._create_summary())
        main_data.append(Spacer(1, 0.05*cm))
        
        # 9. Amount in Words - FULL WIDTH (Left aligned)
        main_data.append(self._create_amount_in_words())
        main_data.append(Spacer(1, 0.05*cm))
        
        # 10. Footer - FULL WIDTH (Terms Left, Signature Right)
        main_data.append(self._create_footer())
        
        # Wrap everything in ONE BIG BOX
        main_table = Table([main_data], colWidths=[16.5*cm])
        main_table.setStyle(TableStyle([
            ('BOX', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        story.append(main_table)
        doc.build(story)
        
        pdf_data = buffer.getvalue()
        buffer.close()
        return pdf_data
    
    def _format_currency(self, amount):
        try:
            return "Rs. {:,.2f}".format(float(amount or 0))
        except:
            return "Rs. 0.00"
    
    def _create_gst_title(self):
        s = ParagraphStyle('Gst', parent=self.styles['Normal'], fontSize=12, alignment=TA_CENTER, fontName='Helvetica-Bold')
        return Paragraph("Form GST INV - 1", s)
    
    def _create_company_header(self):
        data = self.invoice_data
        brand = data.get('brand', 'Allied Trading Corporation')
        
        h = ParagraphStyle('H', parent=self.styles['Normal'], fontSize=16, alignment=TA_CENTER, fontName='Helvetica-Bold')
        s = ParagraphStyle('S', parent=self.styles['Normal'], fontSize=10, alignment=TA_CENTER)
        g = ParagraphStyle('G', parent=self.styles['Normal'], fontSize=9, alignment=TA_CENTER)
        
        logo_path = "E:\\ATC-ERP\\backend\\static\\atc_logo.png"
        try:
            logo = Image(logo_path, width=2*cm, height=2*cm)
        except:
            logo = None
        
        if logo:
            tbl = Table([[logo, Paragraph("<b>" + brand + "</b>", h)]], colWidths=[2.5*cm, 14*cm])
            tbl.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('ALIGN', (1,0), (1,0), 'CENTER')]))
        else:
            tbl = Table([[Paragraph("<b>" + brand + "</b>", h)]], colWidths=[16.5*cm])
            tbl.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER')]))
        
        addr = Table([
            [Paragraph("R-25, Basement, Hall No.5, Main Road, Maujpur, Delhi - 110053", s)],
            [Paragraph("GSTIN: 07ALFPK0050N2Z5", g)]
        ], colWidths=[16.5*cm])
        addr.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER'), ('TOPPADDING', (0,0), (-1,-1), 2)]))
        
        main = Table([[tbl], [addr]], colWidths=[16.5*cm])
        main.setStyle(TableStyle([
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('LINEBELOW', (0,0), (-1,0), 1, colors.black),
        ]))
        return main
    
    def _create_invoice_details(self):
        data = self.invoice_data
        s = ParagraphStyle('N', parent=self.styles['Normal'], fontSize=9)
        
        t = Table([
            [Paragraph("<b>Invoice No:</b> " + data.get('invoiceNo', ''), s),
             Paragraph("<b>Date:</b> " + data.get('salesInvoiceDate', ''), s),
             Paragraph("<b>State:</b> " + data.get('state', 'Delhi'), s)],
            [Paragraph("<b>Transport:</b> " + data.get('transportName', ''), s),
             Paragraph("<b>Mode:</b> " + data.get('mode', 'Road'), s),
             Paragraph("<b>Vehicle:</b> " + data.get('vehicleNo', ''), s)]
        ], colWidths=[5.5*cm, 5.5*cm, 5.5*cm])
        t.setStyle(TableStyle([
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('LINEBELOW', (0,0), (-1,0), 0.5, colors.grey),
        ]))
        return t
    
    def _create_gr_details(self):
        data = self.invoice_data
        s = ParagraphStyle('N', parent=self.styles['Normal'], fontSize=9)
        
        t = Table([
            [Paragraph("<b>GR No:</b> " + data.get('grNo', ''), s),
             Paragraph("<b>GR Date:</b> " + data.get('grDate', ''), s)]
        ], colWidths=[8.25*cm, 8.25*cm])
        t.setStyle(TableStyle([
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f5f5f5')),
            ('LINEBELOW', (0,0), (-1,0), 0.5, colors.grey),
        ]))
        return t
    
    def _create_customer_consignee(self):
        data = self.invoice_data
        s = ParagraphStyle('N', parent=self.styles['Normal'], fontSize=8)
        b = ParagraphStyle('B', parent=self.styles['Normal'], fontSize=8, fontName='Helvetica-Bold')
        gstin = data.get('gstin', '')
        
        cust = [
            [Paragraph("<b>Customer (Billed to)</b>", b)],
            [Paragraph("<b>Name:</b> " + data.get('customer', ''), s)],
            [Paragraph("<b>Address:</b> " + data.get('address', ''), s)],
            [Paragraph("<b>City:</b> " + data.get('city', '') + ", " + data.get('state', ''), s)],
            [Paragraph("<b>State Code:</b> " + data.get('stateCode', ''), s)],
            [Paragraph("<b>GSTIN:</b> " + gstin, s)],
            [Paragraph("<b>Phone:</b> " + data.get('phone', ''), s)],
        ]
        
        cons = [
            [Paragraph("<b>Consignee (Shipped to)</b>", b)],
            [Paragraph("<b>Name:</b> " + data.get('consigneeName', ''), s)],
            [Paragraph("<b>Address:</b> " + data.get('consigneeAddress', ''), s)],
            [Paragraph("<b>City:</b> " + data.get('consigneeCity', '') + ", " + data.get('consigneeState', ''), s)],
            [Paragraph("<b>State Code:</b> " + data.get('consigneeStateCode', ''), s)],
            [Paragraph("<b>GSTIN:</b> " + gstin, s)],
            [Paragraph("<b>Phone:</b> " + data.get('consigneePhone', ''), s)],
        ]
        
        t1 = Table(cust, colWidths=[7.8*cm])
        t1.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2), ('BOX', (0,0), (-1,-1), 0.5, colors.grey)]))
        
        t2 = Table(cons, colWidths=[7.8*cm])
        t2.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2), ('BOX', (0,0), (-1,-1), 0.5, colors.grey)]))
        
        t = Table([[t1, t2]], colWidths=[8*cm, 8*cm])
        t.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2)]))
        return t
    
    def _create_items_table(self):
        items = self.invoice_data.get('items', [])
        s = ParagraphStyle('N', parent=self.styles['Normal'], fontSize=7)
        h = ParagraphStyle('H', parent=self.styles['Normal'], fontSize=7, fontName='Helvetica-Bold')
        
        data = [
            [Paragraph("#", h), Paragraph("Item Name", h), Paragraph("HSN", h), 
             Paragraph("Unit", h), Paragraph("Qty", h), Paragraph("Rate", h), 
             Paragraph("GST%", h), Paragraph("Amount", h)]
        ]
        
        for idx, item in enumerate(items, 1):
            data.append([
                Paragraph(str(idx), s),
                Paragraph(item.get('description', ''), s),
                Paragraph(item.get('hsn', ''), s),
                Paragraph(item.get('unit', ''), s),
                Paragraph(str(item.get('quantity', 0)), s),
                Paragraph(self._format_currency(item.get('rate', 0)), s),
                Paragraph(str(int(item.get('gst', 0))) + '%', s),
                Paragraph(self._format_currency(item.get('amount', 0)), s)
            ])
        
        subtotal = sum(item.get('amount', 0) for item in items)
        data.append([
            Paragraph("", s), Paragraph("", s), Paragraph("", s),
            Paragraph("", s), Paragraph("", s), Paragraph("", s),
            Paragraph("<b>Subtotal</b>", h), Paragraph("<b>" + self._format_currency(subtotal) + "</b>", h)
        ])
        
        t = Table(data, colWidths=[0.6*cm, 3.5*cm, 1.8*cm, 1*cm, 0.8*cm, 1.8*cm, 1.2*cm, 2.2*cm], repeatRows=1)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1a237e')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 7),
            ('ALIGN', (0,0), (-1,0), 'CENTER'),
            ('ALIGN', (5,0), (7,-1), 'RIGHT'),
            ('FONTSIZE', (0,1), (-1,-1), 7),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('BOX', (0,0), (-1,-1), 0.5, colors.grey),
            ('GRID', (0,0), (-1,-2), 0.5, colors.lightgrey),
            ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#e8edf5')),
            ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
            ('SPAN', (0,-1), (6,-1)),
            ('ALIGN', (6,-1), (7,-1), 'RIGHT'),
        ]))
        return t
    
    def _create_packages(self):
        data = self.invoice_data
        s = ParagraphStyle('N', parent=self.styles['Normal'], fontSize=9)
        b = ParagraphStyle('B', parent=self.styles['Normal'], fontSize=9, fontName='Helvetica-Bold')
        
        packages = data.get('packages', '')
        
        t = Table([
            [Paragraph("<b>No. of Packages:</b> " + str(packages), b)]
        ], colWidths=[16.5*cm])
        t.setStyle(TableStyle([
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0f4f8')),
            ('LINEBELOW', (0,0), (-1,0), 0.5, colors.grey),
        ]))
        return t
    
    def _create_summary(self):
        data = self.invoice_data
        s = ParagraphStyle('N', parent=self.styles['Normal'], fontSize=8)
        b = ParagraphStyle('B', parent=self.styles['Normal'], fontSize=8, fontName='Helvetica-Bold')
        
        subtotal = data.get('subtotal', 0)
        tax = data.get('taxAmount', 0)
        cgst = subtotal * 0.09
        sgst = subtotal * 0.09
        
        bank = [
            [Paragraph("<b>Bank Details</b>", b)],
            [Paragraph("Bank: A U SMALL FINANCE BANK", s)],
            [Paragraph("A/C No.: 2221244240401510", s)],
            [Paragraph("IFSC: AUBL0002442", s)],
            [Paragraph("Branch: Yamuna Vihar", s)],
        ]
        
        tax_summary = [
            [Paragraph("<b>Tax Summary</b>", b)],
            [Paragraph("Subtotal: " + self._format_currency(subtotal), s)],
            [Paragraph("CGST (9%): " + self._format_currency(cgst), s)],
            [Paragraph("SGST (9%): " + self._format_currency(sgst), s)],
            [Paragraph("IGST (18%): Rs. 0.00", s)],
            [Paragraph("<b>Total Tax: " + self._format_currency(tax) + "</b>", b)],
            [Paragraph("<b>Grand Total: " + self._format_currency(data.get('grandTotal', 0)) + "</b>", b)],
        ]
        
        t1 = Table(bank, colWidths=[7.8*cm])
        t1.setStyle(TableStyle([
            ('FONTSIZE', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('BOX', (0,0), (-1,-1), 0.5, colors.grey),
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f0f4f8')),
        ]))
        
        t2 = Table(tax_summary, colWidths=[7.8*cm])
        t2.setStyle(TableStyle([
            ('FONTSIZE', (0,0), (-1,-1), 8),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('BOX', (0,0), (-1,-1), 0.5, colors.grey),
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f0f4f8')),
            ('BACKGROUND', (0,-2), (-1,-1), colors.HexColor('#e8edf5')),
        ]))
        
        t = Table([[t1, t2]], colWidths=[8*cm, 8*cm])
        t.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
        return t
    
    def _create_amount_in_words(self):
        data = self.invoice_data
        b = ParagraphStyle('B', parent=self.styles['Normal'], fontSize=9, fontName='Helvetica-Bold')
        amount = data.get('grandTotal', 0)
        words = self._number_to_words(amount) if isinstance(amount, (int, float)) else str(amount)
        
        t = Table([
            [Paragraph("<b>Amount in Words:</b> " + words, b)]
        ], colWidths=[16.5*cm])
        t.setStyle(TableStyle([
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8f9fa')),
            ('LINEBELOW', (0,0), (-1,0), 0.5, colors.grey),
        ]))
        return t
    
    def _number_to_words(self, amount):
        if amount == 0: return "Zero Only"
        rupees = int(amount)
        rupee_words = self._convert_to_words(rupees)
        return rupee_words + " Rupees Only"
    
    def _convert_to_words(self, n):
        if n == 0: return "Zero"
        ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
                "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", 
                "Seventeen", "Eighteen", "Nineteen"]
        tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
        if n < 20: return ones[n]
        if n < 100: return tens[n // 10] + (" " + ones[n % 10] if n % 10 else "")
        if n < 1000: return ones[n // 100] + " Hundred" + (" " + self._convert_to_words(n % 100) if n % 100 else "")
        if n < 100000: return self._convert_to_words(n // 1000) + " Thousand" + (" " + self._convert_to_words(n % 1000) if n % 1000 else "")
        if n < 10000000: return self._convert_to_words(n // 100000) + " Lakh" + (" " + self._convert_to_words(n % 100000) if n % 100000 else "")
        return self._convert_to_words(n // 10000000) + " Crore" + (" " + self._convert_to_words(n % 10000000) if n % 10000000 else "")
    
    def _create_footer(self):
        s = ParagraphStyle('N', parent=self.styles['Normal'], fontSize=7)
        b = ParagraphStyle('B', parent=self.styles['Normal'], fontSize=7, fontName='Helvetica-Bold')
        c = ParagraphStyle('C', parent=self.styles['Normal'], fontSize=9, alignment=TA_CENTER)
        
        sig_path = "E:\\ATC-ERP\\backend\\static\\Signature_Clean.png"
        try:
            sig = Image(sig_path, width=4*cm, height=1.5*cm)
        except:
            sig = Paragraph("<br/><br/><br/>", c)
        
        terms = [
            [Paragraph("<b>Terms & Conditions:</b>", b)],
            [Paragraph("1. Interest @ 24% p.a. will be charged after due date", s)],
            [Paragraph("2. All disputes subject to Delhi Jurisdiction", s)],
            [Paragraph("Certified that the particulars given above are true & correct.", s)],
        ]
        
        sign = [
            [Paragraph("<b>For Allied Trading Corporation</b>", c)],
            [sig],
            [Paragraph("<b>Authorised Signatory</b>", c)],
        ]
        
        t1 = Table(terms, colWidths=[8*cm])
        t1.setStyle(TableStyle([('FONTSIZE', (0,0), (-1,-1), 7), ('VALIGN', (0,0), (-1,-1), 'TOP'), ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2), ('BOX', (0,0), (-1,-1), 0.5, colors.grey)]))
        
        t2 = Table(sign, colWidths=[8*cm])
        t2.setStyle(TableStyle([('FONTSIZE', (0,0), (-1,-1), 9), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'BOTTOM'), ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2), ('BOX', (0,0), (-1,-1), 0.5, colors.grey)]))
        
        t = Table([[t1, t2]], colWidths=[8*cm, 8*cm])
        t.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2)]))
        return t


def generate_pdf(invoice_data, file_name):
    generator = PDFGenerator(invoice_data, file_name)
    return generator.generate()

def save_pdf_to_desktop(pdf_bytes, file_name, save_path):
    import os
    if not os.path.exists(save_path):
        os.makedirs(save_path)
    file_path = os.path.join(save_path, file_name + '.pdf')
    with open(file_path, 'wb') as f:
        f.write(pdf_bytes)
    return file_path

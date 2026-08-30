from django.db import models
from django.contrib.auth.models import User

# ============================================================
# COMPANY
# ============================================================

class Company(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    gstin = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    logo = models.ImageField(upload_to='company/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# ============================================================
# CUSTOMERS
# ============================================================

class Customer(models.Model):
    DOCUMENT_TYPES = [
        ('GST', 'GST No'),
        ('PAN', 'PAN Card'),
        ('Aadhar', 'Aadhar No'),
        ('NONE', 'None'),
    ]
    
    name = models.CharField(max_length=200)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    state_code = models.CharField(max_length=10, blank=True, null=True)
    country = models.CharField(max_length=100, default='India')
    pincode = models.CharField(max_length=10, blank=True, null=True)
    contact = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    doc_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES, default='GST')
    doc_number = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# ============================================================
# SUPPLIERS
# ============================================================

class Supplier(models.Model):
    DOCUMENT_TYPES = [
        ('GST', 'GST No'),
        ('PAN', 'PAN Card'),
        ('Aadhar', 'Aadhar No'),
        ('NONE', 'None'),
    ]
    
    name = models.CharField(max_length=200)
    address = models.TextField(blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    state_code = models.CharField(max_length=10, blank=True, null=True)
    contact = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    doc_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES, default='GST')
    doc_number = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# ============================================================
# PRODUCTS / ITEMS
# ============================================================

class Product(models.Model):
    UNIT_CHOICES = [
        ('BOX', 'BOX'),
        ('KG', 'KG'),
        ('PCS', 'PCS'),
        ('LTR', 'LTR'),
        ('DOZEN', 'DOZEN'),
        ('NOS', 'NOS'),
    ]
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100, blank=True, null=True)
    hsn_code = models.CharField(max_length=20)
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='BOX')
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    purchase_price = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    selling_price = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.hsn_code})"


# ============================================================
# INVENTORY
# ============================================================

class Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='inventory')
    quantity = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    min_stock = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    max_stock = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    location = models.CharField(max_length=100, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name}: {self.quantity}"


# ============================================================
# INVOICES
# ============================================================

class Invoice(models.Model):
    TAX_TYPES = [
        ('IGST', 'IGST (Inter-State)'),
        ('CGST+SGST', 'CGST + SGST (Intra-State)'),
        ('NIL', 'NIL / Exempt'),
    ]
    
    BRAND_CHOICES = [
        ('ATC', 'ATC'),
        ('Zebaish', 'Zebaish Caterers'),
        ('Signature Spread', 'Signature Spread'),
    ]
    
    # Invoice Header
    invoice_no = models.CharField(max_length=50)
    invoice_date = models.DateField()
    book_no = models.CharField(max_length=50, blank=True, null=True)
    place_of_supply = models.CharField(max_length=100, blank=True, null=True)
    
    # Customer (Receiver)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    customer_name = models.CharField(max_length=200)
    customer_address = models.TextField(blank=True, null=True)
    customer_state = models.CharField(max_length=100, blank=True, null=True)
    customer_state_code = models.CharField(max_length=10, blank=True, null=True)
    customer_doc_type = models.CharField(max_length=20, default='GST')
    customer_doc_number = models.CharField(max_length=50, blank=True, null=True)
    customer_contact = models.CharField(max_length=20, blank=True, null=True)
    
    # Consignee
    consignee_name = models.CharField(max_length=200, blank=True, null=True)
    consignee_address = models.TextField(blank=True, null=True)
    consignee_state = models.CharField(max_length=100, blank=True, null=True)
    consignee_state_code = models.CharField(max_length=10, blank=True, null=True)
    consignee_doc_type = models.CharField(max_length=20, default='GST')
    consignee_doc_number = models.CharField(max_length=50, blank=True, null=True)
    consignee_contact = models.CharField(max_length=20, blank=True, null=True)
    
    # Transport
    transport_name = models.CharField(max_length=200, blank=True, null=True)
    transport_mode = models.CharField(max_length=50, default='By Road')
    vehicle_no = models.CharField(max_length=50, blank=True, null=True)
    gr_no = models.CharField(max_length=50, blank=True, null=True)
    gr_date = models.DateField(blank=True, null=True)
    
    # Bank
    bank_name = models.CharField(max_length=200, blank=True, null=True)
    account_number = models.CharField(max_length=50, blank=True, null=True)
    ifsc_code = models.CharField(max_length=50, blank=True, null=True)
    bank_branch = models.CharField(max_length=100, blank=True, null=True)
    
    # Tax & Totals
    tax_type = models.CharField(max_length=20, choices=TAX_TYPES, default='CGST+SGST')
    subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_cgst = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_sgst = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_igst = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    freight_charges = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    round_off = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Items (JSON)
    items_data = models.JSONField(default=list)
    
    # Brand
    brand = models.CharField(max_length=50, choices=BRAND_CHOICES, default='Zebaish')
    
    # Correction Fields (Internal Only - NOT on PDF)
    is_corrected = models.BooleanField(default=False)
    original_invoice = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='corrections')
    original_invoice_no = models.CharField(max_length=50, blank=True, null=True)
    correction_date = models.DateField(blank=True, null=True)
    correction_reason = models.TextField(blank=True, null=True)
    corrected_by = models.CharField(max_length=100, blank=True, null=True)
    correction_count = models.IntegerField(default=0)
    
    # Status
    is_sent_whatsapp = models.BooleanField(default=False)
    is_printed = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Invoice #{self.invoice_no} - {self.customer_name}"


# ============================================================
# INVOICE ITEMS (Alternative to JSON)
# ============================================================

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    item_name = models.CharField(max_length=200)
    hsn_code = models.CharField(max_length=20)
    unit = models.CharField(max_length=10)
    quantity = models.DecimalField(max_digits=15, decimal_places=2)
    rate = models.DecimalField(max_digits=15, decimal_places=2)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2)
    taxable_amount = models.DecimalField(max_digits=15, decimal_places=2)
    package = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"{self.item_name} x {self.quantity}"


# ============================================================
# PURCHASE ORDERS
# ============================================================

class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('received', 'Received'),
        ('cancelled', 'Cancelled'),
    ]
    
    po_no = models.CharField(max_length=50)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='purchase_orders')
    po_date = models.DateField()
    expected_delivery = models.DateField(blank=True, null=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"PO #{self.po_no} - {self.supplier.name}"


class PurchaseItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=200)
    hsn_code = models.CharField(max_length=20)
    unit = models.CharField(max_length=10)
    quantity = models.DecimalField(max_digits=15, decimal_places=2)
    rate = models.DecimalField(max_digits=15, decimal_places=2)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2)
    received_quantity = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    def __str__(self):
        return f"{self.product_name} x {self.quantity}"


# ============================================================
# PAYMENTS
# ============================================================

class Payment(models.Model):
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
        ('cheque', 'Cheque'),
        ('upi', 'UPI'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    reference_no = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment #{self.id} - ₹{self.amount}"


# ============================================================
# WHATSAPP QUEUE (For Offline Mode)
# ============================================================

class WhatsAppQueue(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]
    
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='whatsapp_queues')
    phone = models.CharField(max_length=20)
    file_path = models.CharField(max_length=500)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    attempts = models.IntegerField(default=0)
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Queue #{self.id} - {self.invoice.invoice_no}"


# ============================================================
# COMPANY SETTINGS
# ============================================================

class CompanySettings(models.Model):
    company = models.OneToOneField(Company, on_delete=models.CASCADE, related_name='settings')
    invoice_prefix = models.CharField(max_length=20, default='INV-')
    next_invoice_no = models.IntegerField(default=1)
    default_tax_type = models.CharField(max_length=20, default='CGST+SGST')
    default_brand = models.CharField(max_length=50, default='Zebaish')
    auto_delete_pdf_days = models.IntegerField(default=30)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings - {self.company.name}"


# ============================================================
# USER PROFILE
# ============================================================

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=50, default='user')
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

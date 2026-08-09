from django.db import models
from django.utils import timezone

# ========== Master Models ==========

class Item(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    unit = models.ForeignKey('Unit', on_delete=models.SET_NULL, null=True, blank=True)
    tax = models.ForeignKey('Tax', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Customer(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15)
    address = models.TextField(blank=True, null=True)
    gst_number = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Vendor(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15)
    address = models.TextField(blank=True, null=True)
    gst_number = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Tax(models.Model):
    TAX_TYPES = (
        ('GST', 'GST'),
        ('VAT', 'VAT'),
        ('CST', 'CST'),
    )
    name = models.CharField(max_length=100)
    rate = models.DecimalField(max_digits=5, decimal_places=2)
    type = models.CharField(max_length=10, choices=TAX_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.rate}%)"

class Unit(models.Model):
    name = models.CharField(max_length=50)
    abbreviation = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Warehouse(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# ========== Purchase Models ==========

class PurchaseOrder(models.Model):
    PO_STATUS = (
        ('Draft', 'Draft'),
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Received', 'Received'),
        ('Cancelled', 'Cancelled'),
    )
    po_number = models.CharField(max_length=50, unique=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    order_date = models.DateField()
    expected_delivery = models.DateField(blank=True, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=PO_STATUS, default='Draft')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.po_number

class GoodsReceipt(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    receipt_date = models.DateField()
    received_by = models.CharField(max_length=100)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Receipt for {self.purchase_order.po_number}"

class PurchaseInvoice(models.Model):
    INVOICE_STATUS = (
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Overdue', 'Overdue'),
        ('Cancelled', 'Cancelled'),
    )
    invoice_number = models.CharField(max_length=50, unique=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    invoice_date = models.DateField()
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=INVOICE_STATUS, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.invoice_number

# ========== Sales Models ==========

class SalesOrder(models.Model):
    SO_STATUS = (
        ('Draft', 'Draft'),
        ('Confirmed', 'Confirmed'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )
    so_number = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_date = models.DateField()
    expected_delivery = models.DateField(blank=True, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=SO_STATUS, default='Draft')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.so_number

class DeliveryChallan(models.Model):
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE)
    challan_number = models.CharField(max_length=50, unique=True)
    delivery_date = models.DateField()
    delivered_by = models.CharField(max_length=100)
    received_by = models.CharField(max_length=100)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.challan_number

class SalesInvoice(models.Model):
    INVOICE_STATUS = (
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Overdue', 'Overdue'),
        ('Cancelled', 'Cancelled'),
    )
    invoice_number = models.CharField(max_length=50, unique=True)
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE)
    invoice_date = models.DateField()
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=INVOICE_STATUS, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.invoice_number

# ========== Payment & Stock Models ==========

class Payment(models.Model):
    PAYMENT_METHODS = (
        ('Cash', 'Cash'),
        ('Bank Transfer', 'Bank Transfer'),
        ('Cheque', 'Cheque'),
        ('Credit Card', 'Credit Card'),
        ('UPI', 'UPI'),
    )
    PAYMENT_TYPE = (
        ('Received', 'Received'),
        ('Paid', 'Paid'),
    )
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    type = models.CharField(max_length=10, choices=PAYMENT_TYPE)
    reference_number = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment #{self.id}"

class StockTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('In', 'Stock In'),
        ('Out', 'Stock Out'),
        ('Transfer', 'Transfer'),
        ('Adjustment', 'Adjustment'),
    )
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    reference = models.CharField(max_length=100, blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.item.name}"

# ========== Inquiry Model ==========
class Inquiry(models.Model):
    RELIGION_CHOICES = [
        ('M', 'Muslim'),
        ('NM', 'Non-Muslim'),
    ]
    GENDER_CHOICES = [
        ('Mr.', 'Mr.'),
        ('Ms.', 'Ms.'),
    ]
    TYPE_CHOICES = [
        ('IICC', 'IICC Customer'),
        ('NonIICC', 'Non-IICC Customer'),
    ]
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Contacted', 'Contacted'),
        ('Estimate Sent', 'Estimate Sent'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    # Agent fields
    agent_name = models.CharField(max_length=100, blank=True, null=True)
    
    # Customer fields
    religion = models.CharField(max_length=2, choices=RELIGION_CHOICES, blank=True, null=True)
    gender = models.CharField(max_length=4, choices=GENDER_CHOICES, blank=True, null=True)
    customer_name = models.CharField(max_length=200, blank=True, null=True)
    customer_phone = models.CharField(max_length=15)
    customer_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='IICC')
    
    # Greeting
    greeting_used = models.TextField(blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Inquiry #{self.id} - {self.customer_name or 'Unknown'}"

    class Meta:
        ordering = ['-created_at']

# ========== Menu Submission Model ==========
class MenuSubmission(models.Model):
    # Customer Info
    customer_name = models.CharField(max_length=200, blank=True, null=True)
    customer_phone = models.CharField(max_length=15)
    
    # Event Details
    gathering_type = models.CharField(max_length=50, blank=True, null=True)
    venue = models.CharField(max_length=500, blank=True, null=True)
    pax = models.IntegerField(blank=True, null=True)
    event_time = models.CharField(max_length=50, blank=True, null=True)
    pre_wedding = models.CharField(max_length=10, blank=True, null=True)
    pre_wedding_type = models.CharField(max_length=100, blank=True, null=True)
    pre_wedding_venue = models.CharField(max_length=500, blank=True, null=True)
    event_date = models.DateField(blank=True, null=True)
    
    # Menu Selections (stored as JSON)
    menu_selections = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Menu #{self.id} - {self.customer_name or 'Unknown'}"
    
    class Meta:
        ordering = ['-created_at']

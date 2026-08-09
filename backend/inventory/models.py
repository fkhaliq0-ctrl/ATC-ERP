from django.db import models
from django.utils import timezone

class Item(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=5)
    tax = models.ForeignKey('Tax', on_delete=models.SET_NULL, null=True)
    unit = models.ForeignKey('Unit', on_delete=models.SET_NULL, null=True)
    warehouse = models.ForeignKey('Warehouse', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Customer(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=15)
    address = models.TextField(blank=True)
    gst_number = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Vendor(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=15)
    address = models.TextField(blank=True)
    gst_number = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Tax(models.Model):
    name = models.CharField(max_length=100)
    rate = models.DecimalField(max_digits=5, decimal_places=2)
    type = models.CharField(max_length=20, choices=[('CGST', 'CGST'), ('SGST', 'SGST'), ('IGST', 'IGST')])
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

class PurchaseOrder(models.Model):
    po_number = models.CharField(max_length=50, unique=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    order_date = models.DateField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=[('Draft', 'Draft'), ('Ordered', 'Ordered'), ('Received', 'Received'), ('Cancelled', 'Cancelled')], default='Draft')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.po_number

class PurchaseInvoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    invoice_date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Paid', 'Paid')], default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number

class SalesOrder(models.Model):
    so_number = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_date = models.DateField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=[('Draft', 'Draft'), ('Confirmed', 'Confirmed'), ('Shipped', 'Shipped'), ('Delivered', 'Delivered'), ('Cancelled', 'Cancelled')], default='Draft')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.so_number

class SalesInvoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    sales_order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE)
    invoice_date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Paid', 'Paid')], default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number

class Payment(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    method = models.CharField(max_length=20, choices=[('Cash', 'Cash'), ('Bank Transfer', 'Bank Transfer'), ('Cheque', 'Cheque'), ('UPI', 'UPI')])
    reference = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id}"

class StockTransaction(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    transaction_type = models.CharField(max_length=20, choices=[('IN', 'Stock In'), ('OUT', 'Stock Out')])
    date = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.item.name}"
from django.db import models
from .models import PurchaseOrder

class GoodsReceipt(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    receipt_date = models.DateField(auto_now_add=True)
    received_by = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"GR-{self.id} - {self.purchase_order.po_number}"

# ========== Inquiry Model ==========
class Inquiry(models.Model):
    TYPE_CHOICES = [
        ('IICC', 'IICC Customer'),
        ('NonIICC', 'Non-IICC Customer'),
    ]
    
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Contacted', 'Contacted'),
        ('FollowUp', 'Follow Up'),
        ('Converted', 'Converted'),
        ('Lost', 'Lost'),
    ]
    
    RELIGION_CHOICES = [
        ('M', 'Muslim'),
        ('NM', 'Non-Muslim'),
    ]
    
    GENDER_CHOICES = [
        ('Mr.', 'Mr.'),
        ('Ms.', 'Ms.'),
    ]
    
    # Customer Information
    gender = models.CharField(max_length=5, choices=GENDER_CHOICES, blank=True, null=True)
    customer_name = models.CharField(max_length=200, blank=True, null=True)
    customer_phone = models.CharField(max_length=15)
    customer_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='IICC')
    religion = models.CharField(max_length=2, choices=RELIGION_CHOICES, default='M')
    
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

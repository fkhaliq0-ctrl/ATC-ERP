from django.contrib import admin
from .models import (
    Item, Customer, Vendor, Tax, Unit, Warehouse,
    PurchaseOrder, PurchaseInvoice, SalesOrder, SalesInvoice,
    Payment, StockTransaction, GoodsReceipt, Inquiry, MenuSubmission
)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'price', 'stock_quantity')
    search_fields = ('name', 'sku')

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone')
    search_fields = ('name', 'email')

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone')
    search_fields = ('name', 'email')

@admin.register(Tax)
class TaxAdmin(admin.ModelAdmin):
    list_display = ('name', 'rate', 'type')

@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('name', 'abbreviation')

@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'location')

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ('po_number', 'vendor', 'order_date', 'total_amount', 'status')

@admin.register(PurchaseInvoice)
class PurchaseInvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'purchase_order', 'invoice_date', 'amount', 'status')

@admin.register(SalesOrder)
class SalesOrderAdmin(admin.ModelAdmin):
    list_display = ('so_number', 'customer', 'order_date', 'total_amount', 'status')

@admin.register(SalesInvoice)
class SalesInvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'sales_order', 'invoice_date', 'amount', 'status')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'vendor', 'amount', 'payment_date', 'method')

@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):
    list_display = ('item', 'quantity', 'transaction_type', 'date')

@admin.register(GoodsReceipt)
class GoodsReceiptAdmin(admin.ModelAdmin):
    list_display = ('id', 'purchase_order', 'receipt_date', 'received_by')

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'customer_phone', 'customer_type', 'religion', 'status', 'created_at')
    list_filter = ('customer_type', 'religion', 'status')
    search_fields = ('customer_name', 'customer_phone', 'greeting_used')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(MenuSubmission)
class MenuSubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'customer_phone', 'event_date', 'created_at')
    list_filter = ('gathering_type', 'pre_wedding')
    search_fields = ('customer_name', 'customer_phone')
    readonly_fields = ('created_at', 'updated_at')
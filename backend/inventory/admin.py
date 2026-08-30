from django.contrib import admin
from .models import (
    Company, Customer, Supplier, Product, Inventory, 
    Invoice, InvoiceItem, PurchaseOrder, PurchaseItem,
    Payment, WhatsAppQueue, CompanySettings, UserProfile
)

# Simple registration - all models with basic display
# This avoids the Python 3.14 compatibility issue

class BaseAdmin(admin.ModelAdmin):
    # Empty base class to avoid errors
    pass

# Register all models
admin.site.register(Company, BaseAdmin)
admin.site.register(Customer, BaseAdmin)
admin.site.register(Supplier, BaseAdmin)
admin.site.register(Product, BaseAdmin)
admin.site.register(Inventory, BaseAdmin)
admin.site.register(Invoice, BaseAdmin)
admin.site.register(InvoiceItem, BaseAdmin)
admin.site.register(PurchaseOrder, BaseAdmin)
admin.site.register(PurchaseItem, BaseAdmin)
admin.site.register(Payment, BaseAdmin)
admin.site.register(WhatsAppQueue, BaseAdmin)
admin.site.register(CompanySettings, BaseAdmin)
admin.site.register(UserProfile, BaseAdmin)

# Custom admin for Invoice with only safe fields
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_no', 'customer_name', 'total_amount']
    search_fields = ['invoice_no', 'customer_name']
    readonly_fields = ['created_at']

# Re-register Invoice with custom admin
admin.site.unregister(Invoice)
admin.site.register(Invoice, InvoiceAdmin)

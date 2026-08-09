from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api
from .api_inquiry import create_inquiry
from .api_menu import create_menu_submission
from .api_dashboard import get_inquiries, get_menu_submissions, get_dashboard_stats

router = DefaultRouter()
router.register(r'customers', api.CustomerViewSet)
router.register(r'vendors', api.VendorViewSet)
router.register(r'items', api.ItemViewSet)
router.register(r'taxes', api.TaxViewSet)
router.register(r'units', api.UnitViewSet)
router.register(r'warehouses', api.WarehouseViewSet)
router.register(r'purchase-orders', api.PurchaseOrderViewSet)
router.register(r'purchase-invoices', api.PurchaseInvoiceViewSet)
router.register(r'sales-orders', api.SalesOrderViewSet)
router.register(r'sales-invoices', api.SalesInvoiceViewSet)
router.register(r'payments', api.PaymentViewSet)
router.register(r'stock-transactions', api.StockTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('create-inquiry/', create_inquiry, name='create-inquiry'),
    path('create-menu-submission/', create_menu_submission, name='create-menu-submission'),
    path('inquiries/', get_inquiries, name='get-inquiries'),
    path('menu-submissions/', get_menu_submissions, name='get-menu-submissions'),
    path('dashboard-stats/', get_dashboard_stats, name='dashboard-stats'),
]
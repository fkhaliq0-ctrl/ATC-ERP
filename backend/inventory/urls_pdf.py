from django.urls import path
from .views_pdf import generate_pdf_api, customer_ledger_api

urlpatterns = [
    path('generate-pdf/', generate_pdf_api, name='generate_pdf'),
    path('customer-ledger/<int:customer_id>/', customer_ledger_api, name='customer_ledger'),
]

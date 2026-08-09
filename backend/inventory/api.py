from rest_framework import serializers, viewsets
from .models import (
    Customer, Vendor, Item, Tax, Unit, Warehouse,
    PurchaseOrder, PurchaseInvoice, SalesOrder, SalesInvoice,
    Payment, StockTransaction
)

# Serializers
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class TaxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tax
        fields = '__all__'

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'

class PurchaseOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = '__all__'

class PurchaseInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseInvoice
        fields = '__all__'

class SalesOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesOrder
        fields = '__all__'

class SalesInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesInvoice
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class StockTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockTransaction
        fields = '__all__'

# ViewSets
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class TaxViewSet(viewsets.ModelViewSet):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer

class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer

class PurchaseInvoiceViewSet(viewsets.ModelViewSet):
    queryset = PurchaseInvoice.objects.all()
    serializer_class = PurchaseInvoiceSerializer

class SalesOrderViewSet(viewsets.ModelViewSet):
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

class SalesInvoiceViewSet(viewsets.ModelViewSet):
    queryset = SalesInvoice.objects.all()
    serializer_class = SalesInvoiceSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class StockTransactionViewSet(viewsets.ModelViewSet):
    queryset = StockTransaction.objects.all()
    serializer_class = StockTransactionSerializer
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

    religion = models.CharField(max_length=2, choices=RELIGION_CHOICES, blank=True, null=True)
    gender = models.CharField(max_length=4, choices=GENDER_CHOICES, blank=True, null=True)
    customer_name = models.CharField(max_length=200, blank=True, null=True)
    customer_phone = models.CharField(max_length=15)
    customer_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='IICC')
    greeting_used = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default='New')
const payload = {
    religion: formData.religion,  // Should be 'M' or 'NM'
    gender: formData.gender,      // Should be 'Mr.' or 'Ms.'
    customer_name: formData.customerName,
    customer_phone: formData.customerPhone,
    customer_type: formData.customerType,  // Should be 'IICC' or 'NonIICC'
    greeting_used: greeting,
    status: 'New'
};
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Button, IconButton, TextField } from '@mui/material';
import { MdClose } from 'react-icons/md';

const APK_URL = 'https://drive.google.com/uc?export=download&id=170Li-HJrKrlPxSBGJW2KVE_8uFyLCmAJ';

const SendAPKModal = ({ open, onClose }) => {
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const handleSend = () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setSending(true);
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneWithCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const message = `Download Zebaish Connect APK:\n${APK_URL}`;

    window.location.href = `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`;
    setSending(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth={false}
      PaperProps={{
        sx: {
          bgcolor: '#1a1a2e',
          color: '#fff',
          borderRadius: '12px',
          border: '1px solid #333',
          maxWidth: '360px',
          width: '90%',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f5c842', fontSize: '1rem' }}>
          Send APK to Partner
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#888' }}>
          <MdClose size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0, px: 2.5, pb: 2.5 }}>
        <Typography sx={{ color: '#aaa', fontSize: '0.8rem', mb: 2 }}>
          Enter the partner's number to send the APK download link via WhatsApp.
        </Typography>

        <Box sx={{ mb: 2.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            inputProps={{
              maxLength: 10,
              style: {
                color: '#fff',
                fontSize: '0.9rem',
                padding: '10px 12px',
              },
            }}
            InputProps={{
              startAdornment: (
                <Typography sx={{ color: '#f5c842', fontWeight: 'bold', mr: 0.5, fontSize: '0.9rem' }}>+91</Typography>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#0d1117',
                borderRadius: '8px',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#555' },
                '&.Mui-focused fieldset': { borderColor: '#f5c842' },
              },
              '& .MuiInputBase-input::placeholder': { color: '#555' },
            }}
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSend}
          disabled={sending || !phone || phone.length < 10}
          sx={{
            bgcolor: '#25D366',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            py: 1.2,
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': { bgcolor: '#1ebe5d' },
            '&:disabled': { bgcolor: '#333', color: '#666' },
          }}
        >
          {sending ? 'Sending...' : '📤 Send via WhatsApp'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SendAPKModal;

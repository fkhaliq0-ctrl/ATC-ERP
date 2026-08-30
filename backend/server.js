const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const QRCode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

let sock = null;
let isReady = false;

// ============================================================
// CONNECT TO WHATSAPP
// ============================================================

async function connectToWhatsApp() {
    const authFolder = path.join(__dirname, 'auth_info');
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    sock = makeWASocket({
        printQRInTerminal: false,
        auth: state,
        browser: ['ATC ERP', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('\n📱 SCAN THIS QR CODE WITH YOUR WHATSAPP:');
            QRCode.generate(qr, { small: true });
            console.log('\n⏳ Waiting for WhatsApp connection...');
        }

        if (connection === 'open') {
            isReady = true;
            console.log('\n✅ WhatsApp Connected Successfully!');
            console.log('📱 Ready to send messages!');
        }

        if (connection === 'close') {
            isReady = false;
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(`⚠️ Connection closed. Reconnecting: ${shouldReconnect}`);
            if (shouldReconnect) {
                setTimeout(connectToWhatsApp, 5000);
            }
        }
    });

    return sock;
}

// ============================================================
// SEND WHATSAPP MESSAGE
// ============================================================

async function sendWhatsAppMessage(phone, message, filePath) {
    if (!isReady || !sock) {
        return { success: false, error: 'WhatsApp not connected' };
    }

    try {
        // Clean phone number
        let number = phone.replace(/\D/g, '');
        if (number.length === 10) number = '91' + number;
        if (!number.endsWith('@s.whatsapp.net')) {
            number = number + '@s.whatsapp.net';
        }

        console.log(`📤 Sending to: ${number}`);

        // Check if file exists
        let fileBuffer = null;
        let fileName = null;

        if (filePath && fs.existsSync(filePath)) {
            fileBuffer = fs.readFileSync(filePath);
            fileName = path.basename(filePath);
            console.log(`📎 Attaching file: ${fileName}`);
        }

        // Send message
        if (fileBuffer) {
            await sock.sendMessage(number, {
                document: fileBuffer,
                mimetype: 'application/pdf',
                fileName: fileName,
                caption: message
            });
            console.log(`✅ Sent message with PDF to ${phone}`);
        } else {
            await sock.sendMessage(number, {
                text: message
            });
            console.log(`✅ Sent text message to ${phone}`);
        }

        return { success: true };

    } catch (error) {
        console.error(`❌ Error sending: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// ============================================================
// API ENDPOINTS
// ============================================================

// Health check
app.get('/api/status', (req, res) => {
    res.json({
        connected: isReady,
        status: isReady ? '✅ Connected' : '❌ Disconnected'
    });
});

// Send WhatsApp message
app.post('/api/send', async (req, res) => {
    const { phone, message, filePath } = req.body;

    if (!phone || !message) {
        return res.status(400).json({
            success: false,
            error: 'Phone and message are required'
        });
    }

    if (!isReady) {
        return res.status(503).json({
            success: false,
            error: 'WhatsApp not connected. Please scan QR code.'
        });
    }

    const result = await sendWhatsAppMessage(phone, message, filePath);
    res.json(result);
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Baileys Server running on http://localhost:${PORT}`);
    console.log(`📱 Status: http://localhost:${PORT}/api/status`);
    console.log('\n🔄 Connecting to WhatsApp...\n');
});

// Connect to WhatsApp on startup
connectToWhatsApp();

// ============================================================
// HANDLE SHUTDOWN
// ============================================================

process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    if (sock) {
        await sock.end();
    }
    process.exit(0);
});
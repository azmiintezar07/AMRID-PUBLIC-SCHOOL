/**
 * notification-service.js
 * Official WhatsApp Business API & SMS Notification Service
 * For AMRID PUBLIC SCHOOL
 * 
 * Supports:
 * - Meta WhatsApp Cloud API (Official WhatsApp Business API)
 * - Twilio (WhatsApp & SMS)
 * - SMS Gateways (Fast2SMS, MSG91, or Custom REST Webhook)
 * 
 * All API keys, tokens, and recipient numbers are read from environment variables.
 * Designed to fail safely without blocking database persistence.
 */

// Helper to format date & time nicely (IST)
function formatTimestamp(isoDate) {
  try {
    const d = isoDate ? new Date(isoDate) : new Date();
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch {
    return new Date().toISOString();
  }
}

// Format message text for notifications
export function buildEnquiryNotificationText(enquiry) {
  const timeFormatted = formatTimestamp(enquiry.date);
  const emailLine = enquiry.email ? `\n• Email: ${enquiry.email}` : '';
  const messageLine = enquiry.message ? `\n• Message: ${enquiry.message}` : '';

  return `🏫 *AMRID PUBLIC SCHOOL - New Admission Enquiry*

A new admission enquiry has been submitted on the school website:

• Student Name: ${enquiry.student_name}
• Parent/Guardian: ${enquiry.parent_name}
• Mobile: ${enquiry.phone}
• Class Applied: ${enquiry.class_apply.toUpperCase().replace('CLASS-', 'Class ')}${emailLine}${messageLine}
• Date & Time: ${timeFormatted}

Please follow up promptly with the parent.`;
}

export function buildContactNotificationText(contact) {
  const timeFormatted = formatTimestamp(contact.date);
  const emailLine = contact.email ? `\n• Email: ${contact.email}` : '';
  const phoneLine = contact.phone ? `\n• Phone: ${contact.phone}` : '';

  return `🏫 *AMRID PUBLIC SCHOOL - New Contact Message*

A new message has been received from the website contact form:

• Sender: ${contact.name}${emailLine}${phoneLine}
• Subject: ${contact.subject || 'General Inquiry'}
• Message: ${contact.message}
• Date & Time: ${timeFormatted}`;
}

// Clean phone number to E.164 format for India
function cleanPhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

/**
 * Send WhatsApp message via official Meta WhatsApp Cloud API
 */
async function sendMetaWhatsApp(recipientPhone, messageText) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return { success: false, status: 'skipped_no_config', message: 'Meta WhatsApp API credentials not configured in environment variables' };
  }

  const cleanedPhone = cleanPhoneNumber(recipientPhone);
  if (!cleanedPhone) {
    return { success: false, status: 'invalid_recipient', message: 'No valid phone number provided' };
  }

  const endpoint = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanedPhone,
    type: 'text',
    text: {
      preview_url: false,
      body: messageText
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Meta API error: ${data?.error?.message || response.statusText}`);
  }

  return { success: true, status: 'sent', messageId: data?.messages?.[0]?.id };
}

/**
 * Send WhatsApp / SMS via Twilio
 */
async function sendTwilioMessage(recipientPhone, messageText, isWhatsApp = false) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const rawPhone = process.env.TWILIO_PHONE_NUMBER;
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM || (rawPhone ? (rawPhone.startsWith('whatsapp:') ? rawPhone : `whatsapp:${rawPhone}`) : null);
  const fromSms = process.env.TWILIO_SMS_FROM || rawPhone;

  if (!accountSid || !authToken) {
    return { success: false, status: 'skipped_no_config', message: 'Twilio credentials not configured' };
  }

  const cleanedPhone = cleanPhoneNumber(recipientPhone);
  const to = isWhatsApp ? `whatsapp:+${cleanedPhone}` : `+${cleanedPhone}`;
  const from = isWhatsApp ? fromWhatsApp : fromSms;

  if (!from) {
    return { success: false, status: 'skipped_no_config', message: `Twilio ${isWhatsApp ? 'WhatsApp' : 'SMS'} sender number (TWILIO_PHONE_NUMBER) not configured` };
  }

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams({
    To: to,
    From: from,
    Body: messageText
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Twilio error: ${data?.message || response.statusText}`);
  }

  return { success: true, status: 'sent', messageId: data?.sid };
}

/**
 * Send SMS via Indian SMS Gateway (Fast2SMS / MSG91 / Custom REST SMS API)
 */
async function sendIndianSmsGateway(recipientPhone, messageText) {
  const apiKey = process.env.SMS_API_KEY;
  const apiUrl = process.env.SMS_API_URL; // Optional custom URL
  const senderId = process.env.SMS_SENDER_ID || 'AMRID';

  if (!apiKey && !apiUrl) {
    return { success: false, status: 'skipped_no_config', message: 'SMS Gateway credentials not configured' };
  }

  const rawPhone = String(recipientPhone).replace(/[^0-9]/g, '');
  const tenDigitPhone = rawPhone.length > 10 ? rawPhone.slice(-10) : rawPhone;

  // 1. Fast2SMS default if no custom URL
  if (apiKey && (!apiUrl || apiUrl.includes('fast2sms'))) {
    const endpoint = 'https://www.fast2sms.com/dev/bulkV2';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'q',
        message: messageText,
        language: 'english',
        flash: 0,
        numbers: tenDigitPhone
      })
    });
    const resData = await response.json();
    if (!response.ok || resData.return === false) {
      throw new Error(`Fast2SMS error: ${resData?.message?.[0] || 'Failed to send'}`);
    }
    return { success: true, status: 'sent', messageId: resData?.request_id };
  }

  // 2. Custom webhook / API provider
  if (apiUrl) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify({
        to: tenDigitPhone,
        message: messageText,
        sender: senderId
      })
    });
    if (!response.ok) {
      throw new Error(`Custom SMS API responded with HTTP ${response.status}`);
    }
    return { success: true, status: 'sent' };
  }

  return { success: false, status: 'skipped_no_config', message: 'No SMS provider configured' };
}

/**
 * Dispatches notification to both Director and Principal
 * Called asynchronously after an enquiry is saved to the database.
 */
export async function dispatchEnquiryNotifications(enquiry, defaultContacts = {}) {
  // Director and Principal numbers from environment or fallbacks
  const directorPhone = process.env.DIRECTOR_PHONE || defaultContacts.directorPhone || '8434149789';
  const principalPhone = process.env.PRINCIPAL_PHONE || defaultContacts.principalPhone || '9693264161';

  const messageText = buildEnquiryNotificationText(enquiry);
  const now = new Date().toISOString();

  const report = {
    timestamp: now,
    whatsapp: {
      director: { status: 'pending', target: directorPhone },
      principal: { status: 'pending', target: principalPhone }
    },
    sms: {
      director: { status: 'pending', target: directorPhone },
      principal: { status: 'pending', target: principalPhone }
    }
  };

  // Helper to send WhatsApp
  const sendWhatsApp = async (phone) => {
    // Try Meta Cloud API first
    if (process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      return await sendMetaWhatsApp(phone, messageText);
    }
    // Then try Twilio WhatsApp
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_WHATSAPP_FROM) {
      return await sendTwilioMessage(phone, messageText, true);
    }
    return { success: false, status: 'skipped_no_config', message: 'No WhatsApp API credentials configured in environment variables' };
  };

  // Helper to send SMS
  const sendSms = async (phone) => {
    // Try Fast2SMS / Indian Gateway
    if (process.env.SMS_API_KEY || process.env.SMS_API_URL) {
      return await sendIndianSmsGateway(phone, messageText);
    }
    // Then try Twilio SMS
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_SMS_FROM) {
      return await sendTwilioMessage(phone, messageText, false);
    }
    return { success: false, status: 'skipped_no_config', message: 'No SMS API credentials configured in environment variables' };
  };

  // 1. WhatsApp Director
  try {
    const res = await sendWhatsApp(directorPhone);
    report.whatsapp.director = { ...res, timestamp: new Date().toISOString() };
  } catch (err) {
    console.error('[NOTIFY] WhatsApp to Director failed:', err.message);
    report.whatsapp.director = { success: false, status: 'failed', error: err.message, timestamp: new Date().toISOString() };
  }

  // 2. WhatsApp Principal
  try {
    const res = await sendWhatsApp(principalPhone);
    report.whatsapp.principal = { ...res, timestamp: new Date().toISOString() };
  } catch (err) {
    console.error('[NOTIFY] WhatsApp to Principal failed:', err.message);
    report.whatsapp.principal = { success: false, status: 'failed', error: err.message, timestamp: new Date().toISOString() };
  }

  // 3. SMS Director
  try {
    const res = await sendSms(directorPhone);
    report.sms.director = { ...res, timestamp: new Date().toISOString() };
  } catch (err) {
    console.error('[NOTIFY] SMS to Director failed:', err.message);
    report.sms.director = { success: false, status: 'failed', error: err.message, timestamp: new Date().toISOString() };
  }

  // 4. SMS Principal
  try {
    const res = await sendSms(principalPhone);
    report.sms.principal = { ...res, timestamp: new Date().toISOString() };
  } catch (err) {
    console.error('[NOTIFY] SMS to Principal failed:', err.message);
    report.sms.principal = { success: false, status: 'failed', error: err.message, timestamp: new Date().toISOString() };
  }

  console.log(`[NOTIFY] Enquiry notification summary for ${enquiry.id}:`, JSON.stringify(report, null, 2));
  return report;
}

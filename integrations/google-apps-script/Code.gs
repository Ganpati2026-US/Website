const COMPANY_NAME = 'Appetiser India';
const COMPANY_EMAIL = 'appetiserindia@gmail.com';
const ALLOWED_INTERESTS = [
  'Building a new product',
  'Improving an existing product',
  'BitByte Restro',
  'Product strategy',
  'Other',
];

function doGet() {
  return jsonResponse({ status: 'ok', service: 'Appetiser India enquiries' });
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    if (payload.website) return jsonResponse({ error: 'Unable to submit this enquiry.' });

    const enquiry = validateEnquiry(payload);
    const cache = CacheService.getScriptCache();
    const duplicateKey = `request:${enquiry.request_id}`;
    const existingReference = cache.get(duplicateKey);
    if (existingReference) {
      return jsonResponse({ id: existingReference, message: 'Your enquiry has been received.' });
    }

    const rateKey = `email:${digest(enquiry.work_email)}`;
    const submissionCount = Number(cache.get(rateKey) || 0);
    if (submissionCount >= 5) throw new Error('You’ve sent a few enquiries recently. Please try again in an hour.');

    const reference = Utilities.getUuid();
    sendCompanyNotification(enquiry, reference);
    sendVisitorAcknowledgement(enquiry, reference);
    cache.put(duplicateKey, reference, 21600);
    cache.put(rateKey, String(submissionCount + 1), 3600);

    return jsonResponse({ id: reference, message: 'Your enquiry has been received.' });
  } catch (error) {
    return jsonResponse({ error: error.message || 'We couldn’t send your enquiry right now.' });
  }
}

function validateEnquiry(payload) {
  const enquiry = {
    request_id: String(payload.request_id || '').trim(),
    name: String(payload.name || '').trim(),
    work_email: String(payload.work_email || '').trim().toLowerCase(),
    company: String(payload.company || '').trim(),
    interest: String(payload.interest || '').trim(),
    idea: String(payload.idea || '').trim(),
    budget: String(payload.budget || '').trim(),
    timeline: String(payload.timeline || '').trim(),
    consent: payload.consent === true,
  };

  if (!enquiry.request_id || enquiry.request_id.length > 80) throw new Error('Invalid request reference.');
  if (enquiry.name.length < 2 || enquiry.name.length > 100) throw new Error('Please enter your name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.work_email)) throw new Error('Please enter a valid email address.');
  if (!ALLOWED_INTERESTS.includes(enquiry.interest)) throw new Error('Please select a valid interest.');
  if (enquiry.idea.length < 20 || enquiry.idea.length > 5000) throw new Error('Please tell us a little more about your idea.');
  if (!enquiry.consent) throw new Error('Please agree so we can respond to your enquiry.');
  return enquiry;
}

function sendCompanyNotification(enquiry, reference) {
  const shortReference = reference.slice(0, 8).toUpperCase();
  const company = enquiry.company || 'Not provided';
  const rows = [
    ['Reference', shortReference],
    ['Name', enquiry.name],
    ['Email', enquiry.work_email],
    ['Company', company],
    ['Interest', enquiry.interest],
    ['Budget', enquiry.budget],
    ['Timeline', enquiry.timeline],
  ];
  const text = rows.map(row => `${row[0]}: ${row[1]}`).join('\n') + `\n\nIdea:\n${enquiry.idea}`;
  const tableRows = rows.map(row => `<tr><td style="padding:8px 14px;color:#777">${escapeHtml(row[0])}</td><td style="padding:8px 14px;color:#171717">${escapeHtml(row[1])}</td></tr>`).join('');
  const html = emailFrame(
    'A new conversation has started.',
    `<p style="margin:0 0 20px;color:#555;line-height:1.7">A new website enquiry is ready for your reply.</p><table style="width:100%;border-collapse:collapse;background:#f7f6f2;border-radius:12px">${tableRows}</table><h3 style="margin:28px 0 10px">The idea</h3><p style="white-space:pre-wrap;color:#444;line-height:1.7">${escapeHtml(enquiry.idea)}</p><p style="margin-top:28px;color:#777;font-size:13px">Reply directly to this email to contact ${escapeHtml(enquiry.name)}.</p>`,
  );

  MailApp.sendEmail({
    to: COMPANY_EMAIL,
    replyTo: enquiry.work_email,
    name: COMPANY_NAME,
    subject: `New enquiry — ${enquiry.name} — ${shortReference}`,
    body: text,
    htmlBody: html,
  });
}

function sendVisitorAcknowledgement(enquiry, reference) {
  const firstName = enquiry.name.split(/\s+/)[0];
  const shortReference = reference.slice(0, 8).toUpperCase();
  const text = `Hi ${firstName},\n\nThank you for starting a conversation with Appetiser India. We’ve received your enquiry about ${enquiry.interest.toLowerCase()}.\n\nReference: ${shortReference}\n\nWe’ll review what you shared and reply personally from ${COMPANY_EMAIL}.\n\nAppetiser India\nIdeas deserve exceptional products.`;
  const html = emailFrame(
    `Thanks, ${escapeHtml(firstName)}. Your idea is in good hands.`,
    `<p style="margin:0;color:#555;line-height:1.75">We’ve received your enquiry about <strong style="color:#171717">${escapeHtml(enquiry.interest.toLowerCase())}</strong>. We’ll review what you shared and reply personally.</p><div style="margin:28px 0;padding:18px 20px;border:1px solid #e7e4dc;border-radius:12px"><span style="display:block;color:#888;font-size:11px;letter-spacing:1.4px;text-transform:uppercase">Your reference</span><strong style="display:block;margin-top:7px;font-size:18px;letter-spacing:1px">${shortReference}</strong></div><p style="margin:0;color:#777;font-size:13px;line-height:1.7">You can reply to this email if there’s anything else you’d like us to know.</p>`,
  );

  MailApp.sendEmail({
    to: enquiry.work_email,
    replyTo: COMPANY_EMAIL,
    name: COMPANY_NAME,
    subject: `We’ve received your enquiry — ${shortReference}`,
    body: text,
    htmlBody: html,
  });
}

function emailFrame(title, content) {
  return `<div style="margin:0;padding:32px 16px;background:#f2f0eb;font-family:Arial,sans-serif;color:#171717"><div style="max-width:620px;margin:auto;background:#fff;border-radius:18px;overflow:hidden"><div style="padding:28px 34px;background:#090b0b;color:#fff"><div style="font-size:22px;font-weight:700">Appetiser <span style="display:block;margin-top:5px;font-size:8px;letter-spacing:4px;font-weight:400">INDIA</span></div></div><div style="padding:38px 34px"><h1 style="margin:0 0 22px;font-size:28px;line-height:1.25">${title}</h1>${content}</div><div style="padding:20px 34px;border-top:1px solid #eee;color:#888;font-size:12px">From India. Built for everywhere.</div></div></div>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function digest(value) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value)).slice(0, 24);
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

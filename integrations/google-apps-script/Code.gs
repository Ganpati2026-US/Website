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
  const text = `Hi ${firstName},\n\nWe’ve got your enquiry, and your idea is now with Appetiser India.\n\nYOUR ENQUIRY\nInterest: ${enquiry.interest}\nBudget: ${enquiry.budget}\nTimeline: ${enquiry.timeline}\nReference: ${shortReference}\n\nWHAT HAPPENS NEXT\n1. We’ll read through the details you shared.\n2. A real person from our team will consider the best next step.\n3. We’ll reply personally from ${COMPANY_EMAIL}.\n\nNeed to add something? Simply reply to this email.\n\nAppetiser India\nIdeas deserve exceptional products.`;
  const replySubject = encodeURIComponent(`More details — ${shortReference}`);
  const summaryRow = (label, value) => `<tr><td style="padding:9px 0;color:#8b8d89;font-size:12px;width:34%">${label}</td><td style="padding:9px 0;color:#f4f2ed;font-size:13px;font-weight:600">${escapeHtml(value)}</td></tr>`;
  const html = `<div style="display:none;max-height:0;overflow:hidden;color:transparent">We’ve received your enquiry. Here’s what happens next.</div><div style="margin:0;padding:34px 14px;background:#efeee9;font-family:Arial,sans-serif;color:#151717"><div style="max-width:620px;margin:auto;background:#090b0b;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.12)"><div style="height:4px;background:linear-gradient(90deg,#8d72ff,#53c8ff,#edb28b)"></div><div style="padding:30px 38px 25px;border-bottom:1px solid rgba(255,255,255,.1)"><div style="font-size:23px;font-weight:700;color:#f5f3ee;letter-spacing:-.7px">Appetiser <span style="display:block;margin-top:6px;margin-left:2px;font-size:8px;letter-spacing:4px;font-weight:400;color:#d3d0c9">INDIA</span></div></div><div style="padding:42px 38px"><span style="display:inline-block;padding:7px 11px;border-radius:999px;background:rgba(141,114,255,.15);color:#c9baff;font-size:10px;letter-spacing:1.5px;text-transform:uppercase">Enquiry received</span><h1 style="margin:19px 0 15px;color:#f5f3ee;font-size:32px;line-height:1.18;letter-spacing:-1px">We’ve got it, ${escapeHtml(firstName)}.<br><span style="color:#9ea29f;font-weight:400">Your idea is in good hands.</span></h1><p style="margin:0;color:#a9adaa;font-size:15px;line-height:1.75">Thanks for starting a conversation with us. A real person will read what you shared and consider the most useful next step.</p><div style="margin:30px 0;padding:21px 23px;border:1px solid rgba(255,255,255,.11);border-radius:15px;background:#111414"><div style="margin-bottom:8px;color:#edb28b;font-size:10px;letter-spacing:1.6px;text-transform:uppercase">Your enquiry</div><table role="presentation" style="width:100%;border-collapse:collapse">${summaryRow('Interest', enquiry.interest)}${summaryRow('Budget', enquiry.budget)}${summaryRow('Timeline', enquiry.timeline)}${summaryRow('Reference', shortReference)}</table></div><div style="margin:31px 0 12px;color:#f3f1ec;font-size:17px;font-weight:700">What happens next</div><table role="presentation" style="width:100%;border-collapse:collapse"><tr><td style="vertical-align:top;padding:10px 14px 10px 0;color:#8d72ff;font-size:12px;font-weight:700">01</td><td style="padding:10px 0;color:#afb3af;font-size:14px;line-height:1.55">We review the details and understand where you’re starting.</td></tr><tr><td style="vertical-align:top;padding:10px 14px 10px 0;color:#53c8ff;font-size:12px;font-weight:700">02</td><td style="padding:10px 0;color:#afb3af;font-size:14px;line-height:1.55">We consider the best product, design, or engineering next step.</td></tr><tr><td style="vertical-align:top;padding:10px 14px 10px 0;color:#edb28b;font-size:12px;font-weight:700">03</td><td style="padding:10px 0;color:#afb3af;font-size:14px;line-height:1.55">We reply personally and continue the conversation with you.</td></tr></table><a href="mailto:${COMPANY_EMAIL}?subject=${replySubject}" style="display:inline-block;margin-top:27px;padding:14px 21px;border-radius:999px;background:#edb28b;color:#17100b;text-decoration:none;font-size:13px;font-weight:700">Add something to your brief&nbsp;&nbsp;↗</a><p style="margin:25px 0 0;color:#777d79;font-size:12px;line-height:1.65">You can also reply directly to this email. No ticket maze, no mailing list — just a conversation.</p></div><div style="padding:22px 38px;border-top:1px solid rgba(255,255,255,.09);color:#737875;font-size:11px;letter-spacing:.4px">From India. Built for everywhere.</div></div></div>`;

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

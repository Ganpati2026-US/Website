const COMPANY_NAME = 'Appetiser India';
const RECRUITMENT_EMAIL = 'recruiter@appetiserindia.com';
const WORDMARK_URL = 'https://appetiserindia.appetiserindia.workers.dev/assets/brand/appetiser-india-email-wordmark.png';

function doGet() {
  return jsonResponse({ status: 'ok', service: 'Appetiser India recruitment' });
}

function doPost(event) {
  try {
    const contents = event && event.postData && event.postData.contents;
    if (!contents || contents.length > 20000) throw new Error('Invalid submission.');
    const payload = JSON.parse(contents);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Invalid submission.');
    if (payload.website) return jsonResponse({ error: 'Unable to submit this application.' });
    const application = validateApplication(payload);
    const cache = CacheService.getScriptCache();
    const duplicateKey = `career:${application.request_id}`;
    const existingReference = cache.get(duplicateKey);
    if (existingReference) return jsonResponse({ id: existingReference, message: 'Your application has been received.' });
    const rateKey = `career-email:${digest(application.email)}`;
    const count = Number(cache.get(rateKey) || 0);
    if (count >= 5) throw new Error('You’ve submitted a few applications recently. Please try again in an hour.');
    const reference = Utilities.getUuid();
    const wordmark = fetchWordmark();
    sendRecruiterNotification(application, reference, wordmark);
    sendCandidateAcknowledgement(application, reference, wordmark);
    cache.put(duplicateKey, reference, 21600);
    cache.put(rateKey, String(count + 1), 3600);
    return jsonResponse({ id: reference, message: 'Your application has been received.' });
  } catch (error) {
    return jsonResponse({ error: error.message || 'We couldn’t submit your application right now.' });
  }
}

function validateApplication(payload) {
  const value = {
    request_id: String(payload.request_id || '').trim(), name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim().toLowerCase(), phone: String(payload.phone || '').trim(),
    location: String(payload.location || '').trim(), dob: String(payload.dob || '').trim(),
    role: String(payload.role || '').trim(), experience: String(payload.experience || '').trim(),
    portfolio_url: String(payload.portfolio_url || '').trim(), resume_url: String(payload.resume_url || '').trim(),
    message: String(payload.message || '').trim(), consent: payload.consent === true,
  };
  if (!value.request_id || value.request_id.length > 80) throw new Error('Invalid application reference.');
  if (value.name.length < 2 || value.name.length > 100) throw new Error('Please enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) throw new Error('Please enter a valid email address.');
  if (value.email.length > 254 || /[\r\n]/.test(value.name + value.role)) throw new Error('Invalid application details.');
  if (value.phone.length < 7 || value.phone.length > 40) throw new Error('Please enter a valid phone number.');
  if (value.location.length < 2 || value.location.length > 160) throw new Error('Please enter your current location.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.dob)) throw new Error('Please enter a valid date of birth.');
  if (!value.role || value.role.length > 160) throw new Error('Please select a role.');
  if (!secureUrl(value.resume_url)) throw new Error('Please provide a secure résumé link.');
  if (value.portfolio_url && !secureUrl(value.portfolio_url)) throw new Error('Please provide a secure portfolio link.');
  if (value.message.length > 2000 || value.experience.length > 160) throw new Error('Your application contains a field that is too long.');
  if (!value.consent) throw new Error('Please agree so we can review your application.');
  return value;
}

function secureUrl(value) {
  return /^https:\/\/[^\s]+$/i.test(value) && value.length <= 1000;
}

function sendRecruiterNotification(application, reference, wordmark) {
  const shortReference = reference.slice(0, 8).toUpperCase();
  const rows = [['Reference', shortReference], ['Name', application.name], ['Email', application.email], ['Phone', application.phone], ['Location', application.location], ['Date of birth', application.dob], ['Role', application.role], ['Experience', application.experience || 'Not provided']];
  const body = rows.map(row => `${row[0]}: ${row[1]}`).join('\n') + `\nResume: ${application.resume_url}\nPortfolio: ${application.portfolio_url || 'Not provided'}\n\nCandidate note:\n${application.message || 'Not provided'}`;
  const tableRows = rows.map(row => `<tr><td style="padding:8px 14px;color:#777">${escapeHtml(row[0])}</td><td style="padding:8px 14px;color:#171717">${escapeHtml(row[1])}</td></tr>`).join('');
  const links = `<p style="margin:24px 0 10px"><a href="${escapeHtml(application.resume_url)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#171717;color:#fff;text-decoration:none;font-weight:700">Open résumé</a></p>${application.portfolio_url ? `<p><a href="${escapeHtml(application.portfolio_url)}" style="color:#6945c6">View portfolio or LinkedIn</a></p>` : ''}`;
  const html = emailFrame('A new application has arrived.', `<p style="color:#555;line-height:1.7">Review the candidate details and résumé below.</p><table style="width:100%;border-collapse:collapse;background:#f7f6f2;border-radius:12px">${tableRows}</table>${links}<h3 style="margin:28px 0 10px">Candidate note</h3><p style="white-space:pre-wrap;color:#444;line-height:1.7">${escapeHtml(application.message || 'Not provided')}</p>`, Boolean(wordmark));
  sendEmail(RECRUITMENT_EMAIL, `New application — ${application.role} — ${application.name} — ${shortReference}`, body, html, wordmark);
}

function sendCandidateAcknowledgement(application, reference, wordmark) {
  const firstName = application.name.split(/\s+/)[0];
  const shortReference = reference.slice(0, 8).toUpperCase();
  const body = `Hi ${firstName},\n\nWe have received your résumé and application for ${application.role}.\n\nOur recruitment team will review your profile and get back to you if your experience fits the role. Please be prepared for the next step if you are shortlisted.\n\nApplication reference: ${shortReference}\n\nAppetiser India Recruitment`;
  const html = emailFrame(`Hi ${escapeHtml(firstName)}, we’ve received your résumé.`, `<p style="color:#555;line-height:1.8">Thank you for applying for <strong>${escapeHtml(application.role)}</strong>. Our recruitment team will review your profile and get back to you if your experience fits the role.</p><div style="margin:26px 0;padding:18px;border-radius:12px;background:#f7f6f2"><small style="color:#777">APPLICATION REFERENCE</small><div style="margin-top:8px;font-size:18px;font-weight:700">${shortReference}</div></div><p style="color:#555;line-height:1.8">Please be prepared for the next step if you are shortlisted. There is no need to submit the same application again.</p>`, Boolean(wordmark));
  sendEmail(application.email, `We’ve received your application — ${shortReference}`, body, html, wordmark);
}

function sendEmail(to, subject, body, htmlBody, wordmark) {
  const options = { name: `${COMPANY_NAME} Recruitment`, replyTo: RECRUITMENT_EMAIL, htmlBody };
  if (wordmark) options.inlineImages = { appetiserWordmark: wordmark };
  GmailApp.sendEmail(to, subject, body, options);
}

function emailFrame(title, content, hasWordmark) {
  return `<div style="margin:0;padding:32px 16px;background:#f2f0eb;font-family:Arial,sans-serif;color:#171717"><div style="max-width:620px;margin:auto;background:#fff;border-radius:18px;overflow:hidden"><div style="padding:24px 34px;text-align:center;background:#090b0b;color:#fff">${emailWordmark(hasWordmark, 180)}</div><div style="padding:38px 34px"><h1 style="margin:0 0 22px;font-size:28px;line-height:1.25">${title}</h1>${content}</div><div style="padding:20px 34px;border-top:1px solid #eee;color:#888;font-size:12px">Appetiser India Recruitment · From India. Built for everywhere.</div></div></div>`;
}

function emailWordmark(hasWordmark, width) {
  if (hasWordmark) return `<img src="cid:appetiserWordmark" width="${width}" alt="Appetiser India" style="display:block;width:${width}px;max-width:100%;height:auto;margin:0 auto;border:0">`;
  return '<div style="display:inline-block;text-align:center;color:#fff"><div style="font-size:22px;font-weight:700">Appetiser</div><div style="margin-top:6px;font-size:8px;letter-spacing:4px">INDIA</div></div>';
}

function fetchWordmark() {
  try {
    const response = UrlFetchApp.fetch(WORDMARK_URL, { followRedirects: true, muteHttpExceptions: true });
    if (response.getResponseCode() !== 200 || response.getBlob().getContentType() !== 'image/png') return null;
    return response.getBlob().setName('appetiser-india-email-wordmark.png');
  } catch (error) { return null; }
}

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }
function digest(value) { return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value)).slice(0, 24); }
function jsonResponse(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }

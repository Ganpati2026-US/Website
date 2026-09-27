import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowUpRight, Check, FileText, Link as LinkIcon, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Eyebrow } from './Primitives';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { jobs } from '../data/jobs';
import { site } from '../config/site';

const endpoint = (process.env.REACT_APP_CONTACT_ENDPOINT || site.contactEndpoint || '').trim();
const roles = ['General application', ...jobs.filter(job => job.isOpen).map(job => job.role)];

export default function RecruitmentForm() {
  const [params] = useSearchParams();
  const requestedRole = params.get('role');
  const requestId = useRef(crypto.randomUUID());
  const [form, setForm] = useState({ type: 'career', request_id: requestId.current, name: '', email: '', phone: '', location: '', dob: '', role: roles.includes(requestedRole) ? requestedRole : roles[0], experience: '', portfolio_url: '', resume_url: '', message: '', consent: false, website: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [serverError, setServerError] = useState('');
  const update = (key, value) => { setForm(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: '' })); };
  const isSecureUrl = value => { try { return new URL(value).protocol === 'https:'; } catch { return false; } };
  const submit = async event => {
    event.preventDefault(); if (busy) return;
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    if (form.phone.trim().length < 7) next.phone = 'Please enter a valid phone number.';
    if (form.location.trim().length < 2) next.location = 'Please enter your current location.';
    if (!form.dob) next.dob = 'Please enter your date of birth.';
    if (!isSecureUrl(form.resume_url.trim())) next.resume_url = 'Add a secure Google Drive or iCloud document link.';
    if (form.portfolio_url && !isSecureUrl(form.portfolio_url.trim())) next.portfolio_url = 'Please use a secure https:// link.';
    if (!form.consent) next.consent = 'Please agree so we can review your application.';
    setErrors(next);
    if (Object.keys(next).length) { document.getElementById(`career-${Object.keys(next)[0]}`)?.focus(); return; }
    setBusy(true); setServerError('');
    try {
      if (!endpoint) throw new Error('Recruitment applications are temporarily unavailable.');
      const response = await axios.post(endpoint, JSON.stringify({ ...form, request_id: requestId.current }), { headers: { 'Content-Type': 'text/plain;charset=utf-8' }, timeout: 45000 });
      const result = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      if (result.error) throw new Error(result.error);
      setReceipt(result); toast.success('Application received. Check your inbox for confirmation.');
    } catch (error) {
      const message = error.code === 'ECONNABORTED' ? 'Confirmation is taking longer than expected. Check your inbox before submitting again.' : error.message || 'We couldn’t submit your application right now.';
      setServerError(message); toast.error(message);
    } finally { setBusy(false); }
  };
  const error = key => errors[key] && <span className="field-error" id={`career-error-${key}`} role="alert">{errors[key]}</span>;
  if (receipt) return <div className="career-success" role="status"><span className="contact-success-check"><Check size={32} /></span><Eyebrow id="career-success-label">APPLICATION RECEIVED</Eyebrow><h3>Thank you, {form.name.split(/\s+/)[0]}.</h3><p>Your résumé is with our recruitment team. We’ve also sent a confirmation to {form.email}.</p><span className="receipt-id">REFERENCE / {receipt.id.slice(0, 8).toUpperCase()}</span></div>;
  return <form className="career-application" onSubmit={submit} noValidate data-testid="career-application-form">
    <div className="career-form-title"><div><Eyebrow id="career-form-label">YOUR NEXT CHAPTER</Eyebrow><h3>Introduce yourself<span className="accent-text">.</span></h3></div><FileText aria-hidden="true" /></div>
    <div className="form-header"><span>01 — ABOUT YOU</span><span>* REQUIRED</span></div>
    <div className="form-grid">
      {[['name','Full name','Alex Morgan','text','name'],['email','Email address','alex@example.com','email','email'],['phone','Phone number','+91 98765 43210','tel','tel'],['location','Current location','Nagpur, India','text','address-level2'],['dob','Date of birth','','date','bday'],['experience','Years of experience','e.g. 3 years','text','off']].map(([key,label,placeholder,type,auto]) => <div className="form-field" key={key}><label htmlFor={`career-${key}`}>{label}{key !== 'experience' && ' *'}</label><Input id={`career-${key}`} type={type} placeholder={placeholder} value={form[key]} maxLength={key === 'name' ? 100 : 160} autoComplete={auto} aria-invalid={!!errors[key]} onChange={event => update(key, event.target.value)} />{error(key)}</div>)}
    </div>
    <div className="form-field full-width"><label htmlFor="career-role">Role *</label><select id="career-role" value={form.role} onChange={event => update('role', event.target.value)}>{roles.map(role => <option key={role}>{role}</option>)}</select></div>
    <div className="form-header second-header"><span>02 — YOUR WORK</span></div>
    <div className="form-field"><label htmlFor="career-resume_url">Résumé link *</label><div className="career-link-field"><LinkIcon size={17} /><Input id="career-resume_url" type="url" inputMode="url" placeholder="https://drive.google.com/… or https://www.icloud.com/…" value={form.resume_url} maxLength={1000} onChange={event => update('resume_url', event.target.value)} /></div>{error('resume_url')}<small className="field-hint">Set the document to “Anyone with the link can view” before submitting.</small></div>
    <div className="form-field"><label htmlFor="career-portfolio_url">Portfolio or LinkedIn</label><Input id="career-portfolio_url" type="url" inputMode="url" placeholder="https://linkedin.com/in/…" value={form.portfolio_url} maxLength={1000} onChange={event => update('portfolio_url', event.target.value)} />{error('portfolio_url')}</div>
    <div className="form-field"><label htmlFor="career-message">Why would you like to join us?</label><textarea id="career-message" rows={4} maxLength={2000} placeholder="Tell us what you care about building…" value={form.message} onChange={event => update('message', event.target.value)} /></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="career-website">Leave empty</label><input id="career-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={event => update('website', event.target.value)} /></div>
    <label className="consent-label"><input id="career-consent" type="checkbox" checked={form.consent} onChange={event => update('consent', event.target.checked)} /><span>I agree to Appetiser India storing these details and reviewing my application for recruitment purposes.</span></label>{error('consent')}
    {serverError && <div className="server-error" role="alert">{serverError}<a href={`mailto:${site.careersEmail}`}>Email recruitment <ArrowUpRight size={13} /></a></div>}
    <Button className="action action-primary contact-submit" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={17} />Submitting application…</> : <>Submit application <ArrowUpRight size={18} /></>}</Button>
    <p className="form-footnote">Your information is used only to evaluate your application.</p>
  </form>;
}

import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, Clock, MapPin, Briefcase, Sparkles } from 'lucide-react';
import { SEO } from '../components/Layout';
import { Eyebrow, Reveal, Action } from '../components/Primitives';
import { jobs } from '../data/jobs';
import { careersMailto } from '../config/site';
import NotFound from './NotFound';

const Block = ({ label, title, items, icon: Icon, id }) => <Reveal className="role-block" data-testid={`role-${id}`}><span className="small-label">{label}</span><h2 data-testid={`role-${id}-heading`}>{title}</h2><ul>{items.map((item, i) => <li key={item} data-testid={`role-${id}-${i}`}><Icon size={15} />{item}</li>)}</ul></Reveal>;

export default function RoleDetail() {
  const { id } = useParams();
  const job = jobs.find(j => j.id === id && j.isOpen);
  if (!job) return <NotFound />;
  const related = jobs.filter(j => j.isOpen && j.id !== job.id && j.department === job.department);
  return <><SEO title={`${job.role} — Careers`} description={job.description} /><article className="role-page container" data-testid="role-page">
    <Reveal><Link to="/careers#opportunities" className="role-back" data-testid="role-back"><ArrowLeft size={15} />All opportunities</Link></Reveal>
    <header className="role-header"><Reveal><Eyebrow id="role-department">{job.department.toUpperCase()} · {job.type.toUpperCase()}</Eyebrow><h1 className="display-heading" data-testid="role-heading">{job.role}</h1><p className="role-lead" data-testid="role-description">{job.about}</p></Reveal>
      <Reveal delay={.15} className="role-facts" data-testid="role-facts"><div><Clock size={16} /><span><small>DURATION</small>{job.duration}</span></div><div><Briefcase size={16} /><span><small>COMMITMENT</small>{job.commitment}</span></div><div><MapPin size={16} /><span><small>LOCATION</small>{job.location}</span></div><Action to={careersMailto(job.role)} id="role-apply" arrow="up">Apply for this role</Action><span className="apply-note">Email us your resume with the role in the subject line.</span></Reveal></header>
    <div className="role-blocks"><Block id="responsibilities" label="01 — WHAT YOU’LL DO" title="Responsibilities" items={job.responsibilities} icon={Check} /><Block id="learn" label="02 — WHAT YOU’LL LEARN" title="You’ll walk away with" items={job.learn} icon={Sparkles} /><Block id="looking-for" label="03 — WHO WE’RE LOOKING FOR" title="You might be a fit if" items={job.lookingFor} icon={Check} /></div>
    <Reveal className="role-footer"><div><span className="small-label">READY?</span><h2 data-testid="role-footer-heading">Tell us why this one.</h2></div><Action to={careersMailto(job.role)} id="role-apply-bottom" arrow="up">Apply — {job.role}</Action></Reveal>
    {related.length > 0 && <Reveal className="role-related"><span className="small-label">MORE IN {job.department.toUpperCase()}</span>{related.map(r => <Link key={r.id} to={`/careers/${r.id}`} data-testid={`related-${r.id}`}><strong>{r.role}</strong><small>{r.description}</small><ArrowUpRight size={16} /></Link>)}</Reveal>}
  </article></>;
}

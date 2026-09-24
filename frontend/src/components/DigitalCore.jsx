import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowDown, Plus } from 'lucide-react';
import { site } from '../config/site';

export const DigitalCore = ({ builder = false }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rotateY = useSpring(x, { stiffness: 35, damping: 18 });
  const rotateX = useSpring(y, { stiffness: 35, damping: 18 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const floatY = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -30, reduced ? 0 : 55]);
  const scene = builder ? site.careersSplineUrl : site.splineUrl;
  const onMove = e => { if (reduced) return; const box = e.currentTarget.getBoundingClientRect(); x.set(((e.clientX - box.left) / box.width - .5) * 7); y.set(-((e.clientY - box.top) / box.height - .5) * 5); };
  const video = builder ? (site.builderVideo?.mp4 ? site.builderVideo : null) : (site.coreVideo?.mp4 ? site.coreVideo : null);
  const videoAlt = builder ? 'Dark liquid chrome forms flowing together, representing a team building as one' : 'Rotating dark chrome cubes catching warm light, representing ideas taking shape';
  return <div ref={ref} className={`core-stage ${builder ? 'builder-stage' : ''}`} onPointerMove={onMove} onPointerLeave={() => { x.set(0); y.set(0); }} data-testid={builder ? 'builder-visual' : 'digital-core'}>
    {scene ? <iframe data-testid="spline-scene" title={builder ? 'The Builder — interactive scene' : 'The Digital Core — interactive scene'} src={scene} loading="lazy" className="spline-frame" /> : video ? <motion.div className="core-art core-video" style={{ rotateX, rotateY, y: floatY }} initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.7, delay: .3 }}>{reduced ? <img src={video.poster} alt={videoAlt} /> : <video data-testid={builder ? 'builder-video' : 'core-video'} autoPlay muted loop playsInline preload={builder ? 'metadata' : 'auto'} poster={video.poster} aria-label={videoAlt}><source src={video.webm} type="video/webm" /><source src={video.mp4} type="video/mp4" /></video>}<span className="core-video-tint" aria-hidden="true" /></motion.div> : <motion.div className="core-art" style={{ rotateX, rotateY, y: floatY }} initial={{ opacity: 0, scale: reduced ? 1 : .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.7, delay: .5 }}><img src={builder ? site.builderImage : site.coreImage} alt={builder ? 'Interlocking dark chrome forms surrounding a warm translucent core, representing collaboration' : 'A copper-lit digital core, enclosed by sculptural titanium orbits and floating interface planes'} fetchPriority={builder ? 'auto' : 'high'} /></motion.div>}
    {!builder && <><div className="core-coordinate coordinate-left" aria-hidden="true"><Plus size={12} /><span>FROM A SPARK<br />TO SOMETHING REAL.</span><i /></div><div className="core-coordinate coordinate-right" aria-hidden="true"><i /><span>STRATEGY · DESIGN<br />ENGINEERING · PRODUCT</span><Plus size={12} /></div><div className="core-caption"><span data-testid="core-caption">THE DIGITAL CORE — 001</span><a data-testid="discover-philosophy" href="#philosophy">SCROLL TO DISCOVER <ArrowDown size={13} /></a><span aria-hidden="true">IDEAS, TAKING SHAPE.</span></div></>}
    {builder && <div className="builder-caption"><span data-testid="builder-caption">THE BUILDER</span><span>GREAT THINGS ARE BUILT TOGETHER.</span></div>}
  </div>;
};
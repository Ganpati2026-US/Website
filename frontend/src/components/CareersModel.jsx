import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { site } from '../config/site';
import './CareersModel.css';

export function CareersModel() {
  const container = useRef(null);
  const inView = useInView(container, { margin: '100px' });
  const viewer = useRef(null);
  const reduced = useReducedMotion();
  const [registered, setRegistered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let active = true;
    import('@google/model-viewer').then(({ ModelViewerElement }) => {
      ModelViewerElement.dracoDecoderLocation = '/models/draco/';
      if (active) setRegistered(true);
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const element = viewer.current;
    if (!element) return;
    const onLoad = () => setLoaded(true);
    const onError = () => setFailed(true);
    element.addEventListener('load', onLoad);
    element.addEventListener('error', onError);
    return () => {
      element.removeEventListener('load', onLoad);
      element.removeEventListener('error', onError);
    };
  }, [registered]);

  useEffect(() => {
    const update = () => {
      if (viewer.current) viewer.current.autoRotate = inView && !document.hidden && reduced === false && !paused;
    };
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, [registered, reduced, paused, inView]);

  return <div ref={container} className="careers-model" data-testid="careers-model">
    {(!loaded || failed) && <div className="careers-model-placeholder">
      <img src={site.builderVideo.poster} alt="Sculptural metallic forms" />
      <span role="status">{failed ? 'Great things are built together.' : 'Bringing a new perspective to life…'}</span>
    </div>}
    {registered && !failed && <model-viewer
      ref={viewer}
      src={site.careersModel}
      alt="3D professional holding a portfolio. Drag to view from different angles."
      camera-controls=""
      disable-zoom=""
      disable-pan=""
      touch-action="pan-y"
      camera-orbit="20deg 75deg 105%"
      shadow-intensity="1"
      exposure="1.1"
      rotation-per-second="12deg"
      auto-rotate-delay="1200"
      interaction-prompt="none"
      loading="lazy"
      reveal="auto"
    />}
    <div className="careers-model-caption"><span>BUILD SOMETHING EXTRAORDINARY.</span>
      {loaded && !failed && <div><span>Drag to explore</span>{!reduced && <button onClick={() => setPaused(value => !value)} aria-label={paused ? 'Rotate 3D model' : 'Pause 3D rotation'}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>}</div>}
    </div>
  </div>;
}

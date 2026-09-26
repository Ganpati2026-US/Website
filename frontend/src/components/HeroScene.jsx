import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useLightweightVisuals } from '../hooks/useLightweightVisuals';

const Spline = lazy(() => import('@splinetool/react-spline'));
const SCENE_URL = 'https://prod.spline.design/nJGnRJgCTeMQt3BF/scene.splinecode';

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function HeroScene() {
  const lightweight = useLightweightVisuals();
  const [requested, setRequested] = useState(false);
  const enabled = !lightweight || requested;
  const sceneRef = useRef(null);
  const applicationRef = useRef(null);
  const inView = useInView(sceneRef, { margin: '100px' });
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (enabled && inView) setStarted(true);
  }, [enabled, inView]);

  useEffect(() => {
    const app = applicationRef.current;
    if (!app || !ready) return;
    const update = () => {
      if (enabled && inView && !document.hidden && !reduced) app.play();
      else app.stop();
    };
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, [enabled, inView, ready, reduced]);

  const retry = () => {
    setFailed(false);
    setReady(false);
    setAttempt(value => value + 1);
  };

  return <div ref={sceneRef} className={`hero-scene ${enabled && ready ? 'scene-ready' : ''} ${!enabled ? 'scene-lightweight' : ''}`} data-testid="hero-scene">
    <div className="scene-halo" aria-hidden="true" />
    {(!enabled || !ready || failed) && <div className="scene-fallback" aria-hidden="true">
      <div className="fallback-sculpture"><span className="sculpture-ring ring-a" /><span className="sculpture-ring ring-b" /><span className="sculpture-sphere" /></div>
      {enabled && !failed && <div className="scene-orbit"><span /></div>}
    </div>}
    {started && !failed && <div className="spline-canvas" role="img" aria-label="Interactive 3D scene. Drag to explore." data-testid="spline-scene">
      <SceneBoundary key={attempt} onFailure={() => setFailed(true)}>
        <Suspense fallback={null}>
          <Spline scene={SCENE_URL} onLoad={app => { applicationRef.current = app; setReady(true); }} />
        </Suspense>
      </SceneBoundary>
    </div>}
    <div className="scene-caption">
      <span>{!enabled ? 'IDEAS, TAKING SHAPE' : ready ? 'DRAG TO EXPLORE' : failed ? 'SCENE COULD NOT LOAD' : 'IDEAS, TAKING SHAPE'}</span>
      {!enabled && <button className="scene-explore" onClick={() => setRequested(true)}>Explore in 3D</button>}
      {enabled && failed && <button onClick={retry} aria-label="Retry interactive scene"><RotateCcw size={14} /></button>}
    </div>
  </div>;
}

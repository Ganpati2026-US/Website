import { Component, lazy, Suspense, useState } from 'react';
import { RotateCcw } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));
const SCENE_URL = 'https://prod.spline.design/nJGnRJgCTeMQt3BF/scene.splinecode';

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function HeroScene() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = () => {
    setFailed(false);
    setReady(false);
    setAttempt(value => value + 1);
  };

  return <div className={`hero-scene ${ready ? 'scene-ready' : ''}`} data-testid="hero-scene">
    <div className="scene-halo" aria-hidden="true" />
    {(!ready || failed) && <div className="scene-fallback" aria-hidden="true">
      <div className="fallback-sculpture"><span className="sculpture-ring ring-a" /><span className="sculpture-ring ring-b" /><span className="sculpture-sphere" /></div>
      {!failed && <div className="scene-orbit"><span /></div>}
    </div>}
    {!failed && <div className="spline-canvas" role="img" aria-label="Interactive 3D scene. Drag to explore." data-testid="spline-scene">
      <SceneBoundary key={attempt} onFailure={() => setFailed(true)}>
        <Suspense fallback={null}>
          <Spline scene={SCENE_URL} onLoad={() => setReady(true)} />
        </Suspense>
      </SceneBoundary>
    </div>}
    <div className="scene-caption">
      <span>{ready ? 'DRAG TO EXPLORE' : failed ? 'SCENE COULD NOT LOAD' : 'IDEAS, TAKING SHAPE'}</span>
      {failed && <button onClick={retry} aria-label="Retry interactive scene"><RotateCcw size={14} /></button>}
    </div>
  </div>;
}

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroScene } from './HeroScene';

jest.mock('framer-motion', () => ({
  useInView: () => true,
  useReducedMotion: () => false,
}));
jest.mock('@splinetool/react-spline', () => ({
  __esModule: true,
  default: () => <div data-testid="loaded-3d-scene" />,
}), { virtual: true });

describe('adaptive hero loading', () => {
  let container;
  let root;
  let media;
  const originalMedia = window.matchMedia;
  const originalCores = Object.getOwnPropertyDescriptor(navigator, 'hardwareConcurrency');

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    media = { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() };
    window.matchMedia = jest.fn(() => media);
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: 8 });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.matchMedia = originalMedia;
    if (originalCores) Object.defineProperty(navigator, 'hardwareConcurrency', originalCores);
    else delete navigator.hardwareConcurrency;
  });
  // React createRoot needs act; this does not use Testing Library.
  // eslint-disable-next-line testing-library/no-unnecessary-act
  const mountScene = async () => { await act(async () => { root.render(<HeroScene />); }); };

  it('loads the interactive hero automatically on capable desktops', async () => {
    await mountScene();
    expect(container.querySelector('[data-testid="loaded-3d-scene"]')).not.toBeNull();
    expect(container.querySelector('.scene-explore')).toBeNull();
  });
  it('keeps mobile lightweight until the visitor requests 3D', async () => {
    media.matches = true;
    await mountScene();
    expect(container.querySelector('[data-testid="loaded-3d-scene"]')).toBeNull();
    await act(async () => { container.querySelector('.scene-explore').click(); });
    expect(container.querySelector('[data-testid="loaded-3d-scene"]')).not.toBeNull();
  });
  it('keeps low-core devices lightweight even at desktop widths', async () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: 2 });
    await mountScene();
    expect(container.querySelector('[data-testid="loaded-3d-scene"]')).toBeNull();
    expect(container.querySelector('.scene-explore')).not.toBeNull();
  });
  it('responds to device changes and removes its media listener', async () => {
    await mountScene();
    const update = media.addEventListener.mock.calls[0][1];
    await act(async () => { media.matches = true; update(); });
    expect(container.querySelector('.hero-scene').classList.contains('scene-lightweight')).toBe(true);
    act(() => root.unmount());
    expect(media.removeEventListener).toHaveBeenCalledWith('change', update);
    root = createRoot(container);
  });
});

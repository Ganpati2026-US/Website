import { useEffect, useState } from 'react';

// Keep expensive visuals optional on touch screens and constrained devices.
export function useLightweightVisuals() {
  const [lightweight, setLightweight] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 1024px), (pointer: coarse), (prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    const update = () => setLightweight(media.matches || !!connection?.saveData || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4));
    update();
    media.addEventListener('change', update);
    connection?.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
      connection?.removeEventListener('change', update);
    };
  }, []);
  return lightweight;
}

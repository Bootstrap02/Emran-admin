// Hooks/useDataRefresh.js
// Runs `callback` every time the header refresh button finishes syncing
// localStorage, so a page can re-read its cached data and re-render.
import { useEffect, useRef } from 'react';

export const DATA_REFRESHED_EVENT = 'emran:data-refreshed';

const useDataRefresh = (callback) => {
  const saved = useRef(callback);
  useEffect(() => { saved.current = callback; });

  useEffect(() => {
    const handler = () => saved.current && saved.current();
    window.addEventListener(DATA_REFRESHED_EVENT, handler);
    return () => window.removeEventListener(DATA_REFRESHED_EVENT, handler);
  }, []);
};

export default useDataRefresh;

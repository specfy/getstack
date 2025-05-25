// src/ga/index.js
import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

import { isSSR } from './utils';

const TRACKING_ID = import.meta.env.VITE_GA_ID;
if (TRACKING_ID && !isSSR) {
  ReactGA.initialize(TRACKING_ID);
}

export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    if (!isSSR) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname });
    }
  }, [location]);
}

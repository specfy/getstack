// src/ga/index.js
import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const TRACKING_ID = import.meta.env.VITE_GA_ID!;
ReactGA.initialize(TRACKING_ID);

export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    console.log('prout', location.href);
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);
}

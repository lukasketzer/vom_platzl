import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import StickyHeader from '../components/StickyHeader';
import HeroSection from '../components/HeroSection/HeroSection';
import { getUserLocation, UserLocation } from '../utils/location';
import './styling.css';

export default defineContentScript({
  matches: ['*://*.google.com/*'],
  async main(ctx) {
    let headerRoot: ReactDOM.Root | null = null;
    let heroRoot: ReactDOM.Root | null = null;

    const run = () => {
      if (!isLikelyShoppingPage()) {
        if (headerRoot) {
          headerRoot.unmount();
          headerRoot = null;
        }
        if (heroRoot) {
          heroRoot.unmount();
          heroRoot = null;
        }
        return;
      }

      // Inject Sticky Header if not present
      if (!document.getElementById('vom-platzl-sticky-header')) {
        const headerContainer = document.createElement('div');
        headerContainer.style.display = 'contents';
        document.body.prepend(headerContainer);
        headerRoot = ReactDOM.createRoot(headerContainer);
        headerRoot.render(<StickyHeader />);
      }

      // Find insertion point for Hero Section
      if (!document.getElementById('vom-platzl-hero-section')) {
        const mainContent = document.querySelector('#center_col')
          || document.querySelector('#search')
          || document.querySelector('#rso')
          || document.querySelector('div[role="main"]');

        if (mainContent) {
          const heroContainer = document.createElement('div');
          heroContainer.style.display = 'contents';
          mainContent.parentElement?.prepend(heroContainer);
          heroRoot = ReactDOM.createRoot(heroContainer);
          heroRoot.render(<App />);
        }
      }
    };

    const App = () => {
      const [data, setData] = useState<any>(null);
      const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        const load = async () => {
          const query = getGoogleSearchQuery();
          
          // Get actual user location using GPS with IP fallback
          const loc = await getUserLocation();
          setUserLocation(loc);

          try {
            const response: any = await browser.runtime.sendMessage({
              action: 'fetchData',
              query,
              lat: loc?.lat,
              lon: loc?.lng
            });
            if (response && response.success) {
              setData(response.data);
            }
          } catch (e) {
            console.error(e);
          } finally {
            setIsLoading(false);
          }
        };
        load();
      }, []);

      return <HeroSection data={data} userLocation={userLocation} isLoading={isLoading} />;
    };

    // Initial run
    run();

    // Observe URL changes
    let lastUrl = location.href;
    const interval = setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        run();
      }
    }, 1000);

    ctx.onInvalidated(() => {
      clearInterval(interval);
      headerRoot?.unmount();
      heroRoot?.unmount();
    });
  },
});

function isLikelyShoppingPage() {
  const url = location.href.toLowerCase();
  if (url.includes('/shopping') || url.includes('tbm=shop')) return true;

  const findText = (text: string) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent?.toLowerCase().includes(text.toLowerCase())) return true;
    }
    return false;
  };

  return findText("gesponserte produkte") || findText("sponsored products");
}

function getGoogleSearchQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('q');
}

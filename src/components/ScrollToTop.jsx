import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component ensures that navigating to any page or route
 * automatically resets the window and document scroll position to the top.
 * Also configures history.scrollRestoration = 'manual' to prevent browser
 * scroll cache conflicts on client-side routing.
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  // Set manual history scroll restoration once on mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // When pathname or search query changes, reset scroll position
  useEffect(() => {
    // If navigating to a specific in-page anchor hash (e.g. #reviews), scroll to that element
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const resetScroll = () => {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      } catch {
        window.scrollTo(0, 0);
      }

      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Immediate scroll reset
    resetScroll();

    // Secondary frame reset to ensure post-mount layouts & mobile viewports are at the top
    const rafId = requestAnimationFrame(resetScroll);
    return () => cancelAnimationFrame(rafId);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;

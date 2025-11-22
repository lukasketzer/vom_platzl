(function () {
  // --- CONFIGURATION ---
  const BACKEND = 'http://localhost:3000';
  const HERO_ID = 'vom-platzl-hero-section';
  const TEST_MODE = true;
  // Added very common words to ensure it triggers for almost any test search

  // Store configuration
  const STORE_IMAGE_URL = ''; // Set your store image URL here
  const STORE_LATITUDE = 48.1351; // Munich coordinates (default)
  const STORE_LONGITUDE = 11.5820;

  // Brand Colors
  const C_GOLD = '#F2D027';
  const C_BLACK = '#202124';
  const C_BG_LIGHT = '#FFFDF5';

  console.log('🦁 Vom Platzl: "Brute Force" Hero Mode Loaded.');

  // --- THE HERO SECTION (BRUTE FORCE INJECTION) ---

  // Google Maps Embed API with Directions
  function getDirectionsEmbedUrl(userLat, userLng) {
    // Interactive Google Maps embed with route directions
    // This shows an interactive map with the route displayed
    return `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_CONFIG.API_KEY}&origin=${userLat},${userLng}&destination=${STORE_LATITUDE},${STORE_LONGITUDE}&zoom=${GOOGLE_MAPS_CONFIG.ZOOM_LEVEL}`;
  }

  function getStoreEmbedUrl() {
    // Interactive map showing store location when user location is not available
    return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_CONFIG.API_KEY}&q=${STORE_LATITUDE},${STORE_LONGITUDE}&zoom=14`;
  }

  function injectHeroSection(matches, userLocation = null) {
    if (document.getElementById(HERO_ID)) return;

    // STRATEGY: Find the main content area, but we'll break out of its constraints
    // #center_col = The main center column in standard Search
    // #search = The container for results
    const mainContent = document.querySelector('#center_col')
      || document.querySelector('#search')
      || document.querySelector('#rso')
      || document.querySelector('div[role="main"]');

    if (!mainContent) {
      console.log("🦁 Vom Platzl: CRITICAL - No injection target found.");
      return;
    }

    // Create a wrapper that breaks out to full viewport width
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      width: 100vw;
      position: relative;
      left: 50%;
      right: 50%;
      margin-left: -50vw;
      margin-right: -50vw;
      margin-bottom: 20px;
      box-sizing: border-box;
      overflow-x: hidden;
    `;

    // Create the search result block (styled like Google search results)
    const hero = document.createElement('div');
    hero.id = HERO_ID;

    hero.style.cssText = `
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      margin: 0 auto;
      padding: 16px 24px;
      background: #ffffff;
      font-family: arial, sans-serif;
      position: relative;
      z-index: 10;
      display: block;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      overflow-x: hidden;
    `;

    const mapsUrl = `https://www.google.com/maps?q=${STORE_LATITUDE},${STORE_LONGITUDE}`;

    // Generate interactive map embed URL with route
    let embedMapUrl;
    if (userLocation && userLocation.lat && userLocation.lng) {
      embedMapUrl = getDirectionsEmbedUrl(userLocation.lat, userLocation.lng);
    } else {
      embedMapUrl = getStoreEmbedUrl();
    }

    hero.innerHTML = `
      <div style="display: flex; align-items: center; gap: 20px; max-width: 100%; justify-content: space-between; width: 100%;">
        <!-- Left: Image -->
        <div style="
          width: 80px;
          height: 80px;
          background: ${C_BG_LIGHT};
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          flex-shrink: 0;
          overflow: hidden;
        ">
          ${STORE_IMAGE_URL ?
        `<img src="${STORE_IMAGE_URL}" alt="Store" style="width: 100%; height: 100%; object-fit: cover;" />` :
        '🦁'
      }
        </div>
        
        <!-- Middle: Text Content -->
        <div style="flex: 1; min-width: 0; max-width: 100%; padding: 0 12px;">
          <h3 style="
            margin: 0 0 3px 0;
            padding: 0;
            font-size: 16px;
            font-weight: normal;
            line-height: 1.2;
          ">
            <a href="#" style="
              color: #1a0dab;
              text-decoration: none;
              cursor: pointer;
            " onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
              Munich Local Scout - Find ${uniqueMatches.slice(0, 2).join(' & ')} Nearby
            </a>
          </h3>
          
          <div style="
            margin: 0 0 3px 0;
            font-size: 12px;
            line-height: 1.2;
            color: #006621;
          ">
            vom-platzl.de › local-scout
          </div>
          
          <div style="
            margin: 0 0 6px 0;
            font-size: 12px;
            line-height: 1.3;
            color: #4d5156;
          ">
            We detected shopping intent for <strong>${uniqueMatches.slice(0, 3).join(', ')}</strong>. 
            Discover <strong style="color: #1a0dab;">${Array.isArray(matches) ? matches.length : 0} local options</strong> in Munich. 
            Shop local, support Munich businesses, and find exactly what you need nearby.
          </div>
          
          <div style="
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
          ">
            <a href="${mapsUrl}" target="_blank" style="
              background: ${C_BLACK};
              color: ${C_GOLD};
              text-decoration: none;
              padding: 6px 12px;
              border-radius: 20px;
              font-weight: bold;
              font-size: 11px;
              cursor: pointer;
              display: inline-block;
              white-space: nowrap;
              transition: background 0.2s;
            " onmouseover="this.style.background='#303030'" onmouseout="this.style.background='${C_BLACK}'">
              📍 Open in Maps
            </a>
            
            <a href="#" style="
              color: #1a0dab;
              text-decoration: none;
              font-size: 12px;
              cursor: pointer;
            " onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
              View Local Map →
            </a>
            <span style="color: #70757a;">·</span>
            <a href="#" style="
              color: #1a0dab;
              text-decoration: none;
              font-size: 12px;
              cursor: pointer;
            " onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
              Browse Stores
            </a>
          </div>
        </div>
        
        <!-- Right: Interactive Route Map -->
        <div style="
          width: 280px;
          max-width: 30%;
          height: 140px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
        ">
          <iframe 
            src="${embedMapUrl}"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="eager"
            referrerpolicy="no-referrer-when-downgrade"
            title="${userLocation && userLocation.lat && userLocation.lng ? 'Route to Store' : 'Store Location'}"
          ></iframe>
        </div>
      </div>
    `;

    // Wrap the hero in the full-width wrapper
    wrapper.appendChild(hero);

    // THE BRUTE FORCE: Insert as the very first child of the target
    // This pushes everything else down.
    mainContent.prepend(wrapper);
    console.log("🦁 Vom Platzl: Search result block injected into", mainContent);
  }

  // --- RUNNER ---

  function debounce(fn, wait) {
    let t = null;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function getUserLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log("🦁 Geolocation not supported");
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("🦁 Geolocation error:", error.message);
          resolve(null);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  }

  async function run() {
    // Check shopping intent placeholder — the hero is shown only when this is true.
    const shoppingIntent = isLikelyShoppingPage(document.body);
    if (shoppingIntent) {
      console.log('vom-platzl: shoppingIntent=true — injecting hero section');
      const userLocation = await getUserLocation();
      // we no longer rely on matches; pass an empty array for compatibility
      injectHeroSection([], userLocation);
    } else {
      // remove existing hero if present
      const existing = document.getElementById(HERO_ID);
      if (existing) existing.remove();
      console.log('vom-platzl: shoppingIntent=false — not injecting hero');
    }
  }

  // Watch for dynamic changes in search results and re-run matching (debounced)
  const debouncedRun = debounce(run, 350);
  const observer = new MutationObserver(mutations => {
    // If new nodes are added, re-run the matcher
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length > 0) {
        debouncedRun();
        return;
      }
    }
  });

  // Start observing a sensible root element (search results area) or body as fallback
  function startObserver() {
    const root = document.querySelector('main, #search, #rso, body');
    if (root) {
      try {
        observer.observe(root, { childList: true, subtree: true });
        console.log('vom-platzl: observing DOM changes for dynamic results');
      } catch (e) {
        console.warn('vom-platzl: failed to observe DOM,', e);
      }
    }
  }

  // start observing immediately
  startObserver();

  // Basic click-to-show-product-name functionality
  function extractTitleFromCard(card) {
    if (!card) return null;
    const titleSelectors = ['h3', 'h4', '[role="heading"]', '.shntl', '.sh-ct__title', 'span'];
    for (const sel of titleSelectors) {
      const el = card.querySelector(sel);
      if (el && el.innerText && el.innerText.trim().length > 0) return el.innerText.trim();
    }
    // fallback: textContent of the card trimmed
    const txt = card.textContent && card.textContent.trim();
    if (txt && txt.length > 0) return txt.split('\n')[0].trim();
    return null;
  }

  function showToast(text) {
    if (!text) return;
    try {
      const id = 'vom-platzl-toast';
      let t = document.getElementById(id);
      if (t) t.remove();
      t = document.createElement('div');
      t.id = id;
      t.style.position = 'fixed';
      t.style.bottom = '18px';
      t.style.right = '18px';
      t.style.zIndex = '1000000';
      t.style.padding = '10px 14px';
      t.style.background = 'rgba(0,0,0,0.8)';
      t.style.color = 'white';
      t.style.borderRadius = '8px';
      t.style.fontFamily = 'Arial, sans-serif';
      t.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      t.innerText = text;
      document.body.appendChild(t);
      setTimeout(() => {
        t && t.remove();
      }, 3500);
    } catch (e) {
      console.log('vom-platzl toast:', text);
    }
  }

  document.addEventListener('click', function (ev) {
    try {
      const cardSelectors = ['.sh-dgr__grid-result', '.sh-dlr__list-result', 'g-inner-card', 'div[data-attrid^="shopping_results"]', 'div[data-attrid*="product"]', 'div[jscontroller]'];
      let el = ev.target;
      // climb up the DOM to find a matching card
      while (el && el !== document.body) {
        if (el.matches) {
          for (const sel of cardSelectors) {
            if (el.matches(sel)) {
              const title = extractTitleFromCard(el) || extractTitleFromCard(ev.target.closest('a'));
              if (title) {
                // insert the product name into the card's HTML
                insertLabelIntoCard(el, title);
                showToast(title);
                // expose last clicked product
                try { window.vomPlatzl = window.vomPlatzl || {}; window.vomPlatzl.lastClicked = title; } catch (e) { }
                return;
              }
            }
          }
        }
        el = el.parentElement;
      }
    } catch (e) {
      console.warn('vom-platzl click handler error', e);
    }
  }, true);

  // Insert a small label/badge into the clicked product card's HTML
  function insertLabelIntoCard(card, text) {
    if (!card || !text) return;
    try {
      // remove previous labels
      const prev = card.querySelector('.vom-platzl-inline-label');
      if (prev) prev.remove();

      // ensure card can contain absolutely positioned badge
      const prevPos = card.style.position;
      if (!prevPos || prevPos === '' || prevPos === 'static') {
        card.dataset.vomPlatzlPrevPos = 'static';
        card.style.position = 'relative';
      }

      const badge = document.createElement('div');
      badge.className = 'vom-platzl-inline-label';
      badge.innerText = text;
      badge.style.position = 'absolute';
      badge.style.top = '8px';
      badge.style.right = '8px';
      badge.style.zIndex = '999999';
      badge.style.background = 'rgba(255,215,74,0.95)';
      badge.style.color = '#111';
      badge.style.padding = '6px 8px';
      badge.style.borderRadius = '6px';
      badge.style.fontSize = '12px';
      badge.style.fontWeight = '600';
      badge.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
      badge.style.maxWidth = '60%';
      badge.style.overflow = 'hidden';
      badge.style.textOverflow = 'ellipsis';
      badge.style.whiteSpace = 'nowrap';

      card.appendChild(badge);

      // remove badge after timeout
      setTimeout(() => {
        try { badge.remove(); } catch (e) { }
      }, 5000);
    } catch (e) {
      console.warn('vom-platzl: failed to insert label into card', e);
    }
  }

  // expose a small dev API so you can change rules and trigger runs from the console
  try {
    window.vomPlatzl = window.vomPlatzl || {};
    window.vomPlatzl.setTestRules = function (arr) {
      if (!Array.isArray(arr)) return console.warn('vom-platzl: setTestRules expects an array');
      testRules = arr.map(String);
      console.log('vom-platzl: testRules updated', testRules);
    };
    window.vomPlatzl.run = run;
  } catch (e) {
    // ignore in strict environments
  }

  // Run on initial load and also on navigation events (single-page nav)
  run();
  // observe URL changes (history API) to re-run
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      run();
    }
  }, 1000);
})();


function insertTestBanner() {
  // Prevent duplicates if your script runs multiple times
  if (document.getElementById("local-booster-test-banner")) return;

  const banner = document.createElement("div");
  banner.id = "local-booster-test-banner";

  banner.textContent = "Test Banner – Your Shopping Enhancement is Active";

  // Basic styling so it looks like a real banner
  Object.assign(banner.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    padding: "12px 16px",
    background: "#ffcc00",
    color: "#000",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    zIndex: "999999",        // Ensure it's above everything
    borderBottom: "2px solid #000",
    fontFamily: "Arial, sans-serif"
  });

  document.body.appendChild(banner);

  // Push page content down so banner doesn't cover it
  document.body.style.marginTop = "50px";
}



// -------- Shopping Intent ------------

/**
 * Checks the DOM for elements highly specific to Google Shopping results.
 * This can confirm transactional intent even if the URL doesn't contain tbm=shop.
 * NOTE: Selectors must be found by inspecting the actual Google SERP HTML.
 * * @returns {boolean} True if the page contains visible shopping-specific elements.
 */
function isLikelyShoppingPage(root = document.body) {
    try {
        // 1. Check the URL for explicit shopping indicators
        const url = (location && location.href) ? location.href.toLowerCase() : '';
        if (url.includes('/shopping') || url.includes('tbm=shop')) return true;

        // 2. Look for shopping-specific UI elements (localized text or known containers)
        const sponsoredLabel = findElementContainingText("gesponserte produkte", root) || findElementContainingText("sponsored products", root);
        if (sponsoredLabel) return true;

        const selectors = [
            '.sh-dgr__grid-result',
            '.sh-dlr__list-result',
            'g-inner-card',
            '[data-attrid^="shopping_results"]',
            '[data-attrid*="product"]',
            'a[href*="/shopping"]'
        ];
        for (const sel of selectors) {
            if (root.querySelector && root.querySelector(sel)) return true;
        }

        return false;
    } catch (e) {
        console.warn('shopping_intent: error in isLikelyShoppingPage', e);
        return false;
    }
}

/**
 * Utility function to find the first element on the page containing the specified text.
 * @param {string} text The text string to search for.
 * @param {HTMLElement} root The root element to search within (defaults to document.body).
 * @returns {HTMLElement | null} The matching element or null if not found.
 */
function findElementContainingText(text, root = document.body) {
    // 1. Create a TreeWalker to traverse the DOM efficiently
    const walker = document.createTreeWalker(
        root, 
        NodeFilter.SHOW_TEXT,
        null, 
        false
    );

    let node;
    const lowerCaseText = text.toLowerCase();

    while (node = walker.nextNode()) {
        if (node.textContent && node.textContent.toLowerCase().includes(lowerCaseText)) {
            console.log(node)
            return node;
        }
    }

    return null;
}



(function () {
  // --- CONFIGURATION ---
  const BACKEND = 'http://localhost:3000';
  const HERO_ID = 'vom-platzl-hero-section';
  const TEST_MODE = true;
  // Added very common words to ensure it triggers for almost any test search
  let testRules = ['ps5', 'playstation', 'nintendo', 'lego', 'nike', 'schuhe', 'pfanne', 'shirt', 'hose', 'sneaker'];
  
  // Store configuration
  const STORE_IMAGE_URL = ''; // Set your store image URL here
  const STORE_LATITUDE = 48.1351; // Munich coordinates (default)
  const STORE_LONGITUDE = 11.5820;

  // Brand Colors
  const C_GOLD = '#F2D027';
  const C_BLACK = '#202124';
  const C_BG_LIGHT = '#FFFDF5';

  console.log('🦁 Vom Platzl: "Brute Force" Hero Mode Loaded.');

  // --- UTILITIES ---

  function isShoppingPage() {
    // Relaxed check to ensure it runs on almost any google results page for testing
    return location.href.includes('google');
  }

  async function fetchRules() {
    if (TEST_MODE) return testRules;
    try {
      const res = await fetch(`${BACKEND}/rules`);
      return res.ok ? await res.json() : [];
    } catch (e) { return []; }
  }

  function collectProductTexts() {
    const texts = new Set();
    // Aggressive selector list
    const selectors = [
      'h3', 'div[role="heading"]', '.sh-dgr__grid-result', 'span'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(el => {
      const t = el.innerText && el.innerText.trim();
      if (t && t.length > 2 && t.length < 100) texts.add(t);
    });
    return Array.from(texts);
  }

  function matchRules(productTexts, rules) {
    const matches = [];
    const lowered = rules.map(r => (r || '').toLowerCase());
    productTexts.forEach(pt => {
      const lpt = (pt || '').toLowerCase();
      lowered.forEach(rule => {
        if (rule && lpt.includes(rule)) {
          matches.push({rule, text: pt});
        }
      });
    });
    return matches;
  }

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

    const uniqueMatches = [...new Set(matches.map(m => m.rule))];
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
            We detected you're searching for <strong>${uniqueMatches.slice(0, 3).join(', ')}</strong>. 
            Discover <strong style="color: #1a0dab;">${matches.length} local options</strong> in Munich. 
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
    // If searching for "shoes", ensure matches exist
    const rules = await fetchRules();
    const productTexts = collectProductTexts();
    const matches = matchRules(productTexts, rules);
    
    if (matches.length > 0) {
      console.log(`🦁 Found ${matches.length} matches.`);
      // Get user location for directions
      const userLocation = await getUserLocation();
      injectHeroSection(matches, userLocation);
    } else {
      console.log("🦁 No matches found. (Try searching 'nike' or 'lego')");
    }
  }

  // Observer to keep it there if Google redraws the page
  const observer = new MutationObserver(() => {
    if (!document.getElementById(HERO_ID)) {
      run();
    }
  });

  const root = document.body;
  if (root) observer.observe(root, {childList: true, subtree: true});
  
  // Initial trigger
  setTimeout(run, 1000);

})();
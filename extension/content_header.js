(function () {
    'use strict';
  
    const HEADER_ID = 'vom-platzl-sticky-header';
    // Warm orange color
    const ORANGE_COLOR = '#ff9b54'; 
  
    console.log('🦁 Vom Platzl: Header Loaded.');
  
    function injectStickyHeader() {
      // Prevent duplicate headers
      if (document.getElementById(HEADER_ID)) return;
  
      // Find the Google search container or create header at top of page
      const searchContainer = document.querySelector('#searchform') 
                            || document.querySelector('form[action="/search"]')
                            || document.querySelector('body');
  
      if (!searchContainer) {
        console.log("Vom Platzl Header: No injection target found.");
        return;
      }
  
      // Create the header (now Non-Sticky)
      const header = document.createElement('div');
      header.id = HEADER_ID;
      
      header.style.cssText = `
        position: relative; /* CHANGED: relative allows it to scroll with the page */
        width: 100%;
        background: ${ORANGE_COLOR};
        color: #ffffff; /* White text for contrast on orange background */
        padding: 0 32px;
        height: 60px;
        /* z-index removed as it is less critical for relative, but kept just in case */
        z-index: 10000; 
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 8px rgba(255, 155, 84, 0.2);
        font-family: arial, sans-serif;
        font-size: 14px;
        box-sizing: border-box; /* Added to ensure padding doesn't overflow width */
      `;
  
      // Create text container
      const textContainer = document.createElement('div');
      textContainer.style.cssText = `
        flex: 1;
        display: flex;
        align-items: center;
        width: 100%;
      `;
      
      // Create text element
      const textElement = document.createElement('span');
      textElement.style.cssText = `
        font-size: 18px;
        font-weight: 600;
        letter-spacing: 0.3px;
        padding: 0 20px;
        width: 100%;
        display: block;
        color: #ffffff;
      `;
      textElement.textContent = 'Auf Lager bei einem Local Hero!';
      
      textContainer.appendChild(textElement);
  
      // Create logo image
      const logoImage = document.createElement('img');
      logoImage.src = chrome.runtime.getURL('logo.png');
      logoImage.alt = 'Vom Platzl Logo';
      logoImage.style.cssText = `
        height: 40px;
        width: auto;
        margin-right: 16px;
        cursor: pointer;
        object-fit: contain;
      `;
      logoImage.setAttribute('aria-label', 'Vom Platzl');
  
      // Create image element for Munich silhouette
      const imageElement = document.createElement('img');
      imageElement.src = chrome.runtime.getURL('Silhouette_of_Munich.svg-removebg-preview.png');
      imageElement.alt = 'Munich Skyline';
      imageElement.style.cssText = `
        height: 50px;
        width: auto;
        margin-left: 16px;
        margin-top: 13px;
        object-fit: contain;
        filter: brightness(0) invert(1); /* Makes the silhouette white */
        display: block;
      `;

      // Assemble header - logo first (left), then text (center), then skyline image (right)
      header.appendChild(logoImage);
      header.appendChild(textContainer);
      header.appendChild(imageElement);

      // Insert header at the top of the body
      // Since it is 'relative', it will naturally push the content down.
      document.body.insertBefore(header, document.body.firstChild);
  
      // REMOVED: The body padding logic. 
      // Because position is 'relative', we do NOT want to add padding to the body,
      // otherwise you will have a gap twice the size of the header.
  
      console.log("🦁 Vom Platzl: Header injected");
    }
  
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectStickyHeader);
    } else {
      injectStickyHeader();
    }
  
    // Observer to re-inject if Google redraws the page
    const observer = new MutationObserver(() => {
      if (!document.getElementById(HEADER_ID)) {
        injectStickyHeader();
      }
    });
  
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: false });
    }
  
  })();
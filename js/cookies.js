// --- Cookie Consent Banner Logic ---
(function() {
  'use strict';

  const CONSENT_COOKIE_NAME = "cookieConsent";
  const GA_TRACKING_ID = "G-GZ4JCKE4LG"; // <<<--- IMPORTANT: Replace

  // --- Utility Functions (setCookie, getCookie - remain the same as previous version) ---

  function setCookie(name, value, days) {
      let expires = "";
      if (days) {
          const date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
  }

  function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[2]) : null;
  }

  // --- Banner Creation (Updated Text and Button IDs/Text) ---

  function createCookieBanner() {
      const banner = document.createElement("div");
      banner.id = "cookie-banner";
      // Updated text and button labels/IDs for clarity
      banner.innerHTML = `
          <p>We use strictly necessary cookies for site function and analytics cookies to understand site usage. Your consent is needed for analytics. <a href="/legal/privacy-policy.html" target="_blank" rel="noopener noreferrer">Learn more</a>.</p>
          <div class="cookie-banner-actions">
              <button id="cookie-accept-analytics-btn" class="cookie-btn cookie-btn-accept">Accept Analytics</button>
              <button id="cookie-necessary-btn" class="cookie-btn cookie-btn-reject">Necessary Only</button>
              </div>
              `;
      // Add a settings link placeholder - Implement this later
      // <button id="cookie-settings-btn" class="cookie-btn cookie-btn-settings">Settings</button>

      document.body.appendChild(banner);

      // Update event listeners for new button IDs
      document.getElementById('cookie-accept-analytics-btn')?.addEventListener('click', acceptAnalyticsCookies);
      document.getElementById('cookie-necessary-btn')?.addEventListener('click', acceptNecessaryCookies);
      // Add listener for settings if you implement it
      // document.getElementById('cookie-settings-btn')?.addEventListener('click', showCookieSettings);
  }

  function removeCookieBanner() {
      const banner = document.getElementById("cookie-banner");
      if (banner) {
          banner.remove();
      }
  }

  // --- Consent Handling (Updated function names for clarity) ---

  /**
   * Handles accepting analytics cookies: sets consent to 'accepted', removes banner, loads GA.
   */
  function acceptAnalyticsCookies() {
      setCookie(CONSENT_COOKIE_NAME, "accepted", 365); // 'accepted' means all (including analytics)
      removeCookieBanner();
      loadGoogleAnalytics();
      // Optional: Trigger a function to show the consent management link/widget
      showConsentManagementTool();
  }

  /**
   * Handles accepting only necessary cookies: sets consent to 'necessary', removes banner.
   */
  function acceptNecessaryCookies() {
      setCookie(CONSENT_COOKIE_NAME, "necessary", 365); // Use 'necessary' or 'rejected' - be consistent
      removeCookieBanner();
      // GA is NOT loaded here
      // Optional: Trigger a function to show the consent management link/widget
      showConsentManagementTool();
  }

  // --- Google Analytics (Logic remains the same, checks for 'accepted') ---

  function loadGoogleAnalytics() {
      if (getCookie(CONSENT_COOKIE_NAME) !== "accepted") {
           // console.log("GA loading prevented: Analytics consent not granted.");
          return;
      }
      if (!GA_TRACKING_ID || GA_TRACKING_ID === "YOUR_GA_ID") {
           console.warn("GA loading skipped: GA_TRACKING_ID is not set.");
           return;
      }
      if (document.querySelector(`script[src*="googletagmanager"]`)) {
          // console.log("GA script already loaded.");
          return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', GA_TRACKING_ID, { 'anonymize_ip': true });

      console.log("Google Analytics loaded based on consent.");
  }

  // --- Initialization (Updated to handle 'necessary' state) ---

  function initializeConsent() {
      const consentStatus = getCookie(CONSENT_COOKIE_NAME);

      if (!consentStatus) {
          // No consent cookie found, show the banner
          createCookieBanner();
      } else if (consentStatus === "accepted") {
          // Consent for all (including analytics) already given, load GA
          loadGoogleAnalytics();
          // Optional: Show the management tool immediately if consent exists
           showConsentManagementTool();
      } else if (consentStatus === "necessary") {
          // Consent explicitly given for necessary only. Do not load GA.
          // Optional: Show the management tool immediately if consent exists
           showConsentManagementTool();
      }
      // If consentStatus === "rejected" (if you used that), also don't load GA.
  }

   // --- Consent Withdrawal / Management (NEW - Basic Example) ---
   /**
    * Shows a persistent link/button to manage consent.
    * You need to create the HTML element for this (e.g., in your footer).
    * <a href="#" id="manage-consent-link" style="display: none;">Manage Cookie Consent</a>
    */
   function showConsentManagementTool() {
      const manageLink = document.getElementById('manage-consent-link');
      if (manageLink) {
          manageLink.style.display = 'inline'; // Or 'block'
          manageLink.addEventListener('click', (event) => {
              event.preventDefault();
              // Simple approach: Delete the cookie and show the banner again
              setCookie(CONSENT_COOKIE_NAME, '', -1); // Delete the cookie
              location.reload(); // Easiest way to re-trigger the banner logic
              // More advanced: Re-display the banner/modal without reloading
              // initializeConsent(); // Or just createCookieBanner();
          });
      }
   }

  // --- Run Initialization ---
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeConsent);
  } else {
      initializeConsent();
  }

})();
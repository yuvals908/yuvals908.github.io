// cookies.js
document.addEventListener("DOMContentLoaded", function() {
    // Check if the user has already made a decision (accepted or declined)
    let consent = localStorage.getItem("cookie_consent");

    // Function to update Google Analytics consent settings
    function updateConsent(consentGiven) {
        if (typeof gtag === "function") {
            if (consentGiven) {
                // If accepted, allow analytics and ad cookies.
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'analytics_storage': 'granted'
                });
            } else {
                // If declined, keep cookies denied.
                gtag('consent', 'update', {
                    'ad_storage': 'denied',
                    'analytics_storage': 'denied'
                });
            }
        }
    }

    // If the user has already made a decision, update GA and stop here.
    if (consent) {
        updateConsent(consent === "accepted");
        return;
    }

    // Otherwise, create and show the cookie banner.
    let banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.innerHTML = `
        <p>
          This website uses cookies to improve your experience and to help us analyze site usage.
          By clicking "Accept", you consent to the use of cookies for analytics.
          <a href="../legal/privacynote">Learn more</a>
        </p>
        <div class="cookie-banner-actions">
            <button class="cookie-btn cookie-btn-accept">Accept</button>
            <button class="cookie-btn cookie-btn-reject">Decline</button>
        </div>
    `;
    document.body.appendChild(banner);

    // Get the buttons from the banner.
    let acceptBtn = banner.querySelector(".cookie-btn-accept");
    let rejectBtn = banner.querySelector(".cookie-btn-reject");

    // When the user clicks "Accept":
    acceptBtn.addEventListener("click", function() {
        localStorage.setItem("cookie_consent", "accepted");
        updateConsent(true);
        banner.style.display = "none";
    });

    // When the user clicks "Decline":
    rejectBtn.addEventListener("click", function() {
        localStorage.setItem("cookie_consent", "declined");
        updateConsent(false);
        banner.style.display = "none";
    });
});

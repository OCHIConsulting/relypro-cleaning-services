/*
 * RelyPro site behaviour
 *
 * Provides accessible navigation/media controls, consent-aware analytics,
 * campaign attribution, service preselection and explicit WhatsApp hand-offs.
 */

document.addEventListener('DOMContentLoaded', () => {
  const BUSINESS_PHONE = '447796584056';
  const BUSINESS_EMAIL = 'enquiries@relypro.co.uk';
  const CONSENT_KEY = 'relyproConsent';
  const CAMPAIGN_KEY = 'relyproCampaign';
  const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

  const header = document.getElementById('header');
  const setHeaderState = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  document.querySelectorAll('[data-bs-toggle="collapse"]').forEach((button) => {
    const selector = button.getAttribute('data-bs-target');
    const target = selector && selector.startsWith('#') ? document.querySelector(selector) : null;
    if (!target) {
      return;
    }

    button.addEventListener('click', () => {
      const parentSelector = target.getAttribute('data-bs-parent');
      if (parentSelector) {
        document.querySelectorAll(`${parentSelector} .accordion-collapse.show`).forEach((openPanel) => {
          if (openPanel === target) {
            return;
          }
          openPanel.classList.remove('show');
          const control = document.querySelector(`[aria-controls="${openPanel.id}"]`);
          if (control) {
            control.classList.add('collapsed');
            control.setAttribute('aria-expanded', 'false');
          }
        });
      }

      const willOpen = !target.classList.contains('show');
      target.classList.toggle('show', willOpen);
      button.classList.toggle('collapsed', !willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    });
  });

  document.querySelectorAll('.navbar-collapse a').forEach((link) => {
    link.addEventListener('click', () => {
      const nav = link.closest('.navbar-collapse');
      const toggle = nav && document.querySelector(`[aria-controls="${nav.id}"]`);
      if (nav && toggle && window.matchMedia('(max-width: 991.98px)').matches) {
        nav.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.querySelectorAll('[data-bs-slide]').forEach((control) => {
    control.addEventListener('click', () => {
      const selector = control.getAttribute('data-bs-target');
      const carousel = selector && selector.startsWith('#') ? document.querySelector(selector) : null;
      if (!carousel) {
        return;
      }
      const items = Array.from(carousel.querySelectorAll('.carousel-item'));
      const activeIndex = items.findIndex((item) => item.classList.contains('active'));
      if (activeIndex < 0 || items.length < 2) {
        return;
      }
      const direction = control.getAttribute('data-bs-slide') === 'prev' ? -1 : 1;
      const nextIndex = (activeIndex + direction + items.length) % items.length;
      items[activeIndex].classList.remove('active');
      items[nextIndex].classList.add('active');
    });
  });

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const readStoredJson = (storage, key, fallback = {}) => {
    try {
      return JSON.parse(storage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  };

  const clearAnalyticsCookies = () => {
    const analyticsCookiePattern = /^(_ga|_gid|_gat|_gac_|_gcl_)/i;
    const cookieNames = document.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0].trim())
      .filter((name) => analyticsCookiePattern.test(name));
    const hostname = window.location.hostname;
    const domains = new Set(['', hostname, `.${hostname}`]);

    if (hostname === 'relypro.co.uk' || hostname.endsWith('.relypro.co.uk')) {
      domains.add('relypro.co.uk');
      domains.add('.relypro.co.uk');
    }

    cookieNames.forEach((name) => {
      domains.forEach((domain) => {
        const domainAttribute = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=; Max-Age=0; path=/${domainAttribute}; SameSite=Lax`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainAttribute}; SameSite=Lax`;
      });
    });
  };

  const query = new URLSearchParams(window.location.search);
  const campaignFromUrl = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'].forEach((key) => {
    const value = query.get(key);
    if (value) {
      campaignFromUrl[key] = value.slice(0, 200);
    }
  });

  if (Object.keys(campaignFromUrl).length) {
    sessionStorage.setItem(CAMPAIGN_KEY, JSON.stringify({
      ...campaignFromUrl,
      landing_page: window.location.pathname,
      captured_at: new Date().toISOString()
    }));
  }

  const campaign = readStoredJson(sessionStorage, CAMPAIGN_KEY);
  const readConsent = () => {
    const storedConsent = readStoredJson(localStorage, CONSENT_KEY, null);
    const updatedAt = storedConsent && Date.parse(storedConsent.updated_at);
    const isCurrent =
      storedConsent &&
      storedConsent.essential === true &&
      Number.isFinite(updatedAt) &&
      Date.now() - updatedAt <= CONSENT_MAX_AGE_MS;

    if (!isCurrent) {
      localStorage.removeItem(CONSENT_KEY);
      clearAnalyticsCookies();
      return { essential: true, analytics: false };
    }

    return storedConsent;
  };
  let consent = readConsent();

  const analyticsMeta = document.querySelector('meta[name="relypro-ga4-id"]');
  const analyticsId = analyticsMeta ? analyticsMeta.content.trim() : '';
  let analyticsLoaded = false;

  const initialiseGoogleTag = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
  };

  const updateGoogleConsent = (analyticsGranted) => {
    if (typeof window.gtag !== 'function') {
      return;
    }

    window.gtag('consent', 'update', {
      analytics_storage: analyticsGranted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  };

  const loadAnalytics = () => {
    if (!consent.analytics || analyticsLoaded || !/^G-[A-Z0-9]+$/i.test(analyticsId)) {
      return;
    }

    initialiseGoogleTag();
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    updateGoogleConsent(true);
    window.gtag('set', 'ads_data_redaction', true);
    window.gtag('js', new Date());
    window.gtag('config', analyticsId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    document.head.appendChild(script);
    analyticsLoaded = true;
  };

  const trackEvent = (name, parameters = {}) => {
    const detail = {
      ...campaign,
      ...parameters,
      page_path: window.location.pathname
    };

    window.dispatchEvent(new CustomEvent('relypro:analytics', {
      detail: { name, parameters: detail }
    }));

    if (!consent.analytics) {
      return;
    }

    loadAnalytics();
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, detail);
    }
  };

  window.relyproAnalytics = { trackEvent };
  loadAnalytics();

  const showConsentBanner = () => {
    if (localStorage.getItem(CONSENT_KEY)) {
      return;
    }

    const banner = document.createElement('aside');
    banner.className = 'cookie-banner';
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.innerHTML = `
      <div>
        <strong>Your privacy matters</strong>
        <p class="mb-0">We use essential storage for site preferences. With your permission, analytics helps us understand which enquiries lead to bookings. <a href="cookies.html">Cookie notice</a></p>
      </div>
      <div class="cookie-banner__actions">
        <button type="button" class="btn btn-outline-light btn-sm" data-consent="essential">Essential only</button>
        <button type="button" class="btn btn-light btn-sm" data-consent="analytics">Allow analytics</button>
      </div>
    `;

    banner.addEventListener('click', (event) => {
      const button = event.target.closest('[data-consent]');
      if (!button) {
        return;
      }

      consent = {
        essential: true,
        analytics: button.dataset.consent === 'analytics',
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
      banner.remove();

      if (consent.analytics) {
        loadAnalytics();
      } else {
        updateGoogleConsent(false);
        clearAnalyticsCookies();
      }

      trackEvent('consent_update', { analytics_storage: consent.analytics ? 'granted' : 'denied' });
    });

    document.body.appendChild(banner);
  };
  showConsentBanner();

  const resetConsent = document.getElementById('resetConsent');
  if (resetConsent) {
    resetConsent.addEventListener('click', () => {
      consent = { essential: true, analytics: false, updated_at: new Date().toISOString() };
      updateGoogleConsent(false);
      clearAnalyticsCookies();
      localStorage.removeItem(CONSENT_KEY);
      window.location.reload();
    });
  }

  const addMobileConversionBar = () => {
    const bar = document.createElement('nav');
    bar.className = 'mobile-conversion-bar';
    bar.setAttribute('aria-label', 'Quick contact');
    bar.innerHTML = `
      <a href="tel:+447796584056" data-track="phone_click"><i class="fa-solid fa-phone" aria-hidden="true"></i><span>Call</span></a>
      <a href="https://wa.me/${BUSINESS_PHONE}" data-track="whatsapp_click"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>WhatsApp</span></a>
      <a href="get-quote.html" data-track="quote_click"><i class="fa-solid fa-file-signature" aria-hidden="true"></i><span>Get quote</span></a>
    `;
    document.body.appendChild(bar);
  };
  addMobileConversionBar();

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) {
      return;
    }

    const href = link.getAttribute('href') || '';
    const eventName =
      link.dataset.track ||
      (href.startsWith('tel:') ? 'phone_click' :
        href.startsWith('mailto:') ? 'email_click' :
          href.includes('wa.me') ? 'whatsapp_click' :
            href.includes('get-quote') ? 'quote_click' : '');

    if (eventName) {
      trackEvent(eventName, {
        link_url: href,
        link_text: (link.textContent || '').trim().slice(0, 100)
      });
    }
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.getElementById('hero');
  const heroVideo = document.getElementById('heroVideo');
  const videoToggle = document.getElementById('heroVideoToggle');
  const videoToggleLabel = videoToggle?.querySelector('[data-video-toggle-label]');
  const videoToggleIcon = videoToggle?.querySelector('i');

  const updateVideoButtonState = () => {
    if (!heroVideo || !videoToggle || !videoToggleLabel || !videoToggleIcon) {
      return;
    }

    const action = heroVideo.paused ? 'Play' : 'Pause';
    const label = `${action} background video`;
    videoToggleLabel.textContent = label;
    videoToggle.setAttribute('aria-label', label);
    videoToggleIcon.className = heroVideo.paused
      ? 'fa-solid fa-play'
      : 'fa-solid fa-pause';
  };

  if (heroVideo && videoToggle) {
    const applyMotionPreference = () => {
      if (reducedMotion.matches) {
        heroVideo.pause();
        updateVideoButtonState();
        return;
      }

      heroVideo.play().catch(updateVideoButtonState);
    };

    heroVideo.addEventListener('play', updateVideoButtonState);
    heroVideo.addEventListener('pause', updateVideoButtonState);
    heroVideo.addEventListener('loadeddata', updateVideoButtonState);
    heroVideo.addEventListener('error', () => {
      hero?.classList.add('hero-video-unavailable');
      videoToggle.hidden = true;
    });

    videoToggle.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play().catch(updateVideoButtonState);
      } else {
        heroVideo.pause();
      }
    });

    reducedMotion.addEventListener('change', applyMotionPreference);
    applyMotionPreference();
    updateVideoButtonState();
  }

  const showStatus = (form, message, type = 'success') => {
    let status = form.querySelector('.form-status');
    if (!status) {
      status = document.createElement('div');
      status.className = 'form-status mt-3';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      form.appendChild(status);
    }
    status.className = `form-status alert alert-${type} mt-3`;
    status.textContent = message;
    status.focus();
  };

  const openWhatsApp = (message) => {
    const url = `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) {
      window.location.href = url;
    }
  };

  const setupTrackedForm = (form, formName) => {
    if (!form) {
      return;
    }

    let started = false;
    form.addEventListener('focusin', () => {
      if (!started) {
        started = true;
        trackEvent('form_start', { form_name: formName });
      }
    });
  };

  const quoteForm = document.getElementById('quoteForm');
  const quoteService = document.getElementById('quoteService');
  const quoteDate = document.getElementById('quoteDate');

  if (quoteForm && quoteService) {
    setupTrackedForm(quoteForm, 'quote');

    const requestedService = query.get('service');
    if (requestedService) {
      const matchingOption = Array.from(quoteService.options).find(
        (option) => option.value.toLowerCase() === requestedService.toLowerCase()
      );
      if (matchingOption) {
        quoteService.value = matchingOption.value;
      }
    }

    if (quoteDate) {
      quoteDate.min = new Date().toISOString().split('T')[0];
    }

    quoteService.addEventListener('change', () => {
      trackEvent('service_selected', {
        form_name: 'quote',
        service: quoteService.value
      });
    });

    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const details = {
        name: document.getElementById('quoteName').value.trim(),
        contact: document.getElementById('quoteContact').value.trim(),
        service: quoteService.value,
        postcode: document.getElementById('quotePostcode').value.trim(),
        date: quoteDate ? quoteDate.value : '',
        notes: document.getElementById('quoteNotes').value.trim()
      };

      const message = [
        '*RelyPro – Quote Request*',
        '',
        `Name: ${details.name}`,
        `Phone or email: ${details.contact}`,
        `Service: ${details.service}`,
        `Postcode: ${details.postcode}`,
        `Preferred date: ${details.date || 'Flexible'}`,
        `Details: ${details.notes}`,
        '',
        `Source: ${campaign.utm_source || 'Direct'}`
      ].join('\n');

      trackEvent('quote_handoff', {
        form_name: 'quote',
        service: details.service,
        postcode_area: details.postcode.replace(/\s*\d[A-Z]{2}$/i, '').slice(0, 8),
        contact_method: 'whatsapp'
      });
      openWhatsApp(message);
      showStatus(
        quoteForm,
        'WhatsApp has opened with your quote request. Press Send in WhatsApp to complete your enquiry.',
        'info'
      );
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    setupTrackedForm(contactForm, 'contact');
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = [
        '*RelyPro – Contact Request*',
        '',
        `Name: ${document.getElementById('contactName').value.trim()}`,
        `Email: ${document.getElementById('contactEmail').value.trim()}`,
        `Subject: ${document.getElementById('contactSubject').value.trim()}`,
        `Message: ${document.getElementById('contactMessage').value.trim()}`
      ].join('\n');

      trackEvent('contact_handoff', { form_name: 'contact', contact_method: 'whatsapp' });
      openWhatsApp(message);
      showStatus(
        contactForm,
        `WhatsApp has opened with your message. Press Send to contact RelyPro, or email ${BUSINESS_EMAIL}.`,
        'info'
      );
    });
  }

  const careersForm = document.getElementById('careersForm');
  if (careersForm) {
    setupTrackedForm(careersForm, 'careers');
    careersForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = [
        '*RelyPro – Careers Enquiry*',
        '',
        `Name: ${document.getElementById('careerName').value.trim()}`,
        `Email: ${document.getElementById('careerEmail').value.trim()}`,
        `Phone: ${document.getElementById('careerPhone').value.trim()}`,
        `Role: ${document.getElementById('careerRole').value}`,
        `Availability: ${document.getElementById('careerAvailability').value.trim()}`,
        `Message: ${document.getElementById('careerNotes').value.trim() || 'None'}`
      ].join('\n');

      trackEvent('careers_handoff', { form_name: 'careers', contact_method: 'whatsapp' });
      openWhatsApp(message);
      showStatus(
        careersForm,
        'WhatsApp has opened with your application details. Press Send to complete your enquiry.',
        'info'
      );
    });
  }
});

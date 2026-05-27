const themeToggles = document.querySelectorAll('.theme-toggle');
const languageToggles = document.querySelectorAll('[data-lang-toggle]');
const root = document.documentElement;
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const pageKey = document.body.classList.contains('demo-page') ? 'demo' : 'index';
const supportedLanguages = ['mk', 'en'];
const defaultLanguage = 'mk';
const contactCooldownKey = 'signalplus-contact-sent-at';
const contactCooldownMs = 7 * 24 * 60 * 60 * 1000;
let currentTranslations = {};

const getStoredTheme = () => {
  try {
    return localStorage.getItem('signalplus-theme');
  } catch (error) {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    localStorage.setItem('signalplus-theme', theme);
  } catch (error) {
    // Theme still switches for the current page even when storage is unavailable.
  }
};

const getStoredLanguage = () => {
  try {
    return localStorage.getItem('signalplus-language');
  } catch (error) {
    return null;
  }
};

const storeLanguage = (language) => {
  try {
    localStorage.setItem('signalplus-language', language);
  } catch (error) {
    // Language still switches for the current page even when storage is unavailable.
  }
};

const getTranslation = (key, fallback = '') => {
  const value = key.split('.').reduce((result, part) => result?.[part], currentTranslations);
  return typeof value === 'string' ? value : fallback;
};

const getContactSentAt = () => {
  try {
    return Number(localStorage.getItem(contactCooldownKey)) || 0;
  } catch (error) {
    return 0;
  }
};

const storeContactSentAt = () => {
  try {
    localStorage.setItem(contactCooldownKey, String(Date.now()));
  } catch (error) {
    // The server still receives the request when storage is unavailable.
  }
};

const getContactCooldownRemainingDays = () => {
  const sentAt = getContactSentAt();
  const expiresAt = sentAt + contactCooldownMs;
  const remainingMs = expiresAt - Date.now();

  if (!sentAt || remainingMs <= 0) {
    return 0;
  }

  return Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
};

const getCooldownMessage = () => {
  const days = getContactCooldownRemainingDays();

  if (!days) {
    return '';
  }

  return getTranslation('home.form.cooldown', 'A request has already been sent from this browser. You can send another one in {days} days.').replace('{days}', String(days));
};

const applyTheme = (theme) => {
  root.dataset.theme = theme;

  themeToggles.forEach((toggle) => {
    const isDark = theme === 'dark';
    toggle.setAttribute(
      'aria-label',
      isDark
        ? getTranslation('common.switchToLight', 'Switch to light theme')
        : getTranslation('common.switchToDark', 'Switch to dark theme')
    );
    toggle.setAttribute('aria-pressed', String(isDark));
  });
};

applyTheme(getStoredTheme() || (systemPrefersDark ? 'dark' : 'light'));

themeToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    storeTheme(nextTheme);
    applyTheme(nextTheme);
  });
});

const applyTranslations = (translations) => {
  currentTranslations = translations;
  root.lang = translations.language?.code || defaultLanguage;

  const documentTranslations = translations.documents?.[pageKey];

  if (documentTranslations?.title) {
    document.title = documentTranslations.title;
  }

  if (documentTranslations?.description) {
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', documentTranslations.description);
  }

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const translatedText = getTranslation(element.dataset.i18n);

    if (translatedText) {
      element.textContent = translatedText;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const translatedText = getTranslation(element.dataset.i18nPlaceholder);

    if (translatedText) {
      element.setAttribute('placeholder', translatedText);
    }
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const translatedText = getTranslation(element.dataset.i18nAriaLabel);

    if (translatedText) {
      element.setAttribute('aria-label', translatedText);
    }
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
    const translatedText = getTranslation(element.dataset.i18nAlt);

    if (translatedText) {
      element.setAttribute('alt', translatedText);
    }
  });

  languageToggles.forEach((toggle) => {
    toggle.textContent = translations.language?.toggleText || 'EN';
    toggle.setAttribute('aria-label', translations.language?.toggleLabel || 'Switch language');
  });

  updateContactCooldownState();
  applyTheme(root.dataset.theme);
};

const loadLanguage = async (language) => {
  const selectedLanguage = supportedLanguages.includes(language) ? language : defaultLanguage;
  const response = await fetch(`assets/i18n/${selectedLanguage}.json`);

  if (!response.ok) {
    throw new Error(`Unable to load ${selectedLanguage} translations`);
  }

  const translations = await response.json();
  storeLanguage(selectedLanguage);
  applyTranslations(translations);
};

const initialLanguage = supportedLanguages.includes(getStoredLanguage()) ? getStoredLanguage() : defaultLanguage;

loadLanguage(initialLanguage).catch((error) => {
  console.warn(error);
});

languageToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const currentLanguage = root.lang || defaultLanguage;
    const nextLanguage = currentLanguage === 'en' ? 'mk' : 'en';

    loadLanguage(nextLanguage).catch((error) => {
      console.warn(error);
    });
  });
});

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
const formSubmit = contactForm?.querySelector('.form-submit');

const updateContactCooldownState = () => {
  if (!contactForm || !formStatus || !formSubmit) {
    return;
  }

  const cooldownMessage = getCooldownMessage();

  if (cooldownMessage) {
    formSubmit.disabled = true;
    formStatus.className = 'form-status success';
    formStatus.textContent = cooldownMessage;
  } else if (!formSubmit.dataset.submitting) {
    formSubmit.disabled = false;
  }
};

if (contactForm && formStatus) {
  updateContactCooldownState();

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cooldownMessage = getCooldownMessage();

    if (cooldownMessage) {
      formStatus.className = 'form-status success';
      formStatus.textContent = cooldownMessage;
      return;
    }

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    const requiredFields = ['name', 'company', 'email'];
    const missingField = requiredFields.find((field) => !payload[field]?.trim());

    formStatus.className = 'form-status';

    if (missingField) {
      formStatus.textContent = getTranslation('home.form.missing', 'Ве молиме пополнете ги задолжителните полиња.');
      formStatus.classList.add('error');
      return;
    }

    formStatus.textContent = getTranslation('home.form.sending', 'Барањето се испраќа...');
    formStatus.classList.add('success');

    if (formSubmit) {
      formSubmit.dataset.submitting = 'true';
      formSubmit.disabled = true;
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Contact request failed with status ${response.status}`);
      }

      formStatus.className = 'form-status success';
      formStatus.textContent = getTranslation('home.form.success', 'Барањето е успешно испратено.');
      storeContactSentAt();
      contactForm.reset();
      updateContactCooldownState();
    } catch (error) {
      console.error(error);
      formStatus.className = 'form-status error';
      formStatus.textContent = getTranslation('home.form.error', 'Барањето не се испрати. Обидете се повторно.');
    } finally {
      if (formSubmit) {
        delete formSubmit.dataset.submitting;

        if (!getContactCooldownRemainingDays()) {
          formSubmit.disabled = false;
        }
      }
    }
  });
}

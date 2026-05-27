const themeToggles = document.querySelectorAll('.theme-toggle');
const languageToggles = document.querySelectorAll('[data-lang-toggle]');
const root = document.documentElement;
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const pageKey = document.body.classList.contains('demo-page') ? 'demo' : 'index';
const supportedLanguages = ['mk', 'en'];
const defaultLanguage = 'mk';
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

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

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

    // Prepared for future API integration.
    // Example:
    // fetch('/api/contact-requests', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });

    console.log('Contact form payload:', payload);

    formStatus.textContent = getTranslation('home.form.success', 'Барањето е подготвено. Формата моментално не испраќа податоци.');
    formStatus.classList.add('success');
    contactForm.reset();
  });
}

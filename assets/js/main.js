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
      formStatus.textContent = 'Ве молиме пополнете ги задолжителните полиња.';
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

    formStatus.textContent = 'Барањето е подготвено. Формата моментално не испраќа податоци.';
    formStatus.classList.add('success');
    contactForm.reset();
  });
}

// Basic interactivity: nav toggle, menu filter/search, order quick-fill, form validation, gallery lightbox
document.addEventListener('DOMContentLoaded', function(){
  // Header nav toggle
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    // show/hide for mobile
    const visible = !expanded;
    siteNav.setAttribute('aria-hidden', String(!visible));
    if(visible) siteNav.scrollIntoView({behavior:'smooth',block:'start'});
  });

  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Menu filter + search
  const menuFilter = document.getElementById('menuFilter');
  const menuSearch = document.getElementById('menuSearch');
  const menuGrid = document.getElementById('menuGrid');
  const cards = Array.from(menuGrid.querySelectorAll('.card'));

  function updateMenu(){
    const cat = menuFilter.value;
    const q = menuSearch.value.trim().toLowerCase();
    cards.forEach(c=>{
      const title = c.querySelector('h3').textContent.toLowerCase();
      const desc = (c.querySelector('.muted')?.textContent || '').toLowerCase();
      const category = c.getAttribute('data-category') || '';
      const matchesCat = (cat === 'all') || (category === cat);
      const matchesQuery = q === '' || title.includes(q) || desc.includes(q);
      c.style.display = (matchesCat && matchesQuery) ? '' : 'none';
    });
  }
  menuFilter.addEventListener('change', updateMenu);
  menuSearch.addEventListener('input', updateMenu);

  // Quick order buttons: prefill subject & message
  const orderButtons = document.querySelectorAll('.js-order');
  const subjectEl = document.getElementById('subject');
  const messageEl = document.getElementById('message');
  const formName = document.getElementById('name');

  orderButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.getAttribute('data-item') || '';
      if(subjectEl) subjectEl.value = 'Small Order / Pickup';
      if(messageEl) messageEl.value = `Hi — I'd like to order: ${item}. Please advise availability and pickup times.`;
      // focus name so user can complete details
      if(formName) formName.focus();
      // scroll to contact form
      document.getElementById('contact').scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  // Gallery lightbox
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbClose = document.getElementById('lbClose');

  galleryGrid?.addEventListener('click', (e)=>{
    const btn = e.target.closest('.gallery-item');
    if(!btn) return;
    const src = btn.getAttribute('data-src');
    if(!src) return;
    lbImage.src = src;
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e)=>{
    if(e.target === lightbox) closeLightbox();
  });
  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    lbImage.src = '';
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox();
  });

  // Contact form validation & fake submission
  const form = document.getElementById('orderForm');
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    status.textContent = '';
    // simple built-in constraint validation
    if(!form.checkValidity()){
      status.textContent = 'Please complete required fields.';
      form.reportValidity();
      return;
    }

    // Build payload (in real site: send to server)
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      subject: form.subject.value,
      message: form.message.value.trim(),
      date: new Date().toISOString()
    };

    // UI feedback: simulate network
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try{
      // Simulate API delay
      await new Promise(r=>setTimeout(r, 1000));
      // For demonstration, we just show success
      status.textContent = 'Thanks — your request was sent. We will respond within 24 hours.';
      status.style.color = 'green';
      form.reset();
    }catch(err){
      status.textContent = 'An error occurred. Please try again later.';
      status.style.color = 'crimson';
    }finally{
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send request';
    }
  });

});

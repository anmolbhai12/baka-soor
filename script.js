// Simple interactions for the scaffold: choose cake, customize placeholder, toast messages
document.addEventListener('DOMContentLoaded', function () {
  // set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Choose buttons
  document.querySelectorAll('.btn-choose').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.dataset.id;
      const title = this.closest('.card').querySelector('.card-title').textContent;
      // store selection locally (placeholder)
      localStorage.setItem('bakenovation_selected_cake', JSON.stringify({ id, title, chosenAt: Date.now() }));
      showToast(`Selected "${title}". Proceed to checkout or continue customizing.`);
    });
  });

  // Customize button (placeholder)
  document.querySelectorAll('.btn-customize').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.dataset.id;
      const title = this.closest('.card').querySelector('.card-title').textContent;
      showToast(`Opening customizer starting from "${title}" (placeholder).`);
      // Here you would open the real customizer UI. For now, scroll to customize section.
      document.getElementById('customize').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Book call placeholder
  const book = document.getElementById('book-call');
  if (book) book.addEventListener('click', () => showToast('Thanks — we will contact you to plan your bespoke cake.'));

  // toast helper
  function showToast(msg, time = 3000) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, time);
  }
});

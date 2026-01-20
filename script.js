// Bakenovation — interactive gallery admin and customizer (client-side demo)
(function(){
  const YEAR = new Date().getFullYear();
  document.addEventListener('DOMContentLoaded', init);

  function init(){
    // set year in footer if element exists
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = YEAR;

    setupLogoFallback();
    loadGallery();
    setupGalleryAdmin();
    setupCustomizer();
  }

  // Show fallback logo crop if full logo image not present
  function setupLogoFallback(){
    const img = document.getElementById('site-logo');
    if(!img) return;
    img.addEventListener('error', ()=>{
      const fb = document.getElementById('logo-fallback');
      if(fb) fb.style.display = 'block';
    });
    // If image is hidden from start because it doesn't exist, ensure fallback is visible
    if (img.complete && img.naturalWidth === 0) {
      const fb = document.getElementById('logo-fallback');
      if(fb) fb.style.display = 'block';
    }
  }

  // Gallery: load sample assets and any localStorage entries
  function loadGallery(){
    const gallery = document.getElementById('gallery');
    if(!gallery) return;
    gallery.innerHTML = '';

    // Load packaged assets (cake1..cake6)
    for(let i=1;i<=6;i++){
      const path = `assets/gallery/cake${i}.jpg`;
      addGalleryCard({img:path, title:`Featured Cake ${i}`, price: 800 + i*150, desc:''});
    }

    // Load saved entries from localStorage
    const saved = JSON.parse(localStorage.getItem('bakenovation_gallery') || '[]');
    saved.forEach(item => addGalleryCard(item, true));
  }

  function addGalleryCard(item, isSaved){
    const gallery = document.getElementById('gallery');
    if(!gallery) return;
    const card = document.createElement('div'); card.className='card';
    const dImg = document.createElement('div'); dImg.className='card-image';
    dImg.style.backgroundImage = `url('${item.img}')`;
    const body = document.createElement('div'); body.className='card-body';
    const h = document.createElement('h3'); h.className='card-title'; h.textContent = item.title || 'Featured Cake';
    const p = document.createElement('p'); p.className='card-price'; p.textContent = '₹ ' + (item.price || '999');
    const t = document.createElement('p'); t.className='card-text'; t.textContent = item.desc || '';
    const actions = document.createElement('div'); actions.className='card-actions';
    const choose = document.createElement('button'); choose.className='btn btn-choose'; choose.textContent='Choose this cake';
    const cust = document.createElement('button'); cust.className='btn btn-outline btn-customize'; cust.textContent='Customize';
    choose.addEventListener('click', ()=> {
      localStorage.setItem('bakenovation_selected_cake', JSON.stringify({ id:item.img, title:item.title, price:item.price}));
      showToast(`Selected "${item.title}"`);
    });
    cust.addEventListener('click', ()=> {
      openCustomizerFromFeatured(item);
    });
    actions.appendChild(choose); actions.appendChild(cust);
    body.appendChild(h); body.appendChild(p); body.appendChild(t); body.appendChild(actions);
    card.appendChild(dImg); card.appendChild(body);
    gallery.appendChild(card);
  }

  // Admin to add gallery items (browser localStorage demo)
  function setupGalleryAdmin(){
    const addBtn = document.getElementById('add-gallery');
    if(!addBtn) return;
    addBtn.addEventListener('click', ()=>{
      const url = document.getElementById('gallery-url').value.trim();
      const title = document.getElementById('gallery-title').value.trim() || 'Featured Cake';
      const price = Number(document.getElementById('gallery-price').value) || 999;
      const img = url || `assets/gallery/cake1.jpg`;
      const saved = JSON.parse(localStorage.getItem('bakenovation_gallery') || '[]');
      const item = {img, title, price};
      saved.push(item);
      localStorage.setItem('bakenovation_gallery', JSON.stringify(saved));
      loadGallery();
      showToast('Featured cake added to local gallery.');
      // clear inputs
      document.getElementById('gallery-url').value = '';
      document.getElementById('gallery-title').value = '';
      document.getElementById('gallery-price').value = '';
    });
  }

  // Customizer
  function setupCustomizer(){
    const ids = ['opt-shape','opt-size','opt-flavor','opt-finish','opt-deco','opt-text','opt-image'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if(el) el.addEventListener('change', updatePreview);
    });

    const previewBtn = document.getElementById('preview-btn');
    if(previewBtn) previewBtn.addEventListener('click', updatePreview);
    const resetBtn = document.getElementById('reset-btn');
    if(resetBtn) resetBtn.addEventListener('click', resetCustomizer);

    const chooseBtn = document.getElementById('choose-this');
    if(chooseBtn) chooseBtn.addEventListener('click', ()=>{
      const data = gatherCustomizer();
      localStorage.setItem('bakenovation_selected_cake', JSON.stringify(data));
      showToast('Customizer selection saved. Proceed to checkout.');
    });

    const orderBtn = document.getElementById('order-custom');
    if(orderBtn) orderBtn.addEventListener('click', ()=> showToast('Checkout placeholder — integrate a real checkout.'));

    const file = document.getElementById('opt-image');
    if(file) {
      file.addEventListener('change', ()=>{
        const f = file.files[0];
        if(!f) return;
        const reader = new FileReader();
        reader.onload = function(e){
          const url = e.target.result;
          const imgEl = document.getElementById('preview-image');
          if(imgEl) imgEl.style.backgroundImage = `url('${url}')`;
        };
        reader.readAsDataURL(f);
      });
    }
    updatePreview();
  }

  function gatherCustomizer(){
    const shape = (document.getElementById('opt-shape')||{}).value || 'round';
    const size = Number((document.getElementById('opt-size')||{}).value || 1);
    const flavor = (document.getElementById('opt-flavor')||{}).value || 'vanilla';
    const finish = (document.getElementById('opt-finish')||{}).value || 'buttercream';
    const deco = (document.getElementById('opt-deco')||{}).value || 'none';
    const text = (document.getElementById('opt-text')||{}).value || '';
    // price calculation (demo)
    let price = 300; // base
    price += size * 350; // per kg
    if(flavor === 'premium-truffle') price += 150;
    if(finish === 'fondant') price += 200;
    if(finish === 'mousse') price += 150;
    if(deco === 'sprinkles') price += 50;
    if(deco === 'edible-flowers') price += 120;
    if(deco === 'photo-print') price += 300;
    return {shape, size, flavor, finish, deco, text, price};
  }

  function updatePreview(){
    const data = gatherCustomizer();
    const priceEl = document.getElementById('price');
    if(priceEl) priceEl.textContent = '₹ ' + data.price;
    const titleEl = document.getElementById('preview-title');
    if(titleEl) titleEl.textContent = `${data.size} kg — ${capitalize(data.flavor)} — ${capitalize(data.shape)}`;
    const textEl = document.getElementById('preview-text');
    if(textEl) textEl.textContent = data.text ? data.text : 'No message';
  }

  function resetCustomizer(){
    const defaults = {shape:'round', size:'1', flavor:'vanilla', finish:'buttercream', deco:'none', text:''};
    Object.keys(defaults).forEach(k => {
      const el = document.getElementById('opt-' + k);
      if(el) el.value = defaults[k];
    });
    const img = document.getElementById('preview-image');
    if(img) img.style.backgroundImage = "url('assets/placeholder-cake.jpg')";
    updatePreview();
    showToast('Customizer reset.');
  }

  function openCustomizerFromFeatured(item){
    // Prefill some options and show featured image in preview
    const flavor = inferFlavorFromTitle(item.title);
    if(document.getElementById('opt-flavor')) document.getElementById('opt-flavor').value = flavor;
    if(document.getElementById('opt-size')) document.getElementById('opt-size').value = '1.5';
    const img = document.getElementById('preview-image');
    if(img) img.style.backgroundImage = `url('${item.img}')`;
    updatePreview();
    document.getElementById('customize').scrollIntoView({behavior:'smooth'});
  }

  function inferFlavorFromTitle(title){
    const t = (title||'').toLowerCase();
    if(t.includes('chocolate')) return 'chocolate';
    if(t.includes('truffle')) return 'premium-truffle';
    if(t.includes('lemon')) return 'vanilla';
    if(t.includes('red')) return 'redvelvet';
    return 'vanilla';
  }

  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  function showToast(msg, time = 3000){
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(()=> t.style.display = 'none', time);
  }

})();

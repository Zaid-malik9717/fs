// ─── PRODUCT DATA ───
const products = [
  { id:1,  name:"AeroShield Pro X",    cat:"helmet",  price:8499,  oldPrice:10999, rating:4.9, reviews:312, badge:"hot",  emoji:"🪖" },
  { id:2,  name:"Carbon Racer V2",     cat:"helmet",  price:12999, oldPrice:16999, rating:4.8, reviews:198, badge:"new",  emoji:"⛑️" },
  { id:3,  name:"UrbanRide Flip-Up",   cat:"helmet",  price:5999,  oldPrice:7499,  rating:4.7, reviews:245, badge:"sale", emoji:"🪖" },
  { id:4,  name:"Moto Track Helmet",   cat:"helmet",  price:3999,  oldPrice:5499,  rating:4.5, reviews:183, badge:"",     emoji:"⛑️" },
  { id:5,  name:"Black Dragon Jacket", cat:"jacket",  price:14999, oldPrice:19999, rating:4.9, reviews:156, badge:"hot",  emoji:"🧥" },
  { id:6,  name:"Cordura Touring Pro", cat:"jacket",  price:9999,  oldPrice:13499, rating:4.7, reviews:212, badge:"new",  emoji:"🧥" },
  { id:7,  name:"Mesh Rider Jacket",   cat:"jacket",  price:6499,  oldPrice:8999,  rating:4.6, reviews:178, badge:"sale", emoji:"🧥" },
  { id:8,  name:"Thunder Race Jacket", cat:"jacket",  price:18999, oldPrice:24999, rating:5.0, reviews:89,  badge:"new",  emoji:"🧥" },
  { id:9,  name:"CE Pro Touch Gloves", cat:"gloves",  price:2499,  oldPrice:3499,  rating:4.8, reviews:392, badge:"hot",  emoji:"🥊" },
  { id:10, name:"Winter Armor Gloves", cat:"gloves",  price:3299,  oldPrice:4299,  rating:4.7, reviews:211, badge:"new",  emoji:"🥊" },
  { id:11, name:"Carbon Knuckle Pair", cat:"gloves",  price:1999,  oldPrice:2799,  rating:4.5, reviews:167, badge:"sale", emoji:"🥊" },
  { id:12, name:"MotoRace Gloves Pro", cat:"gloves",  price:4999,  oldPrice:6499,  rating:4.9, reviews:98,  badge:"",     emoji:"🥊" },
  { id:13, name:"SafeStep Race Boots", cat:"boots",   price:7999,  oldPrice:10999, rating:4.9, reviews:143, badge:"hot",  emoji:"👢" },
  { id:14, name:"Adventure Trail 2.0", cat:"boots",   price:9499,  oldPrice:12999, rating:4.8, reviews:112, badge:"new",  emoji:"👢" },
  { id:15, name:"Urban Rider Boots",   cat:"boots",   price:5499,  oldPrice:7299,  rating:4.6, reviews:201, badge:"sale", emoji:"👢" },
  { id:16, name:"D3O Back Protector",  cat:"armor",   price:2999,  oldPrice:3999,  rating:4.8, reviews:287, badge:"new",  emoji:"🛡️" },
  { id:17, name:"CE L2 Chest Guard",   cat:"armor",   price:3499,  oldPrice:4999,  rating:4.7, reviews:189, badge:"hot",  emoji:"🛡️" },
  { id:18, name:"Knee Guard Pro Set",  cat:"armor",   price:1899,  oldPrice:2699,  rating:4.6, reviews:312, badge:"sale", emoji:"🛡️" },
  { id:19, name:"HMT Airbag Vest",     cat:"armor",   price:22999, oldPrice:28999, rating:5.0, reviews:56,  badge:"new",  emoji:"🛡️" },
  { id:20, name:"Cardo Packtalk Bold", cat:"accessories", price:16999, oldPrice:20999, rating:4.9, reviews:134, badge:"hot", emoji:"🎧" },
  { id:21, name:"Pinlock Anti-Fog Kit",cat:"accessories", price:899,  oldPrice:1299,  rating:4.7, reviews:456, badge:"sale", emoji:"🔭" },
  { id:22, name:"Riding Balaclava",    cat:"accessories", price:599,  oldPrice:899,   rating:4.5, reviews:789, badge:"",    emoji:"🧣" },
  { id:23, name:"Reflective Vest Pro", cat:"accessories", price:1299, oldPrice:1799,  rating:4.6, reviews:234, badge:"new", emoji:"🦺" },
  { id:24, name:"Waterproof Overpants",cat:"accessories", price:3999, oldPrice:5499,  rating:4.7, reviews:167, badge:"sale", emoji:"👖" },
];

let cart = JSON.parse(localStorage.getItem('sr_cart') || '[]');
let activeFilter = 'all';
let testiIndex = 0;

// ─── HELPERS ───
function fmt(n){ return '₹' + n.toLocaleString('en-IN'); }
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2800);
}

// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backTop').classList.toggle('show', window.scrollY > 400);
});

// ─── HAMBURGER ───
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}));

// ─── SEARCH ───
document.getElementById('searchToggle').addEventListener('click', () => {
  document.getElementById('searchBar').classList.toggle('show');
  setTimeout(() => document.getElementById('searchInput').focus(), 100);
});
document.getElementById('searchClose').addEventListener('click', () => {
  document.getElementById('searchBar').classList.remove('show');
  document.getElementById('searchInput').value = '';
});
document.getElementById('searchInput').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  if(!q){ renderProducts(activeFilter); return; }
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
  );
  renderFilteredProducts(filtered);
});

// ─── RENDER PRODUCTS ───
function getSVG(cat, emoji){
  return `<div class="product-svg" style="font-size:80px;display:flex;align-items:center;justify-content:center;">${emoji}</div>`;
}

function makeBadge(b){
  if(!b) return '';
  const map = {new:'badge-new', sale:'badge-sale', hot:'badge-hot'};
  const label = {new:'NEW', sale:'SALE', hot:'🔥 HOT'};
  return `<span class="product-badge ${map[b]}">${label[b]}</span>`;
}

function makeCard(p){
  return `
  <div class="product-card" data-id="${p.id}">
    <div class="product-img">
      <div class="product-img-bg"></div>
      ${makeBadge(p.badge)}
      ${getSVG(p.cat, p.emoji)}
    </div>
    <div class="product-info">
      <div class="product-cat">${p.cat}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating">
        <span class="stars-small">${'★'.repeat(Math.floor(p.rating))}${p.rating%1?'½':''}</span>
        <span class="rating-num">${p.rating} (${p.reviews})</span>
      </div>
      <div class="product-bottom">
        <div class="product-price">
          <span class="price-current">${fmt(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${fmt(p.oldPrice)}</span>` : ''}
        </div>
        <button class="add-btn" onclick="addToCart(${p.id},event)" aria-label="Add to cart">+</button>
      </div>
    </div>
  </div>`;
}

function renderProducts(filter){
  activeFilter = filter;
  const list = filter === 'all' ? products : products.filter(p => p.cat === filter);
  renderFilteredProducts(list);
}

function renderFilteredProducts(list){
  const grid = document.getElementById('productGrid');
  if(!list.length){
    grid.innerHTML = '<p style="color:var(--muted);text-align:center;grid-column:1/-1;padding:40px">No products found.</p>';
    return;
  }
  grid.innerHTML = list.map(makeCard).join('');
  // Animate in
  grid.querySelectorAll('.product-card').forEach((card,i)=>{
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(()=>{
      card.style.transition = 'opacity .35s ease, transform .35s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 60);
  });
}

// ─── FILTER TABS ───
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    renderProducts(tab.dataset.tab);
  });
});

// ─── CATEGORY CARDS ───
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    const filter = card.dataset.filter;
    document.getElementById('products').scrollIntoView({behavior:'smooth'});
    setTimeout(()=>{
      document.querySelectorAll('.tab').forEach(t=>{
        t.classList.toggle('active', t.dataset.tab === filter);
      });
      renderProducts(filter);
    }, 500);
  });
});

// ─── CART ───
function addToCart(id, e){
  e.stopPropagation();
  const product = products.find(p=>p.id===id);
  if(!product) return;
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty++; }
  else { cart.push({...product, qty:1}); }
  saveCart();
  renderCart();
  showToast(`✅ ${product.name} added to cart!`);
}

function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart();
  renderCart();
}

function changeQty(id, delta){
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(id);
  else { saveCart(); renderCart(); }
}

function saveCart(){
  localStorage.setItem('sr_cart', JSON.stringify(cart));
  const total = cart.reduce((sum,i)=>sum+i.qty,0);
  document.getElementById('cartCount').textContent = total;
  document.getElementById('cartItemCount').textContent = total;
}

function renderCart(){
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if(!cart.length){
    container.innerHTML = `<div class="cart-empty"><span>🛒</span><p>Your cart is empty</p><a href="#products" class="btn btn-primary" id="startShoppingBtn">Start Shopping</a></div>`;
    footer.style.display='none';
    document.getElementById('startShoppingBtn')?.addEventListener('click', closeCart);
    return;
  }
  const totalAmt = cart.reduce((sum,i)=>sum + i.price*i.qty, 0);
  container.innerHTML = cart.map(item=>`
    <div class="cart-item">
      <div class="ci-thumb">${item.emoji}</div>
      <div class="ci-details">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${fmt(item.price)}</div>
        <div class="ci-qty">
          <button onclick="changeQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id},1)">+</button>
          <button class="ci-remove" onclick="removeFromCart(${item.id})">✕</button>
        </div>
      </div>
    </div>`).join('');
  document.getElementById('cartTotal').textContent = fmt(totalAmt);
  footer.style.display='block';
}

function openCart(){ document.getElementById('cartSidebar').classList.add('show'); document.getElementById('cartOverlay').classList.add('show'); }
function closeCart(){ document.getElementById('cartSidebar').classList.remove('show'); document.getElementById('cartOverlay').classList.remove('show'); }

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

// ─── TESTIMONIALS SLIDER ───
const testiCards = document.querySelectorAll('.testi-card');
const testiTrack = document.getElementById('testiTrack');
const testiDots  = document.getElementById('testiDots');
const totalCards = testiCards.length;
let cardsVisible = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
let maxIndex = totalCards - cardsVisible;

function buildDots(){
  testiDots.innerHTML = '';
  for(let i=0;i<=maxIndex;i++){
    const d = document.createElement('button');
    d.className = 'tdot' + (i===testiIndex?' active':'');
    d.onclick = ()=>goToTesti(i);
    testiDots.appendChild(d);
  }
}

function goToTesti(idx){
  testiIndex = Math.max(0, Math.min(idx, maxIndex));
  const cardW = testiTrack.querySelector('.testi-card').offsetWidth + 24;
  testiTrack.style.transform = `translateX(-${testiIndex * cardW}px)`;
  testiDots.querySelectorAll('.tdot').forEach((d,i)=>d.classList.toggle('active', i===testiIndex));
}

document.getElementById('tPrev').addEventListener('click', ()=>goToTesti(testiIndex-1));
document.getElementById('tNext').addEventListener('click', ()=>goToTesti(testiIndex+1));

// Auto-play
let autoTesti = setInterval(()=>goToTesti(testiIndex >= maxIndex ? 0 : testiIndex+1), 4000);
testiTrack.addEventListener('mouseenter', ()=>clearInterval(autoTesti));
testiTrack.addEventListener('mouseleave', ()=>{ autoTesti=setInterval(()=>goToTesti(testiIndex>=maxIndex?0:testiIndex+1),4000); });

window.addEventListener('resize', ()=>{
  cardsVisible = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
  maxIndex = totalCards - cardsVisible;
  testiIndex = 0;
  goToTesti(0);
  buildDots();
});

// ─── NEWSLETTER FORM ───
document.getElementById('nlForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast('🎉 Subscribed! Welcome to SafeRides.');
  e.target.reset();
});

// ─── CONTACT FORM ───
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  showToast('📩 Message sent! We\'ll get back to you soon.');
  e.target.reset();
});

// ─── BACK TO TOP ───
document.getElementById('backTop').addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));

// ─── SCROLL ANIMATIONS ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {threshold: 0.1, rootMargin: '0px 0px -50px 0px'});

function initAnimations(){
  const els = document.querySelectorAll('.feature-card, .cat-card, .testi-card, .ci-item');
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity .5s ease ${i * 0.05}s, transform .5s ease ${i * 0.05}s`;
    observer.observe(el);
  });
}

// ─── INIT ───
renderProducts('all');
buildDots();
initAnimations();
saveCart();
renderCart();

// Navbar active link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if(window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
}, {passive:true});

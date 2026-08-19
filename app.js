(() => {
  'use strict';
  const cfg = window.VIBES_CONFIG;
  const db = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  const $ = (s) => document.querySelector(s);
  const state = { products: [], category: 'all', query: '', cart: [], settings: null, selected: null, qty: 1 };
  const categories = { all: 'الكل', popular: 'الأكثر طلبًا', coffee: 'القهوة', cold: 'المشروبات الباردة', sweets: 'الحلويات', other: 'أخرى' };
  const money = (v) => `${Number(v || 0).toFixed(2)} ر.س`;
  const esc = (v = '') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const safeImage = (url) => /^https:\/\//i.test(url || '') ? url : '';
  function toast(text) { const t=$('#toast'); t.textContent=text; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2600); }
  function showError(text) { const e=$('#message'); e.textContent=text; e.className='message error'; }

  async function load() {
    const [{data: products,error}, {data: settings}] = await Promise.all([
      db.from('products').select('id,name,description,price,category,image_url,popular,options').eq('active',true).order('sort_order').order('created_at'),
      db.from('store_settings').select('*').eq('id',1).maybeSingle()
    ]);
    if (error) { showError('تعذر تحميل القائمة. شغّل ملف supabase.sql وتأكد من بيانات الربط في config.js.'); return; }
    state.products=products || []; state.settings=settings;
    renderCategories(); renderProducts(); renderStatus();
  }
  function renderStatus(){
    const s=state.settings, el=$('#storeStatus');
    if(!s){el.textContent='حالة المتجر غير متاحة';el.classList.add('closed');return;}
    const hour=new Date().getHours(), within=s.open_hour < s.close_hour ? hour>=s.open_hour&&hour<s.close_hour : hour>=s.open_hour||hour<s.close_hour;
    const open=s.is_open&&within; el.textContent=open?'مفتوح الآن':'مغلق حاليًا'; el.classList.toggle('closed',!open);
  }
  function renderCategories(){
    const present=new Set(state.products.map(p=>p.category));
    $('#categories').innerHTML=Object.entries(categories).filter(([k])=>k==='all'||k==='popular'||present.has(k)).map(([k,v])=>`<button data-cat="${k}" class="${state.category===k?'active':''}">${v}</button>`).join('');
  }
  function renderProducts(){
    const q=state.query.toLocaleLowerCase('ar');
    const list=state.products.filter(p=>(state.category==='all'||(state.category==='popular'?p.popular:p.category===state.category))&&(!q||p.name.toLocaleLowerCase('ar').includes(q)||(p.description||'').toLocaleLowerCase('ar').includes(q)));
    $('#products').innerHTML=list.length?list.map(p=>`<article class="product" data-id="${p.id}">${p.popular?'<span class="badge">⭐ الأكثر طلبًا</span>':''}${safeImage(p.image_url)?`<img src="${esc(safeImage(p.image_url))}" alt="${esc(p.name)}" loading="lazy">`:'<div class="image-placeholder">☕</div>'}<div class="product-content"><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><span class="price">${money(p.price)}</span><button class="add" aria-label="إضافة">+</button></div></article>`).join(''):'<div class="message">لا توجد منتجات مطابقة.</div>';
  }
  function openProduct(p){
    state.selected=p;state.qty=1;
    $('#productDetail').innerHTML=`${safeImage(p.image_url)?`<img class="detail-img" src="${esc(safeImage(p.image_url))}" alt="${esc(p.name)}">`:''}<h2>${esc(p.name)}</h2><p>${esc(p.description)}</p><b class="price">${money(p.price)}</b><div class="qty"><button data-qty="-1">−</button><strong id="qty">1</strong><button data-qty="1">+</button></div><button id="addSelected" class="primary">إضافة للسلة • <span>${money(p.price)}</span></button>`;
    $('#productDialog').showModal();
  }
  function addSelected(){
    const p=state.selected, found=state.cart.find(i=>i.id===p.id);
    if(found) found.qty+=state.qty; else state.cart.push({id:p.id,name:p.name,price:Number(p.price),qty:state.qty});
    updateCart(); $('#productDialog').close(); toast('تمت الإضافة للسلة');
  }
  function updateCart(){
    const count=state.cart.reduce((n,i)=>n+i.qty,0), total=state.cart.reduce((n,i)=>n+i.qty*i.price,0);
    $('#cartCount').textContent=count;$('#cartTotal').textContent=money(total);$('#dialogTotal').textContent=money(total);$('#cartButton').classList.toggle('hidden',!count);
    $('#cartItems').innerHTML=state.cart.length?state.cart.map((i,n)=>`<div class="cart-row"><div><b>${esc(i.name)}</b><div class="muted">${money(i.price)}</div></div><div class="cart-actions"><button data-cart="minus" data-index="${n}">−</button><b>${i.qty}</b><button data-cart="plus" data-index="${n}">+</button><button class="danger" data-cart="remove" data-index="${n}">حذف</button></div></div>`).join(''):'<p class="muted">السلة فارغة.</p>';
  }
  async function checkout(form){
    if(!state.cart.length)return;
    if(!state.settings?.is_open){toast('المتجر لا يستقبل طلبات حاليًا');return;}
    const btn=form.querySelector('button');btn.disabled=true;btn.textContent='جاري حفظ الطلب…';
    const fd=new FormData(form), payload={p_customer_name:fd.get('customer_name').trim(),p_customer_phone:fd.get('customer_phone').trim(),p_notes:fd.get('notes').trim(),p_items:state.cart.map(i=>({product_id:i.id,quantity:i.qty}))};
    const {data,error}=await db.rpc('create_order',payload); btn.disabled=false;btn.textContent='تأكيد الطلب وإرساله';
    if(error){console.error(error);toast('تعذر حفظ الطلب، حاول مرة أخرى');return;}
    const orderNo=data?.order_number || data?.[0]?.order_number || data;
    let text=`طلب جديد من Vibes رقم ${orderNo}\nالاسم: ${payload.p_customer_name}\nالجوال: ${payload.p_customer_phone}\n\n`;
    state.cart.forEach(i=>text+=`${i.name} × ${i.qty} — ${money(i.price*i.qty)}\n`);text+=`\nالإجمالي: ${$('#dialogTotal').textContent}`;if(payload.p_notes)text+=`\nملاحظات: ${payload.p_notes}`;
    state.cart=[];updateCart();form.reset();$('#cartDialog').close();
    toast(`تم تسجيل الطلب رقم ${orderNo}`);
    const phone=(state.settings.whatsapp_number||'').replace(/\D/g,''); if(phone) window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,'_blank','noopener');
  }
  $('#search').addEventListener('input',e=>{state.query=e.target.value;renderProducts()});
  $('#categories').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;state.category=b.dataset.cat;renderCategories();renderProducts()});
  $('#products').addEventListener('click',e=>{const c=e.target.closest('[data-id]');if(c)openProduct(state.products.find(p=>p.id===c.dataset.id))});
  $('#productDetail').addEventListener('click',e=>{if(e.target.closest('[data-qty]')){state.qty=Math.max(1,state.qty+Number(e.target.closest('[data-qty]').dataset.qty));$('#qty').textContent=state.qty;$('#addSelected span').textContent=money(state.selected.price*state.qty)}if(e.target.closest('#addSelected'))addSelected()});
  $('#cartButton').addEventListener('click',()=>{$('#cartDialog').showModal();updateCart()});
  $('#cartItems').addEventListener('click',e=>{const b=e.target.closest('[data-cart]');if(!b)return;const i=state.cart[Number(b.dataset.index)];if(b.dataset.cart==='plus')i.qty++;if(b.dataset.cart==='minus')i.qty--;if(b.dataset.cart==='remove'||i.qty<1)state.cart.splice(Number(b.dataset.index),1);updateCart()});
  $('#checkoutForm').addEventListener('submit',e=>{e.preventDefault();checkout(e.currentTarget)});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-close]');if(b)document.getElementById(b.dataset.close).close()});
  load();
})();

document.addEventListener('DOMContentLoaded',function(){
  var header=document.querySelector('.site-header'),hero=document.querySelector('.hero'),menuButton=document.querySelector('#menuButton'),mobileMenu=document.querySelector('#mobileMenu'),grid=document.querySelector('#productGrid'),tabs=document.querySelector('#categoryTabs'),count=document.querySelector('#collectionCount'),empty=document.querySelector('#emptyCollection');
  requestAnimationFrame(function(){if(hero)hero.classList.add('loaded')});
  function onScroll(){if(header)header.classList.toggle('scrolled',window.scrollY>30)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  if(menuButton&&mobileMenu){
    menuButton.addEventListener('click',function(){
      var open=menuButton.getAttribute('aria-expanded')==='true';
      menuButton.setAttribute('aria-expanded',String(!open));
      mobileMenu.classList.toggle('hidden',open)
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){menuButton.setAttribute('aria-expanded','false');mobileMenu.classList.add('hidden')})
    })
  }

  var products=window.SHOWROOM_PRODUCTS||[];

  function categories(){
    return ['All'].concat(products.map(function(p){return p.category}).filter(function(v,i,a){return a.indexOf(v)===i}))
  }

  function escapeHtml(value){
    return String(value||'').replace(/[&<>"']/g,function(char){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]
    })
  }

  function renderTabs(active){
    if(!tabs)return;
    tabs.innerHTML=categories().map(function(cat){
      return '<button type="button" class="category-tab '+(cat===active?'is-active':'')+'" data-category="'+escapeHtml(cat)+'" role="tab" aria-selected="'+(cat===active)+'">'+escapeHtml(cat)+'</button>'
    }).join('');
    tabs.querySelectorAll('.category-tab').forEach(function(button){
      button.addEventListener('click',function(){renderCollection(button.dataset.category)})
    })
  }

  function renderCollection(active){
    var filtered=active==='All'?products:products.filter(function(p){return p.category===active});
    if(count)count.textContent=filtered.length+' '+(filtered.length===1?'piece':'pieces');
    if(empty)empty.classList.toggle('hidden',filtered.length>0);
    if(!grid)return;

    grid.innerHTML=filtered.map(function(p,i){
      var specs=(p.specs||[]).slice(0,3).map(function(spec){return '<li>'+escapeHtml(spec)+'</li>'}).join('');
      return '<a href="./product.html?id='+encodeURIComponent(p.id)+'" class="product-card group reveal" style="transition-delay:'+(i*70)+'ms">'+
        '<div class="product-image-wrap relative aspect-[4/5] overflow-hidden">'+
          '<img class="product-image h-full w-full object-cover" src="'+escapeHtml(p.image)+'" alt="'+escapeHtml(p.name)+'" loading="lazy">'+
          '<div class="product-shade absolute inset-0"></div>'+
          '<div class="product-label absolute left-5 top-5">'+escapeHtml(p.label||p.category)+'</div>'+
          '<div class="product-hover-details absolute inset-x-5 bottom-5">'+
            '<div class="product-hover-type">'+escapeHtml(p.type)+'</div>'+
            '<ul class="product-specs">'+specs+'</ul>'+
            '<span class="product-view-label">View piece <span class="ml-2">→</span></span>'+
          '</div>'+
        '</div>'+
        '<div class="product-meta flex items-end justify-between gap-4 px-1 py-5">'+
          '<div><p class="font-display text-2xl sm:text-3xl">'+escapeHtml(p.name)+'</p><p class="mt-1 text-[10px] uppercase tracking-[.18em] text-bone/40">'+escapeHtml(p.category)+'</p></div>'+
          '<span class="text-xs text-champagne">'+escapeHtml(p.price)+'</span>'+
        '</div>'+
      '</a>'
    }).join('');

    renderTabs(active);
    grid.querySelectorAll('.reveal').forEach(function(el){observer.observe(el)})
  }

  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
    })
  },{threshold:.08});

  renderCollection('All');

  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect();
        el.style.transform='translate('+(e.clientX-r.left-r.width/2)*.08+'px,'+(e.clientY-r.top-r.height/2)*.08+'px)'
      });
      el.addEventListener('pointerleave',function(){el.style.transform=''})
    })
  }
});
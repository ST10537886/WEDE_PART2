'use strict';
const money = value => new Intl.NumberFormat('en-ZA', {style:'currency',currency:'ZAR'}).format(value);
let cataloguePromise;
function getCatalogue() {
  if (!cataloguePromise) cataloguePromise = fetch('data/products.json').then(r => {if(!r.ok) throw new Error('Catalogue unavailable'); return r.json();});
  return cataloguePromise;
}
function el(tag, text, className) { const node=document.createElement(tag); if(text) node.textContent=text; if(className) node.className=className; return node; }
const grid=document.querySelector('#product-grid');
if(grid) {
  const search=document.querySelector('#product-search'), sort=document.querySelector('#product-sort'), count=document.querySelector('#product-count');
  let catalogue=[];
  function render() {
    const term=search.value.trim().toLocaleLowerCase();
    const matches=catalogue.filter(p => `${p.name} ${p.description}`.toLocaleLowerCase().includes(term));
    if(sort.value==='name') matches.sort((a,b)=>a.name.localeCompare(b.name));
    if(sort.value==='price-low') matches.sort((a,b)=>a.price-b.price || a.name.localeCompare(b.name));
    if(sort.value==='price-high') matches.sort((a,b)=>b.price-a.price || a.name.localeCompare(b.name));
    grid.replaceChildren();
    for(const p of matches) {
      const card=el('article'), button=el('button',null,'image-button'), img=el('img');
      img.src='images/products/'+p.image; img.alt=p.alt; img.loading='lazy'; img.decoding='async'; img.width=p.width; img.height=p.height;
      button.type='button';button.setAttribute('aria-label','Enlarge image of '+p.name); button.append(img);
      button.addEventListener('click',()=>openLightbox(p,button));
      const copy=el('div',null,'card-copy'), link=el('a','Enquire about '+p.name,'link'); link.href='enquiry.html?product='+encodeURIComponent(p.id);
      copy.append(el('h2',p.name),el('p',p.description),el('strong',money(p.price)),el('p'));copy.lastChild.append(link);card.append(button,copy);grid.append(card);
    }
    count.textContent=`${matches.length} of ${catalogue.length} soaps shown`;
    if(!matches.length) grid.append(el('p','No soaps match your search. Try a product name or colour.'));
  }
  search.disabled=sort.disabled=true;
  getCatalogue().then(data=>{catalogue=data;search.disabled=sort.disabled=false;render();}).catch(()=>{count.textContent='Live catalogue could not load. The original catalogue is shown below; reload to try again.';});
  search.addEventListener('input',render);sort.addEventListener('change',render);
}
const lightbox=document.querySelector('#lightbox'); let opener;
function openLightbox(product,button) {
  opener=button; const image=document.querySelector('#lightbox-image'); image.src='images/products/'+product.image;image.alt=product.alt;
  document.querySelector('#lightbox-caption').textContent=product.name; lightbox.showModal();
}
if(lightbox) {
 document.querySelector('#lightbox-close').addEventListener('click',()=>lightbox.close());
 lightbox.addEventListener('click',event=>{if(event.target===lightbox){const r=lightbox.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)lightbox.close();}});
 lightbox.addEventListener('close',()=>opener?.focus());
}
for(const form of document.querySelectorAll('form')) {
 form.noValidate=true;
 const result=form.querySelector('.form-result');
 for(const field of form.querySelectorAll('input,textarea,select')) {
   const error=el('span',null,'field-error');error.id=field.id+'-error';field.setAttribute('aria-describedby',error.id);field.after(error);
   field.addEventListener('input',()=>{field.setCustomValidity('');field.removeAttribute('aria-invalid');error.textContent='';});
 }
 function validate() {
   let first;
   for(const field of form.querySelectorAll('input,textarea,select')) {
     field.setCustomValidity('');
     if(['name','message'].includes(field.name) && field.value.trim().length<(field.name==='name'?2:10))field.setCustomValidity(field.name==='name'?'Enter at least 2 non-space characters.':'Enter a message of at least 10 non-space characters.');
     if(field.name==='phone'&&!/^\+?\d{10,15}$/.test(field.value.replace(/[ ()-]/g,'')))field.setCustomValidity('Enter 10 to 15 digits, with an optional leading +.');
     const error=document.getElementById(field.id+'-error');error.textContent=field.validationMessage;field.setAttribute('aria-invalid',String(!field.validity.valid));
     if(!field.validity.valid&&!first)first=field;
   }
   if(first){result.textContent='Please correct the highlighted fields.';first.focus();return false;}return true;
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!validate())return;
  const values=Object.fromEntries(new FormData(form));result.replaceChildren();
  if(form.id==='contact-form') {
    const body=`Name: ${values.name.trim()}\nEmail: ${values.email}\nPhone: ${values.phone}\nMessage type: ${values.subject}\n\n${values.message.trim()}`;
    const address=window.LDL_CONFIG?.contactEmail;
    result.append(el('h2','Your message is ready'),el('p','Review your message below. It has not been sent.'));
    const preview=el('textarea');preview.value=body;preview.readOnly=true;preview.rows=9;preview.setAttribute('aria-label','Prepared message');result.append(preview);
    if(address && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      const link=el('a','Open email app','button');link.href='mailto:'+encodeURIComponent(address)+'?subject='+encodeURIComponent('LizDeLux: '+values.subject)+'&body='+encodeURIComponent(body);result.append(link,el('p','Your email app opens a draft. Review it and send it there.'));
    } else result.append(el('p','The business email is not yet available. Copy this message and contact 082 654 0809 on WhatsApp.'));
    const copy=el('button','Copy message','button');copy.type='button';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(body);copy.textContent='Copied';}catch{preview.focus();preview.select();copy.textContent='Message selected — copy with your keyboard';}});result.append(copy);result.focus();return;
  }
  const submit=form.querySelector('[type=submit]');submit.disabled=true;result.textContent='Calculating your estimate…';
  try {
    // The AJAX endpoint validates and calculates on Netlify; static previews use the public catalogue.
    let response=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});
    if(!response.ok) {
      if(response.status!==404&&response.status!==405&&response.status!==501)throw new Error('The estimate service could not process this request. Please try again or phone us.');
      const product=(await getCatalogue()).find(p=>p.id===values.product);
      response={json:async()=>({message:product?`${values.quantity} × ${product.name}: ${money(product.price*Number(values.quantity))} at catalogue prices. Delivery is excluded. Stock and final pricing must be confirmed.`:'Upcoming products have no confirmed price or release date. Please contact us to discuss your enquiry.',mode:'preview'})};
    }
    const data=await response.json();result.replaceChildren(el('h2','Your enquiry estimate'),el('p',data.message),el('p','No order has been placed and no message has been sent. Please contact us to confirm availability.'));
    const contact=el('a','Contact LizDeLux','button');contact.href='contact.html';result.append(contact);result.focus();
  } catch(error){result.textContent=error.message || 'Unable to calculate an estimate. Please try again.';}
  finally {submit.disabled=false;}
 });
}
const selected=new URLSearchParams(location.search).get('product');
const productSelect=document.querySelector('#enquiry-product');
if(productSelect && [...productSelect.options].some(option=>option.value===selected))productSelect.value=selected;
const address=window.LDL_CONFIG?.contactEmail;
if(address&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)&&document.querySelector('#email-status')) {
 const link=el('a',address);link.href='mailto:'+encodeURIComponent(address);document.querySelector('#email-status').replaceChildren(link);
}

const products = require('../../data/products.json');
exports.handler = async event => {
 const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
 const reply=(statusCode,data)=>({statusCode,headers,body:JSON.stringify(data)});
 if(event.httpMethod!=='POST') return reply(405,{message:'Use POST to request an estimate.'});
 if((event.body||'').length>12000) return reply(413,{message:'Request too large.'});
 let data;try{data=JSON.parse(event.body||'{}');}catch{return reply(400,{message:'Invalid JSON.'});}
 if(!data||typeof data!=='object'||Array.isArray(data))return reply(400,{message:'Invalid request.'});
 const validText=(value,min,max)=>typeof value==='string'&&value.trim().length>=min&&value.length<=max;
 if(!validText(data.name,2,80)||!validText(data.email,3,120)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||typeof data.phone!=='string'||data.phone.length>20||!/^\+?\d{10,15}$/.test(data.phone.replace(/[ ()-]/g,''))||!validText(data.message,10,2000)||!['availability','order','range'].includes(data['enquiry-type']))return reply(400,{message:'Please check your contact details and message.'});
 const quantity=Number(data.quantity),product=products.find(p=>p.id===data.product);
 if(!Number.isInteger(quantity)||quantity<1||quantity>100||(!product&&data.product!=='other'))return reply(400,{message:'Choose a valid product and quantity from 1 to 100.'});
 const message=product?`${quantity} × ${product.name}: R${(quantity*product.price).toFixed(2)} at catalogue prices. Delivery is excluded. Stock and final pricing must be confirmed.`:'Upcoming products have no confirmed price or release date. Please contact us to discuss your enquiry.';
 return reply(200,{message});
};

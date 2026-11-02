const fs=require('node:fs'),path=require('node:path');
const domain=process.argv[2]||process.env.URL;
if(!domain)throw new Error('Supply the live website URL: node build.cjs https://your-site.netlify.app');
const parsed=new URL(domain);if(parsed.protocol!=='https:')throw new Error('Use the final HTTPS website URL.');
const base=parsed.origin;
const out=path.join(__dirname,'dist');fs.mkdirSync(out,{recursive:true});
for(const name of ['index.html','about.html','products.html','enquiry.html','contact.html','css','js','images','data','_headers'])fs.cpSync(path.join(__dirname,name),path.join(out,name),{recursive:true});
const pages=['index.html','about.html','products.html','enquiry.html','contact.html'];
const pageUrl=page=>base+(page==='index.html'?'/':'/'+page.replace(/\.html$/, ''));
for(const page of pages){const file=path.join(out,page);let html=fs.readFileSync(file,'utf8');const title=html.match(/<title>(.*?)<\/title>/)[1];const description=html.match(/name="description" content="([^"]+)"/)[1];html=html.replace('</head>',`<link rel="canonical" href="${pageUrl(page)}">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${description}">\n<meta property="og:type" content="website">\n<meta property="og:url" content="${pageUrl(page)}">\n<meta property="og:image" content="${base}/images/products/assorted-handmade-soaps-board.jpg">\n</head>`);if(page==='index.html'){const schema={'@context':'https://schema.org','@type':'Organization',name:'LizDeLux Botanicals',url:base,telephone:'+27826540809',areaServed:['Ga-Sekhukhune, Limpopo, South Africa','Pretoria, Gauteng, South Africa']};html=html.replace('</head>',`<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);}fs.writeFileSync(file,html);}
fs.writeFileSync(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(p=>`  <url><loc>${pageUrl(p)}</loc></url>`).join('\n')+'\n</urlset>\n');
fs.writeFileSync(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
console.log('Built website in dist for '+base);


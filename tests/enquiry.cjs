const assert=require('node:assert/strict');
const {handler}=require('../netlify/functions/enquiry.js');
(async()=>{
const valid={name:'Test Customer',email:'customer@example.org',phone:'0826540809',message:'Please check this soap quantity.',product:'aloe-de-gen',quantity:'3','enquiry-type':'availability'};
let checks=0;
async function check(data,status,method='POST'){const r=await handler({httpMethod:method,body:typeof data==='string'?data:JSON.stringify(data)});assert.equal(r.statusCode,status);checks++;return JSON.parse(r.body);}
assert.match((await check(valid,200)).message,/R105\.00/);
for(const change of [{quantity:'0'},{quantity:'101'},{quantity:'1.5'},{product:'fake'},{email:'invalid'},{name:' '},{phone:'abc'},{message:'short'},{'enquiry-type':'fake'}])await check({...valid,...change},400);
await check('{',400);await check(null,400);await check({},405,'GET');await check('x'.repeat(12001),413);
assert.match((await check({...valid,product:'other'},200)).message,/no confirmed price/);
console.log(checks+' endpoint checks passed');
})();


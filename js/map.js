'use strict';
const mapStatus=document.querySelector('#map-status');
if(typeof L==='undefined') mapStatus.textContent='The map could not load. Please use the service-area links above.';
else {
 const map=L.map('service-map',{scrollWheelZoom:false}).setView([-24.9,29.2],7);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map).on('tileerror',()=>{mapStatus.textContent='Some map tiles could not load. Service-area links remain available above.';});
 L.circle([-25.7479,28.2293],{radius:18000}).addTo(map).bindPopup('Pretoria service area. Contact us for collection or delivery arrangements.');
 L.circle([-24.45,29.9],{radius:45000}).addTo(map).bindPopup('Approximate Sekhukhune service region. This is not a shop address.');
 mapStatus.textContent='Select a service region for details. Use the + and − controls to zoom.';
}

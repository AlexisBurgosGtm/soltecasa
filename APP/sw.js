var CACHE = 'carwash';
const staticAssets = [
  './',
  './manifest.json',
  './css/sb-admin-2.css',
  './css/sb-admin-2.min.css',
  './js/sb-admin-2.js',
  './js/sb-admin-2.min.js',
  './libs/funciones.js',
  './libs/index.js',
  './libs/sweetalert.min.js',
  './vendor/jquery/jquery.min.js',
  './vendor/bootstrap/js/bootstrap.bundle.min.js',
  './vendor/jquery-easing/jquery.easing.min.js',
  './favicon.png',
  './index.html',
  './inicio.html',
  './sw.js'
];

self.addEventListener('install', function(evt) {
  //console.log('Service worker instalado');
  evt.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll(staticAssets);
  }));
});

self.addEventListener('fetch', function(evt) {
  //const destination = evt.request.destination;
  //console.log('destination: ' + destination.toString());

  /*
  var req = evt.request.clone();
  if (req.clone().method == "GET") {
    //console.log('El service worker está cargando el caché');
    evt.respondWith(fromCache(evt.request));
    evt.waitUntil(update(evt.request));
  }
    */
});

/*
self.addEventListener('fetch', function(evt) {
    console.log('El service worker está cargando el caché');
    evt.respondWith(fromCache(evt.request));
    evt.waitUntil(update(evt.request));
   
});
*/

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}

async function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request)
        .then(function (response) {
          return cache.put(request, response.clone())
                      .then(function () {
                        //console.log('Cache actualizado');
          return response;
      });
    });
  });
}
    



self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open(event.request.url).then(function(cache) {
        return cache.match(event.request).then(function (response) {
          if(navigator.onLine){
            return fetch(event.request).then(function(response) {
              if(event.request.method == 'GET'){
                cache.put(event.request, response.clone());
              }
              return response;
            });
          }else{
            if(response){
              return response
            }else{
              return null
            }
          }
        });
      })
    );
});
    
    
const URL =  'http://localhost:3001/';
  
self.addEventListener('sync', function(event) {
  if (event.tag == 'order') {
    event.waitUntil(getOrderData());
  }
});
    
function getOrderData(){
  var indexedDBOpenRequest = indexedDB.open('order',  1)
  indexedDBOpenRequest.onsuccess = function () {
    let db = this.result
    let transaction = db.transaction("order_requests", "readwrite");
    let storeObj = transaction.objectStore("order_requests");
    var cursorRequest = storeObj.openCursor();
    cursorRequest.onsuccess = function(evt) {                    
      var cursor = evt.target.result;
      if (cursor) {
        console.log("cursor.value", cursor.value)
          sendTableOrder(cursor.value, cursor.key)
          cursor.continue();
      }
    };
  }
  indexedDBOpenRequest.onerror = function (error) {
    console.error('IndexedDB error:', error)
  }
}

function deleteFromIndexdb(index){
  var indexedDBOpenRequest = indexedDB.open('order',  1)
  indexedDBOpenRequest.onsuccess = function () {
    let db = this.result
    let transaction = db.transaction("order_requests", "readwrite");
    let storeObj = transaction.objectStore("order_requests");
    storeObj.delete(index)
  }
}

function sendTableOrder(data, index){
  fetch(URL + 'orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then((response) => {
    if(response){
      deleteFromIndexdb(index)
    }
  });
}
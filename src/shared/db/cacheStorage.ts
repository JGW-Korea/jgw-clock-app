interface CacheStorageRecord<T> {
  cacheStorageName: string;
  data: T,
  expires: number;
}

/** Cache Storage 객체 저장소 삽입 요청 수행 */
async function setCacheStorage<T>(cacheStorageName: string, data: T) {
  const db = await cacheStorageDB;

  // 삽입 요청도 비동기로 수행되기 때문에 Promise 객체를 반환한다.
  return new Promise((resolve, reject) => {
    const cacheObjectStore = db.transaction("cacheStorage", "readwrite").objectStore("cacheStorage");

    const record: CacheStorageRecord<T> = {
      cacheStorageName,
      data,
      expires: Date.now() + (1000 * 60 * 60 * 24 * 365),
    }

    // Cache Storage 객체 저장소에 매개변수로 전달된 데이터를 삽입 요청을 수행한다.
    // 만일 동일한 기본 키에 대한 데이터가 존재하면 데이터 삽입이 아닌 갱신이 일어난다.
    const cacheObjectStoreSetRequest = cacheObjectStore.put(record);
    cacheObjectStoreSetRequest.onsuccess = () => resolve(cacheObjectStoreSetRequest.result);
    cacheObjectStoreSetRequest.onerror = () => reject(cacheObjectStoreSetRequest.error);
  });
}

/** Cache Storage 객체 저장소 조회 요청 수행 */
async function getCacheStorage<T>(cacheStorageName: string): Promise<CacheStorageRecord<T> | undefined> {
  const db = await cacheStorageDB;
  
  // 조회 요청도 비동기로 수행되기 때문에 Promise 객체를 반환한다.
  return new Promise((resolve, reject) => {
    const cacheObjectStore = db.transaction("cacheStorage", "readonly").objectStore("cacheStorage");
    
    // Cache Storage 객체 저장소에 매개변수로 전달된 데이터 조회 요청을 수행한다.
    const cacheObjectStoreGetRequest = cacheObjectStore.get(cacheStorageName);
    cacheObjectStoreGetRequest.onsuccess = () => resolve(cacheObjectStoreGetRequest.result as CacheStorageRecord<T> | undefined);
    cacheObjectStoreGetRequest.onerror = () => reject(cacheObjectStoreGetRequest.error);
  });
}

// IndexedDB에 생성한 데이터베이스 정보를 담는 cacheStorageDB 변수를 생성한다.
// 이때 Promise 객체를 이용해서 생성하는 이유는 IndexedDB는 논블로킹 방식의 비동기 처리를 지원하기 때문이다.
// 이로 인해, 다른 CRUD 작업을 수행하는 함수에서 cacheStorageDB 변수에 접근할 경우 undefined로 처리되기 때문에 IndexedDB 데이터베이스에 접근하지 못하게 된다.
// 그렇기 때문에 Promise 객체의 resolve(성공 이행 함수)에 생성된 cacheStorageDB 정보를 담아 나중에 이 값만 가지고 온다.
// 만일 DB 연동 과정에서 실패가 발생하면 reject(실패 이행 함수)로 담아서 처리한다.
const cacheStorageDB: Promise<IDBDatabase> = new Promise((resolve, reject) => {
  const DBOpenRequest = indexedDB.open("cacheStorageDB"); // 데이터베이스 연결 요청을 보낸다.

  // cahceStorageDB 데이터베이스의 구조를 구성한다.
  DBOpenRequest.onupgradeneeded = (event) => {
    const db = DBOpenRequest.result;

    // cacheStorageDB라는 데이터베이스가 생성되지 않은 경우에만 객체 저장소를 생성한다.
    if(event.oldVersion < 1) {
      db.createObjectStore("cacheStorage", {
        keyPath: "cacheStorageName"
      });
    }
  }

  // cacheStorageDB 데이터베이스 연결이 성공된 경우
  DBOpenRequest.onsuccess = () => {
    const db = DBOpenRequest.result;

    db.onclose = () => console.log("Database connection closed");
    db.onversionchange = () => console.log("The version of this database has changed");

    resolve(db);
  }

  // cacheStorageDB 데이터베이스 연결이 실패된 경우
  DBOpenRequest.onerror = () => {
    reject(DBOpenRequest.error);
  }
});

export { cacheStorageDB, getCacheStorage, setCacheStorage };
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

export { cacheStorageDB };
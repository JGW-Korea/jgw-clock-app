let cacheStorageDB: IDBDatabase;

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

  cacheStorageDB = db;
}

// cacheStorageDB 데이터베이스 연결이 실패된 경우
DBOpenRequest.onerror = () => {
  console.log(`Database opened faild!! ${DBOpenRequest.error}`);
}

export { cacheStorageDB };
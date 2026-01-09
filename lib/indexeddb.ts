const DB_NAME = "coursecal";
const DB_VERSION = 1;

const STORES = {
  events: "events",
  courseColors: "courseColors",
} as const;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create events store
      if (!db.objectStoreNames.contains(STORES.events)) {
        db.createObjectStore(STORES.events, { keyPath: "id", autoIncrement: true });
      }

      // Create courseColors store
      if (!db.objectStoreNames.contains(STORES.courseColors)) {
        db.createObjectStore(STORES.courseColors, { keyPath: "course" });
      }
    };
  });
}

// Events
export async function saveEvents(events: ScheduleEvent[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORES.events, "readwrite");
  const store = tx.objectStore(STORES.events);

  // Clear existing events first
  store.clear();

  // Add all new events
  for (const event of events) {
    store.add(event);
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getEvents(): Promise<ScheduleEvent[]> {
  const db = await openDB();
  const tx = db.transaction(STORES.events, "readonly");
  const store = tx.objectStore(STORES.events);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function clearEvents(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORES.events, "readwrite");
  const store = tx.objectStore(STORES.events);

  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => {
      db.close();
      resolve();
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

// Course Colors
export async function saveCourseColors(courseColors: CourseColor[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORES.courseColors, "readwrite");
  const store = tx.objectStore(STORES.courseColors);

  // Clear existing colors first
  store.clear();

  // Add all new course colors
  for (const courseColor of courseColors) {
    store.add(courseColor);
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getCourseColors(): Promise<CourseColor[]> {
  const db = await openDB();
  const tx = db.transaction(STORES.courseColors, "readonly");
  const store = tx.objectStore(STORES.courseColors);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function clearCourseColors(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORES.courseColors, "readwrite");
  const store = tx.objectStore(STORES.courseColors);

  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => {
      db.close();
      resolve();
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

// Clear all data
export async function clearAllData(): Promise<void> {
  await clearEvents();
  await clearCourseColors();
}


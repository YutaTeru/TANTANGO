import { GrammarPage, MistakeLog } from '../types';

const DB_NAME = 'vocab_master_db';
const STORE_NAME_PAGES = 'grammar_pages';
const STORE_NAME_MISTAKES = 'mistake_logs';
const STORE_NAME_FAVORITES = 'favorite_words';
const DB_VERSION = 3; // Bump version for favorites

// Global state to detect whether to bypass IndexedDB and use the memory/localStorage store
let useFallbackStore = false;

// Fallback Memory Store (initially populated from localStorage if available)
const memoryStore: Record<string, any[]> = {
  [STORE_NAME_PAGES]: [],
  [STORE_NAME_MISTAKES]: [],
  [STORE_NAME_FAVORITES]: []
};

// Sync fallback helper
const saveFallback = (storeName: string, data: any[]) => {
  try {
    localStorage.setItem(`vocab_fallback_${storeName}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`localStorage save failed for ${storeName}`, e);
  }
};

const loadFallback = (storeName: string): any[] => {
  try {
    const data = localStorage.getItem(`vocab_fallback_${storeName}`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn(`localStorage load failed for ${storeName}`, e);
    return [];
  }
};

// Initialize memoryStore with stored data
try {
  memoryStore[STORE_NAME_PAGES] = loadFallback(STORE_NAME_PAGES);
  memoryStore[STORE_NAME_MISTAKES] = loadFallback(STORE_NAME_MISTAKES);
  memoryStore[STORE_NAME_FAVORITES] = loadFallback(STORE_NAME_FAVORITES);
} catch (e) {
  console.warn("Failed to initialize memoryStore fallbacks", e);
}

// Open the database with robust fallback logic
export const openDB = (): Promise<IDBDatabase | null> => {
  if (useFallbackStore) {
    return Promise.resolve(null);
  }
  
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined' || !indexedDB) {
    console.warn("IndexedDB not supported, falling back to LocalStorage/memory store.");
    useFallbackStore = true;
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.warn("IndexedDB open error, falling back to LocalStorage/memory store:", request.error);
        useFallbackStore = true;
        resolve(null);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        try {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Store 1: Grammar Notebook
          if (!db.objectStoreNames.contains(STORE_NAME_PAGES)) {
            db.createObjectStore(STORE_NAME_PAGES, { keyPath: 'id' });
          }

          // Store 2: Mistake Logs
          if (!db.objectStoreNames.contains(STORE_NAME_MISTAKES)) {
            const mistakeStore = db.createObjectStore(STORE_NAME_MISTAKES, { keyPath: 'id' });
            mistakeStore.createIndex('createdAt', 'createdAt', { unique: false });
          }

          // Store 3: Favorite Words
          if (!db.objectStoreNames.contains(STORE_NAME_FAVORITES)) {
            db.createObjectStore(STORE_NAME_FAVORITES, { keyPath: ['datasetKey', 'id'] });
          }
        } catch (err) {
          console.error("Error upgrading IndexedDB schema:", err);
        }
      };
    } catch (e) {
      console.warn("IndexedDB initialization threw exception, falling back to LocalStorage/memory store:", e);
      useFallbackStore = true;
      resolve(null);
    }
  });
};

// --- Grammar Pages Operations ---

export const getAllPages = async (): Promise<GrammarPage[]> => {
  const db = await openDB();
  if (!db || useFallbackStore) {
    return memoryStore[STORE_NAME_PAGES];
  }

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME_PAGES, 'readonly');
      const store = transaction.objectStore(STORE_NAME_PAGES);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => {
        console.warn("IndexedDB getAllPages failed, using fallback:", request.error);
        resolve(memoryStore[STORE_NAME_PAGES]);
      };
    } catch (e) {
      console.warn("IndexedDB getAllPages exception, using fallback:", e);
      resolve(memoryStore[STORE_NAME_PAGES]);
    }
  });
};

export const savePage = async (page: GrammarPage): Promise<void> => {
  // Always update memory store
  const index = memoryStore[STORE_NAME_PAGES].findIndex(p => p.id === page.id);
  if (index >= 0) {
    memoryStore[STORE_NAME_PAGES][index] = page;
  } else {
    memoryStore[STORE_NAME_PAGES].push(page);
  }
  saveFallback(STORE_NAME_PAGES, memoryStore[STORE_NAME_PAGES]);

  const db = await openDB();
  if (!db || useFallbackStore) return;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME_PAGES, 'readwrite');
      const store = transaction.objectStore(STORE_NAME_PAGES);
      const request = store.put(page);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.warn("IndexedDB savePage failed:", request.error);
        resolve();
      };
    } catch (e) {
      console.warn("IndexedDB savePage exception:", e);
      resolve();
    }
  });
};

export const deletePage = async (id: string): Promise<void> => {
  // Always update memory store
  memoryStore[STORE_NAME_PAGES] = memoryStore[STORE_NAME_PAGES].filter(p => p.id !== id);
  saveFallback(STORE_NAME_PAGES, memoryStore[STORE_NAME_PAGES]);

  const db = await openDB();
  if (!db || useFallbackStore) return;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME_PAGES, 'readwrite');
      const store = transaction.objectStore(STORE_NAME_PAGES);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.warn("IndexedDB deletePage failed:", request.error);
        resolve();
      };
    } catch (e) {
      console.warn("IndexedDB deletePage exception:", e);
      resolve();
    }
  });
};

// --- Mistake Logs Operations ---

export const getAllMistakes = async (): Promise<MistakeLog[]> => {
  const db = await openDB();
  if (!db || useFallbackStore) {
    return [...memoryStore[STORE_NAME_MISTAKES]].reverse();
  }

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME_MISTAKES, 'readonly');
      const store = transaction.objectStore(STORE_NAME_MISTAKES);
      const index = store.index('createdAt');
      const request = index.getAll(); 

      request.onsuccess = () => {
        const results = request.result || [];
        resolve(results.reverse()); // Newest first
      };
      request.onerror = () => {
        console.warn("IndexedDB getAllMistakes failed, using fallback:", request.error);
        resolve([...memoryStore[STORE_NAME_MISTAKES]].reverse());
      };
    } catch (e) {
      console.warn("IndexedDB getAllMistakes exception, using fallback:", e);
      resolve([...memoryStore[STORE_NAME_MISTAKES]].reverse());
    }
  });
};

export const saveMistake = async (log: MistakeLog): Promise<void> => {
  // Always update memory store
  const index = memoryStore[STORE_NAME_MISTAKES].findIndex(m => m.id === log.id);
  if (index >= 0) {
    memoryStore[STORE_NAME_MISTAKES][index] = log;
  } else {
    memoryStore[STORE_NAME_MISTAKES].push(log);
  }
  saveFallback(STORE_NAME_MISTAKES, memoryStore[STORE_NAME_MISTAKES]);

  const db = await openDB();
  if (!db || useFallbackStore) return;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME_MISTAKES, 'readwrite');
      const store = transaction.objectStore(STORE_NAME_MISTAKES);
      const request = store.put(log);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.warn("IndexedDB saveMistake failed:", request.error);
        resolve();
      };
    } catch (e) {
      console.warn("IndexedDB saveMistake exception:", e);
      resolve();
    }
  });
};

export const deleteMistake = async (id: string): Promise<void> => {
  // Always update memory store
  memoryStore[STORE_NAME_MISTAKES] = memoryStore[STORE_NAME_MISTAKES].filter(m => m.id !== id);
  saveFallback(STORE_NAME_MISTAKES, memoryStore[STORE_NAME_MISTAKES]);

  const db = await openDB();
  if (!db || useFallbackStore) return;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME_MISTAKES, 'readwrite');
      const store = transaction.objectStore(STORE_NAME_MISTAKES);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.warn("IndexedDB deleteMistake failed:", request.error);
        resolve();
      };
    } catch (e) {
      console.warn("IndexedDB deleteMistake exception:", e);
      resolve();
    }
  });
};

// --- Favorite Words Operations ---

export const getFavorites = async (datasetKey: string): Promise<number[]> => {
  const db = await openDB();
  if (!db || useFallbackStore) {
    return memoryStore[STORE_NAME_FAVORITES]
      .filter((r: any) => r.datasetKey === datasetKey)
      .map((r: any) => r.id);
  }

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME_FAVORITES, 'readonly');
      const store = transaction.objectStore(STORE_NAME_FAVORITES);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result || [];
        resolve(results.filter((r: any) => r.datasetKey === datasetKey).map((r: any) => r.id));
      };
      request.onerror = () => {
        console.warn("IndexedDB getFavorites failed, using fallback:", request.error);
        resolve(memoryStore[STORE_NAME_FAVORITES]
          .filter((r: any) => r.datasetKey === datasetKey)
          .map((r: any) => r.id));
      };
    } catch (e) {
      console.warn("IndexedDB getFavorites exception, using fallback:", e);
      resolve(memoryStore[STORE_NAME_FAVORITES]
        .filter((r: any) => r.datasetKey === datasetKey)
        .map((r: any) => r.id));
    }
  });
};

export const addFavorite = async (datasetKey: string, id: number): Promise<void> => {
  // Always update memory store
  const alreadyExists = memoryStore[STORE_NAME_FAVORITES].some(f => f.datasetKey === datasetKey && f.id === id);
  if (!alreadyExists) {
    memoryStore[STORE_NAME_FAVORITES].push({ datasetKey, id });
    saveFallback(STORE_NAME_FAVORITES, memoryStore[STORE_NAME_FAVORITES]);
  }

  const db = await openDB();
  if (!db || useFallbackStore) return;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME_FAVORITES, 'readwrite');
      const store = transaction.objectStore(STORE_NAME_FAVORITES);
      const request = store.put({ datasetKey, id });

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.warn("IndexedDB addFavorite failed:", request.error);
        resolve();
      };
    } catch (e) {
      console.warn("IndexedDB addFavorite exception:", e);
      resolve();
    }
  });
};

export const removeFavorite = async (datasetKey: string, id: number): Promise<void> => {
  // Always update memory store
  memoryStore[STORE_NAME_FAVORITES] = memoryStore[STORE_NAME_FAVORITES].filter(f => !(f.datasetKey === datasetKey && f.id === id));
  saveFallback(STORE_NAME_FAVORITES, memoryStore[STORE_NAME_FAVORITES]);

  const db = await openDB();
  if (!db || useFallbackStore) return;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME_FAVORITES, 'readwrite');
      const store = transaction.objectStore(STORE_NAME_FAVORITES);
      const request = store.delete([datasetKey, id]);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.warn("IndexedDB removeFavorite failed:", request.error);
        resolve();
      };
    } catch (e) {
      console.warn("IndexedDB removeFavorite exception:", e);
      resolve();
    }
  });
};

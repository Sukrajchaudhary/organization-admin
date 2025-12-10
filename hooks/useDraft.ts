"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { UseFormReturn, FieldValues, DefaultValues } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

const DB_NAME = "AppDraftsDB";
const STORE_NAME = "form_drafts";

interface DraftEntry<T> {
  key: string;
  data: T;
  updatedAt: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("IndexedDB is not available server-side"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

interface UseDraftOptions<T> {
  serverData?: T;
}

export function useDraft<T extends FieldValues>(
  form: UseFormReturn<T>,
  key: string,
  options: UseDraftOptions<T> = {}
) {
  const { serverData } = options;
  const { toast } = useToast();
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const isMounted = useRef(false);

  // Initialize DB and Load Draft
  useEffect(() => {
    isMounted.current = true;
    let isActive = true;

    const load = async () => {
      try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
          if (!isActive) return;
          
          if (request.result && request.result.data) {
            console.log(`[useDraft] Draft found for ${key}`, request.result.data);
            form.reset(request.result.data as DefaultValues<T>);
            setHasDraft(true);
            toast({
              title: "Draft Restored",
              description: "Your unsaved changes have been restored.",
            });
          } else {
             // No draft found
             setHasDraft(false);
             // If we have server data immediately available (likely not on first render if fetching)
             if (serverData) {
                 form.reset(serverData as DefaultValues<T>);
             }
          }
          setIsDraftLoaded(true);
        };
        
        request.onerror = (e) => {
           console.error("Error fetching draft:", e);
           if (isActive) setIsDraftLoaded(true);
        };
      } catch (err) {
        console.error("Failed to load draft", err);
        if (isActive) setIsDraftLoaded(true);
      }
    };

    load();

    return () => {
      isActive = false;
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // We only want to run this initial load once per key

  // Handle Server Data Updates (if no draft)
  useEffect(() => {
      if (isDraftLoaded && !hasDraft && serverData) {
          console.log(`[useDraft] Syncing with server data for ${key}`);
          form.reset(serverData as DefaultValues<T>);
      }
  }, [serverData, hasDraft, isDraftLoaded, form, key]);

  // Save Draft (Watch changes)
  const saveDraft = useCallback(
    async (data: T) => {
      try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        store.put({ key, data, updatedAt: Date.now() });
      } catch (err) {
        console.error("Failed to save draft", err);
      }
    },
    [key]
  );

  useEffect(() => {
    if (!isDraftLoaded) return; // Don't start watching until we've attempted to load

    const subscription = form.watch((value) => {
      // Debounce saving
      const handler = setTimeout(() => {
          if (isMounted.current) {
             saveDraft(value as T);
          }
      }, 1000); // 1 second debounce
      return () => clearTimeout(handler);
    });

    return () => subscription.unsubscribe();
  }, [form, saveDraft, isDraftLoaded]);

  const clearDraft = useCallback(async () => {
    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.delete(key);
      setHasDraft(false); // Update state so server data can take over if needed
    } catch (err) {
      console.error("Failed to clear draft", err);
    }
  }, [key]);

  return {
    clearDraft,
    isLoading: !isDraftLoaded
  };
}

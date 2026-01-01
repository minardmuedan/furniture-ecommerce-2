import React, { useState, useEffect, useRef, useCallback } from 'react';

// Global cache to store fetched data across components
const cache = new Map();
const subscribers = new Map();

function useSWR(key, fetcher, options = {}) {
  const {
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    dedupingInterval = 2000,
    refreshInterval = 0,
  } = options;

  const [data, setData] = useState(() => cache.get(key)?.data);
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const fetcherRef = useRef(fetcher);
  const lastFetchTime = useRef(0);
  const mountedRef = useRef(true);

  fetcherRef.current = fetcher;

  const revalidate = useCallback(async (forceRefetch = false) => {
    if (!key) return;

    const now = Date.now();
    
    // Deduplication: prevent multiple fetches within the deduping interval
    if (!forceRefetch && now - lastFetchTime.current < dedupingInterval) {
      return;
    }

    lastFetchTime.current = now;
    setIsValidating(true);

    try {
      const result = await fetcherRef.current(key);
      
      if (mountedRef.current) {
        // Update cache
        cache.set(key, { data: result, error: null });
        
        // Notify all subscribers
        const subs = subscribers.get(key) || new Set();
        subs.forEach(cb => cb({ data: result, error: null }));
      }
    } catch (err) {
      if (mountedRef.current) {
        cache.set(key, { data: cache.get(key)?.data, error: err });
        
        const subs = subscribers.get(key) || new Set();
        subs.forEach(cb => cb({ data: cache.get(key)?.data, error: err }));
      }
    } finally {
      if (mountedRef.current) {
        setIsValidating(false);
      }
    }
  }, [key, dedupingInterval]);

  // Subscribe to cache updates
  useEffect(() => {
    if (!key) return;

    const handleUpdate = ({ data, error }) => {
      setData(data);
      setError(error);
    };

    if (!subscribers.has(key)) {
      subscribers.set(key, new Set());
    }
    subscribers.get(key).add(handleUpdate);

    return () => {
      subscribers.get(key)?.delete(handleUpdate);
      if (subscribers.get(key)?.size === 0) {
        subscribers.delete(key);
      }
    };
  }, [key]);

  // Initial fetch
  useEffect(() => {
    if (!key) return;

    const cached = cache.get(key);
    
    if (cached) {
      setData(cached.data);
      setError(cached.error);
    }

    // Always revalidate on mount
    revalidate(true);
  }, [key, revalidate]);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus || !key) return;

    const handleFocus = () => revalidate();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidateOnFocus, key, revalidate]);

  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect || !key) return;

    const handleOnline = () => revalidate();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [revalidateOnReconnect, key, revalidate]);

  // Polling interval
  useEffect(() => {
    if (!refreshInterval || !key) return;

    const interval = setInterval(() => revalidate(), refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, key, revalidate]);

  // Cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback((newData) => {
    if (!key) return;

    const updatedData = typeof newData === 'function' 
      ? newData(cache.get(key)?.data) 
      : newData;

    cache.set(key, { data: updatedData, error: null });
    
    const subs = subscribers.get(key) || new Set();
    subs.forEach(cb => cb({ data: updatedData, error: null }));
  }, [key]);

  return {
    data,
    error,
    isValidating,
    mutate,
    revalidate: () => revalidate(true),
  };
}

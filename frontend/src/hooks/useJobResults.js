/**
 * Custom Hook: useJobResults
 * Manages fetching and caching job results
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { jobsApi } from '../services/api';
import { handleApiError } from '../utils/errorHandler';

export function useJobResults(jobId, options = {}) {
  const {
    enabled = true,
    onSuccess = null,
    onError = null,
  } = options;

  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isMountedRef = useRef(true);
  const cacheRef = useRef({});

  const fetchResults = useCallback(async () => {
    if (!jobId || !enabled) {
      setIsLoading(false);
      return;
    }

    // Check cache first
    if (cacheRef.current[jobId]) {
      setCandidates(cacheRef.current[jobId]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await jobsApi.getResults(jobId);
      
      if (!isMountedRef.current) return;

      const fetchedCandidates = response.data.candidates || [];
      setCandidates(fetchedCandidates);
      setError(null);

      // Cache results
      cacheRef.current[jobId] = fetchedCandidates;

      if (onSuccess) {
        onSuccess(fetchedCandidates);
      }

      setIsLoading(false);
    } catch (err) {
      if (!isMountedRef.current) return;

      const appError = handleApiError(err, { jobId });
      setError(appError);
      setIsLoading(false);

      if (onError) {
        onError(appError);
      }
    }
  }, [jobId, enabled, onSuccess, onError]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchResults();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchResults]);

  const refetch = useCallback(() => {
    // Clear cache for this job
    delete cacheRef.current[jobId];
    fetchResults();
  }, [jobId, fetchResults]);

  return {
    candidates,
    isLoading,
    error,
    refetch,
  };
}

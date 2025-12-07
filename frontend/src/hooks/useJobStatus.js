/**
 * Custom Hook: useJobStatus
 * Manages job status polling and state
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { jobsApi } from '../services/api';
import { JOB_STATUS, UI_CONFIG } from '../constants';
import { handleApiError } from '../utils/errorHandler';

export function useJobStatus(jobId, options = {}) {
  const {
    enabled = true,
    pollingInterval = UI_CONFIG.POLLING_INTERVAL,
    onComplete = null,
    onError = null,
  } = options;

  const [status, setStatus] = useState(null);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchStatus = useCallback(async () => {
    if (!jobId || !enabled) return;

    try {
      const response = await jobsApi.getStatus(jobId);
      
      if (!isMountedRef.current) return;

      const data = response.data;
      setStatus(data.status);
      setAgents(data.perAgentStatus || []);
      setError(null);

      // Check if job is complete
      if (data.status === JOB_STATUS.COMPLETED && onComplete) {
        onComplete(data);
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
  }, [jobId, enabled, onComplete, onError]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!jobId || !enabled) {
      setIsLoading(false);
      return;
    }

    // Initial fetch
    fetchStatus();

    // Set up polling
    intervalRef.current = setInterval(fetchStatus, pollingInterval);

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [jobId, enabled, pollingInterval, fetchStatus]);

  const refetch = useCallback(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    agents,
    isLoading,
    error,
    refetch,
  };
}

// Utility functions for managing EYAI platform data in localStorage

/**
 * Save a job to history
 */
export function saveJobToHistory(jobData) {
    try {
        const { jobId, query, candidatesCount = 0, status = 'completed' } = jobData;

        const job = {
            id: jobId,
            query,
            timestamp: new Date().toLocaleString(),
            candidatesCount,
            status
        };

        // Get existing history
        const historyJson = localStorage.getItem('eyai_job_history');
        let history = historyJson ? JSON.parse(historyJson) : [];

        // Check if job already exists
        const existingIndex = history.findIndex(j => j.id === jobId);
        if (existingIndex >= 0) {
            // Update existing job
            history[existingIndex] = job;
        } else {
            // Add new job to beginning
            history = [job, ...history];
        }

        // Keep only last 20 jobs
        history = history.slice(0, 20);

        // Save back to localStorage
        localStorage.setItem('eyai_job_history', JSON.stringify(history));

        return true;
    } catch (error) {
        console.error('Failed to save job to history:', error);
        return false;
    }
}

/**
 * Get all jobs from history
 */
export function getJobHistory() {
    try {
        const historyJson = localStorage.getItem('eyai_job_history');
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error('Failed to load job history:', error);
        return [];
    }
}

/**
 * Save an export to history
 */
export function saveExportToHistory(exportData) {
    try {
        const { jobId, format, size } = exportData;

        const exportRecord = {
            id: `EXP${Date.now()}`,
            jobId,
            format,
            timestamp: new Date().toLocaleString(),
            size
        };

        // Get existing history
        const historyJson = localStorage.getItem('eyai_export_history');
        let history = historyJson ? JSON.parse(historyJson) : [];

        // Add new export to beginning
        history = [exportRecord, ...history];

        // Keep only last 50 exports
        history = history.slice(0, 50);

        // Save back to localStorage
        localStorage.setItem('eyai_export_history', JSON.stringify(history));

        return exportRecord;
    } catch (error) {
        console.error('Failed to save export to history:', error);
        return null;
    }
}

/**
 * Get all exports from history
 */
export function getExportHistory() {
    try {
        const historyJson = localStorage.getItem('eyai_export_history');
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error('Failed to load export history:', error);
        return [];
    }
}

/**
 * Clear all history (for testing/reset)
 */
export function clearAllHistory() {
    try {
        localStorage.removeItem('eyai_job_history');
        localStorage.removeItem('eyai_export_history');
        return true;
    } catch (error) {
        console.error('Failed to clear history:', error);
        return false;
    }
}

/**
 * Get statistics from history
 */
export function getHistoryStats() {
    try {
        const jobs = getJobHistory();
        const exports = getExportHistory();

        return {
            totalJobs: jobs.length,
            totalExports: exports.length,
            recentActivity: jobs.length > 0 ? jobs[0].timestamp : 'No activity',
            mostExportedFormat: getMostExportedFormat(exports)
        };
    } catch (error) {
        console.error('Failed to get history stats:', error);
        return {
            totalJobs: 0,
            totalExports: 0,
            recentActivity: 'N/A',
            mostExportedFormat: 'N/A'
        };
    }
}

function getMostExportedFormat(exports) {
    if (exports.length === 0) return 'N/A';

    const formatCounts = exports.reduce((acc, exp) => {
        acc[exp.format] = (acc[exp.format] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(formatCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
}

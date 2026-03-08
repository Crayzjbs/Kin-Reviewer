'use client';

import { useEffect, useState } from 'react';

interface StorageLimitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  canProceed: boolean;
}

export function StorageLimitDialog({ isOpen, onClose, message, canProceed }: StorageLimitDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start mb-4">
          <div className={`flex-shrink-0 ${canProceed ? 'text-yellow-500' : 'text-red-500'}`}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-lg font-medium ${canProceed ? 'text-yellow-800' : 'text-red-800'}`}>
              {canProceed ? 'Storage Warning' : 'Storage Limit Reached'}
            </h3>
            <div className="mt-2 text-sm text-gray-700">
              <p>{message}</p>
              {!canProceed && (
                <p className="mt-2 font-semibold">
                  Cannot save anymore data to stay within the free tier limits.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              canProceed 
                ? 'bg-yellow-600 hover:bg-yellow-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

interface StorageStatusBadgeProps {
  className?: string;
}

export function StorageStatusBadge({ className = '' }: StorageStatusBadgeProps) {
  const [storageInfo, setStorageInfo] = useState<{
    percentageUsed: number;
    databaseSizeMB: number;
    maxDatabaseSizeMB: number;
  } | null>(null);

  useEffect(() => {
    async function checkStorage() {
      try {
        const response = await fetch('/api/storage-limits');
        const data = await response.json();
        setStorageInfo(data);
      } catch (error) {
        console.error('Failed to check storage:', error);
      }
    }

    checkStorage();
    const interval = setInterval(checkStorage, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (!storageInfo) return null;

  const { percentageUsed, databaseSizeMB, maxDatabaseSizeMB } = storageInfo;

  let badgeColor = 'bg-green-100 text-green-800';
  if (percentageUsed >= 95) {
    badgeColor = 'bg-red-100 text-red-800';
  } else if (percentageUsed >= 80) {
    badgeColor = 'bg-yellow-100 text-yellow-800';
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badgeColor} ${className}`}>
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
        <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
        <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
      </svg>
      Storage: {databaseSizeMB.toFixed(1)}MB / {maxDatabaseSizeMB}MB ({percentageUsed.toFixed(1)}%)
    </div>
  );
}

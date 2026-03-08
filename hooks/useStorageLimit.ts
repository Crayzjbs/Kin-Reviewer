'use client';

import { useState, useCallback } from 'react';

interface UseStorageLimitReturn {
  isDialogOpen: boolean;
  dialogMessage: string;
  canProceed: boolean;
  showDialog: (message: string, canProceed: boolean) => void;
  closeDialog: () => void;
  checkAndSave: <T>(saveFunction: () => Promise<T>) => Promise<T | null>;
}

export function useStorageLimit(): UseStorageLimitReturn {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [canProceed, setCanProceed] = useState(true);

  const showDialog = useCallback((message: string, canProceed: boolean) => {
    setDialogMessage(message);
    setCanProceed(canProceed);
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const checkAndSave = useCallback(async <T,>(saveFunction: () => Promise<T>): Promise<T | null> => {
    try {
      const result = await saveFunction();
      return result;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Storage limit')) {
        showDialog(error.message, false);
        return null;
      }
      throw error;
    }
  }, [showDialog]);

  return {
    isDialogOpen,
    dialogMessage,
    canProceed,
    showDialog,
    closeDialog,
    checkAndSave
  };
}

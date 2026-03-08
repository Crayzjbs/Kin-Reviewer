import { supabase } from './supabase';

export interface StorageLimits {
  databaseSizeMB: number;
  maxDatabaseSizeMB: number;
  percentageUsed: number;
  canSave: boolean;
  warningMessage?: string;
}

const FREE_TIER_LIMIT_MB = 500;
const WARNING_THRESHOLD_PERCENT = 80; // Warn at 80% usage
const CRITICAL_THRESHOLD_PERCENT = 95; // Block at 95% usage

export async function checkStorageLimits(): Promise<StorageLimits> {
  try {
    // Query to get approximate database size
    const { data: tablesData, error: tablesError } = await supabase.rpc(
      'get_database_size'
    );

    if (tablesError) {
      // If custom function doesn't exist, estimate based on row counts
      return await estimateDatabaseSize();
    }

    const databaseSizeMB = tablesData || 0;
    const percentageUsed = (databaseSizeMB / FREE_TIER_LIMIT_MB) * 100;
    const canSave = percentageUsed < CRITICAL_THRESHOLD_PERCENT;

    let warningMessage: string | undefined;
    
    if (percentageUsed >= CRITICAL_THRESHOLD_PERCENT) {
      warningMessage = `Database storage is at ${percentageUsed.toFixed(1)}% capacity. Cannot save new data to stay within free tier limits.`;
    } else if (percentageUsed >= WARNING_THRESHOLD_PERCENT) {
      warningMessage = `Warning: Database storage is at ${percentageUsed.toFixed(1)}% capacity. Approaching free tier limit of ${FREE_TIER_LIMIT_MB}MB.`;
    }

    return {
      databaseSizeMB,
      maxDatabaseSizeMB: FREE_TIER_LIMIT_MB,
      percentageUsed,
      canSave,
      warningMessage
    };
  } catch (error) {
    console.error('Error checking storage limits:', error);
    return await estimateDatabaseSize();
  }
}

async function estimateDatabaseSize(): Promise<StorageLimits> {
  try {
    const { count: topicsCount } = await supabase
      .from('topics')
      .select('*', { count: 'exact', head: true });

    const { count: questionsCount } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    const { count: reviewCardsCount } = await supabase
      .from('review_cards')
      .select('*', { count: 'exact', head: true });

    const { count: analogiesCount } = await supabase
      .from('analogies')
      .select('*', { count: 'exact', head: true });

    const { count: answerKeysCount } = await supabase
      .from('answer_keys')
      .select('*', { count: 'exact', head: true });

    // Rough estimation: 
    // - Each topic: ~0.5 KB
    // - Each question: ~1 KB (with options)
    // - Each review card: ~0.3 KB
    // - Each analogy: ~1 KB
    // - Each answer key: ~2 KB
    const estimatedSizeKB = 
      (topicsCount || 0) * 0.5 +
      (questionsCount || 0) * 1 +
      (reviewCardsCount || 0) * 0.3 +
      (analogiesCount || 0) * 1 +
      (answerKeysCount || 0) * 2;

    const databaseSizeMB = estimatedSizeKB / 1024;
    const percentageUsed = (databaseSizeMB / FREE_TIER_LIMIT_MB) * 100;
    const canSave = percentageUsed < CRITICAL_THRESHOLD_PERCENT;

    let warningMessage: string | undefined;
    
    if (percentageUsed >= CRITICAL_THRESHOLD_PERCENT) {
      warningMessage = `Database storage is at ${percentageUsed.toFixed(1)}% capacity (estimated ${databaseSizeMB.toFixed(1)}MB / ${FREE_TIER_LIMIT_MB}MB). Cannot save new data to stay within free tier limits.`;
    } else if (percentageUsed >= WARNING_THRESHOLD_PERCENT) {
      warningMessage = `Warning: Database storage is at ${percentageUsed.toFixed(1)}% capacity (estimated ${databaseSizeMB.toFixed(1)}MB / ${FREE_TIER_LIMIT_MB}MB). Approaching free tier limit.`;
    }

    return {
      databaseSizeMB,
      maxDatabaseSizeMB: FREE_TIER_LIMIT_MB,
      percentageUsed,
      canSave,
      warningMessage
    };
  } catch (error) {
    console.error('Error estimating database size:', error);
    // If we can't check, allow saving but warn
    return {
      databaseSizeMB: 0,
      maxDatabaseSizeMB: FREE_TIER_LIMIT_MB,
      percentageUsed: 0,
      canSave: true,
      warningMessage: 'Unable to check storage limits. Proceed with caution.'
    };
  }
}

export async function validateBeforeSave(operationName: string = 'save'): Promise<{ canProceed: boolean; message?: string }> {
  const limits = await checkStorageLimits();
  
  if (!limits.canSave) {
    return {
      canProceed: false,
      message: limits.warningMessage || 'Cannot save: Database storage limit reached.'
    };
  }
  
  if (limits.warningMessage) {
    console.warn(limits.warningMessage);
  }
  
  return { canProceed: true };
}

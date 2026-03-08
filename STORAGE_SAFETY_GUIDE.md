# Storage Safety Guide

## Overview
This system prevents your Supabase database from exceeding the **500MB free tier limit** by checking storage usage before every save operation.

## How It Works

### 1. Automatic Validation
Every save operation (topics, questions, review cards, analogies, answer keys) automatically checks storage limits before writing to the database.

### 2. Three-Tier Protection

#### **Green Zone (0-79% usage)**
- ✅ All operations work normally
- No warnings shown

#### **Yellow Zone (80-94% usage)**
- ⚠️ Warning message shown in console
- Operations still allowed
- Badge shows yellow color

#### **Red Zone (95-100% usage)**
- 🛑 **Save operations blocked**
- Dialog shows: "Cannot save anymore"
- Badge shows red color
- **No charges will occur**

## Components Created

### 1. **Storage Limit Checker** (`lib/supabase-limits.ts`)
- Estimates database size based on row counts
- Calculates percentage of free tier used
- Returns whether save operations can proceed

### 2. **Storage Limit Dialog** (`components/StorageLimitDialog.tsx`)
- Shows warning/error messages
- Blocks user from saving when limit reached
- Visual feedback with color coding

### 3. **Storage Status Badge** (`components/StorageLimitDialog.tsx`)
- Real-time storage usage display
- Updates every minute
- Color-coded (green/yellow/red)

### 4. **Storage Limit Hook** (`hooks/useStorageLimit.ts`)
- Easy integration into any component
- Handles errors automatically
- Shows dialog when limit reached

### 5. **API Endpoint** (`app/api/storage-limits/route.ts`)
- Provides storage info to frontend
- Used by the status badge

## Usage Examples

### Example 1: Using in a Component

```tsx
'use client';

import { useState } from 'react';
import { useStorageLimit } from '@/hooks/useStorageLimit';
import { StorageLimitDialog } from '@/components/StorageLimitDialog';
import { supabaseStorage } from '@/lib/supabase-storage';

export default function MyComponent() {
  const { isDialogOpen, dialogMessage, canProceed, closeDialog, checkAndSave } = useStorageLimit();

  const handleSave = async () => {
    const result = await checkAndSave(async () => {
      // Your save logic here
      await supabaseStorage.saveTopics(topics);
      return true;
    });

    if (result) {
      console.log('Saved successfully!');
    } else {
      console.log('Save blocked due to storage limit');
    }
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      
      <StorageLimitDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        message={dialogMessage}
        canProceed={canProceed}
      />
    </>
  );
}
```

### Example 2: Adding Storage Badge to Layout

```tsx
import { StorageStatusBadge } from '@/components/StorageLimitDialog';

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <h1>My App</h1>
        <StorageStatusBadge className="ml-auto" />
      </header>
      {children}
    </div>
  );
}
```

### Example 3: Direct Save (Already Protected)

```tsx
// This is already protected - no extra code needed!
import { supabaseStorage } from '@/lib/supabase-storage';

try {
  await supabaseStorage.saveQuestions(questions);
  // Success!
} catch (error) {
  if (error.message.includes('Storage limit')) {
    alert('Cannot save: Storage limit reached');
  }
}
```

## What Happens When Limit is Reached?

1. **User tries to save data**
2. **System checks storage usage**
3. **If at 95% or higher:**
   - Save operation is blocked
   - Error is thrown with message
   - Dialog appears: "Cannot save anymore"
   - Data is NOT sent to Supabase
   - **No charges occur**

## Monitoring Your Storage

### Option 1: Storage Badge
Add `<StorageStatusBadge />` to your layout to see real-time usage.

### Option 2: Supabase Dashboard
Visit https://app.supabase.com and check your project's database size.

### Option 3: API Endpoint
```bash
GET /api/storage-limits
```

Returns:
```json
{
  "databaseSizeMB": 45.2,
  "maxDatabaseSizeMB": 500,
  "percentageUsed": 9.04,
  "canSave": true,
  "warningMessage": null
}
```

## Customizing Limits

Edit `lib/supabase-limits.ts` to change thresholds:

```typescript
const FREE_TIER_LIMIT_MB = 500;        // Maximum database size
const WARNING_THRESHOLD_PERCENT = 80;  // Show warning at 80%
const CRITICAL_THRESHOLD_PERCENT = 95; // Block saves at 95%
```

## Size Estimates

Based on the STANDARDS_CODE_REVIEWER import:
- **6,614 questions** ≈ 6.6 MB
- **11 topics** ≈ 0.01 MB
- **Total** ≈ 6.6 MB (1.3% of free tier)

You can safely store approximately **75,000+ questions** before reaching the limit.

## Important Notes

1. ✅ **All save operations are automatically protected** - no extra code needed
2. ✅ **No surprise bills** - saves are blocked before hitting the limit
3. ✅ **Visual feedback** - users see clear messages when limit is reached
4. ⚠️ **Estimates only** - actual database size may vary slightly
5. 💡 **Free tier pauses after 7 days of inactivity** - but your data is safe

## Troubleshooting

### "Cannot save anymore" appears but database seems small
- The estimation might be conservative
- Check actual size in Supabase dashboard
- Adjust `CRITICAL_THRESHOLD_PERCENT` if needed

### Storage badge not showing
- Ensure `.env.local` has correct Supabase credentials
- Check browser console for errors
- Verify API endpoint is accessible

### False positives
- Clear old/unused data from database
- Optimize large text fields
- Consider archiving old review cards

## Summary

✅ **Automatic protection on all saves**  
✅ **Clear visual warnings**  
✅ **No unexpected charges**  
✅ **Easy to monitor**  
✅ **Customizable thresholds**  

You can now use your review website without worrying about waking up to a bill! 🎉

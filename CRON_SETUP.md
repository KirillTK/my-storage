# Cron Job Setup - Document Cleanup

This project includes an automated cleanup cron job that runs every 10 minutes to permanently remove soft-deleted documents from both the database and Vercel Blob storage.

## How It Works

The cron job:
1. Finds all documents in the database where `deletedAt` is NOT `null` (soft-deleted documents)
2. Deletes the associated files from Vercel Blob storage
3. Permanently removes the database records (hard delete)
4. Logs the results for monitoring

## Configuration

### 1. Vercel Cron Schedule

The cron schedule is defined in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

**Schedule Format:** `*/10 * * * *` means "every 10 minutes"

To change the frequency, modify the cron expression:
- `*/5 * * * *` - Every 5 minutes
- `*/15 * * * *` - Every 15 minutes
- `0 * * * *` - Every hour
- `0 0 * * *` - Every day at midnight

### 2. Environment Variables

Add the following environment variable to your Vercel project:

```bash
CRON_SECRET=your-secret-key-here
```

**To set this in Vercel:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `CRON_SECRET` with a strong random value
4. Redeploy your application

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### 3. Local Development

For local testing, add `CRON_SECRET` to your `.env` file (optional for development):

```bash
CRON_SECRET=dev-secret-key
```

## API Endpoint

### `/api/cron/cleanup`

**Methods:** GET, POST

**Authentication:** Requires `Authorization: Bearer {CRON_SECRET}` header in production

**Response:**
```json
{
  "success": true,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "result": {
    "success": true,
    "deletedCount": 5,
    "errorCount": 0,
    "message": "Cleanup completed. Deleted 5 documents"
  }
}
```

## Manual Testing

### Test locally:
```bash
curl http://localhost:3000/api/cron/cleanup
```

### Test on Vercel (with authentication):
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-app.vercel.app/api/cron/cleanup
```

### Using the npm script:
```bash
npm run cron:test
```

## Files Created

1. **`src/server/actions/cleanup.actions.ts`** - Server action that performs the cleanup
2. **`src/app/api/cron/cleanup/route.ts`** - API route handler for the cron job
3. **`vercel.json`** - Vercel configuration with cron schedule
4. **`src/env.js`** - Updated to include CRON_SECRET validation

## Monitoring

Check your Vercel deployment logs to monitor cron job execution:

1. Go to Vercel Dashboard
2. Select your project
3. Navigate to "Deployments" → Select a deployment
4. Click on "Functions" → Find `/api/cron/cleanup`
5. View execution logs

Logs will show:
- `[Cleanup] Starting cleanup of soft-deleted documents...`
- `[Cleanup] Found X soft-deleted documents`
- `[Cleanup] Deleted blob: {url}`
- `[Cleanup] Successfully permanently deleted soft-deleted document: {id} ({name})`
- `[Cleanup] Cleanup completed. Success: X, Errors: Y`

## Troubleshooting

### Cron job not running
1. Verify `vercel.json` is in the project root
2. Ensure the project is deployed to Vercel (cron jobs only work in production)
3. Check that you're on a Pro or higher Vercel plan (required for cron jobs)

### Authentication errors
1. Verify `CRON_SECRET` is set in Vercel environment variables
2. Ensure the secret matches between Vercel and your request
3. Redeploy after adding environment variables

### Documents not being deleted
1. Check Vercel function logs for errors
2. Verify database connection
3. Ensure `BLOB_READ_WRITE_TOKEN` has delete permissions
4. Check if documents actually have non-null `deletedAt` values (soft-deleted)

## Security Considerations

- The cron endpoint is protected with a secret in production
- Only Vercel Cron jobs should have access to this secret
- Never expose `CRON_SECRET` in your codebase
- Regularly rotate the `CRON_SECRET` for security

## How Soft Delete Works

When a user deletes a document in the app, it's "soft deleted" - the `deletedAt` timestamp is set, but the document and file remain in the system. This cron job permanently removes these soft-deleted documents after they've been marked for deletion.


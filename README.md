This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Troubleshooting: Tailwind CSS Configuration Issues

During initial development, we faced a persistent issue where Tailwind CSS styles were not being applied, resulting in an unformatted page despite the configurations appearing correct. After extensive debugging, the root cause was identified as a syntax conflict in the PostCSS configuration file.

### Symptoms

- The page rendered without any Tailwind styles (e.g., `bg-red-500`, `text-center` had no effect).
- No clear error messages were displayed in the terminal during the build (`npm run dev`).
- The `globals.css` import in `src/app/layout.js` was correct.
- The `tailwind.config.js` file was correctly configured with the content paths.

### Debugging Process

1.  **CSS Loading Test:** To verify if the `globals.css` file was being loaded, we added a pure CSS rule (`body { background-color: red !important; }`). The page turned red, confirming that the file was imported, but the `@tailwind` directives were not being processed.

2.  **Problem Isolation:** The test above isolated the failure to the PostCSS pipeline. PostCSS was not processing the Tailwind directives, which meant that utility classes were not being generated in the final CSS.

3.  **PostCSS Configuration Analysis:** The problem was traced to the `postcss.config.mjs` file. It contained `module.exports` syntax (CommonJS standard), but the `.mjs` extension forces Node.js to interpret the file as an ES Module, which expects `export default` syntax.

### Solution

The solution was to align the file name with its content's syntax:

1.  **Creating the Correct File:** A new file, `postcss.config.js`, was created with the correct configuration:
    ```javascript
    module.exports = {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    };
    ```

2.  **Removing the Conflicting File:** The original `postcss.config.mjs` file, which had the incorrect syntax for its extension, was removed.

After restarting the development server, Next.js correctly read the new `postcss.config.js` file, PostCSS processed the Tailwind directives, and the styles were applied successfully.

## Netlify Scheduled Functions Implementation Guide

This project uses Netlify Scheduled Functions to automate cleanup tasks. Here's a comprehensive guide for implementing scheduled functions in Netlify.

### Prerequisites

1. **Install Required Dependencies:**
   ```bash
   npm install @netlify/functions
   ```

2. **Ensure Environment Variables:**
   - All required environment variables must be configured in Netlify dashboard
   - Variables are automatically available in `process.env`

### File Structure

```
.netlify/functions/
├── your-scheduled-function.js    # CommonJS format
└── your-scheduled-function.mjs   # ES6 format (preferred)
```

### Implementation Steps

#### 1. Create the Function File

**Option A: ES6 Module (Recommended)**
```javascript
// .netlify/functions/your-function.mjs
import { createClient } from '@supabase/supabase-js';

export default async (req) => {
  console.error('🚀 Starting scheduled function...');
  
  // Your function logic here
  
  return { statusCode: 200, body: 'Success' };
};

export const config = {
  schedule: "@daily"  // or other cron expression
};
```

**Option B: CommonJS Module**
```javascript
// .netlify/functions/your-function.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  console.error('🚀 Starting scheduled function...');
  
  // Your function logic here
  
  return { statusCode: 200, body: 'Success' };
};

exports.config = {
  schedule: "@daily"
};
```

#### 2. Configure Schedule in netlify.toml

```toml
[functions]
directory = ".netlify/functions"

[functions."your-function"]
schedule = "@daily"
```

### Supported Schedule Formats

Netlify only supports these cron extensions:
- `@yearly`: once a year, on January 1st 00:00
- `@monthly`: every month, on the first day at 00:00
- `@weekly`: every Sunday at 00:00
- `@daily`: once a day at 00:00 (midnight UTC)
- `@hourly`: every hour at minute 0

**Note:** Custom cron expressions like `"0 3 * * *"` are NOT supported.

### Development and Testing

#### 1. Local Testing
```bash
# Start Netlify Dev
netlify dev

# Test function with debug logs
netlify functions:invoke your-function --port 8888 --debug
```

#### 2. Important Testing Notes
- **Logs Visibility:** Use `console.error()` instead of `console.log()` for better visibility
- **Debug Flag:** Always use `--debug` flag to see function output
- **No Direct URL Access:** Scheduled functions cannot be invoked via URL
- **Production Only:** Functions only run on published deploys, not previews

#### 3. Common Issues and Solutions

**Problem: Logs not appearing**
```javascript
// ❌ May be suppressed
console.log('Debug info');

// ✅ Always visible
console.error('Debug info');
```

**Problem: Function not found**
```bash
# Check available functions
netlify functions:list --port 8888
```

**Problem: Environment variables not available**
- Ensure variables are set in Netlify dashboard
- Variables are automatically injected, no `dotenv` needed

### Production Deployment

1. **Deploy to Production:**
   ```bash
   git push origin main
   ```

2. **Verify Configuration:**
   - Check Netlify dashboard → Functions → Scheduled
   - Function should appear with "Scheduled" badge
   - Verify next execution time

3. **Monitor Execution:**
   - View logs in Netlify dashboard
   - Check function execution history
   - Monitor for errors or timeouts

### Limitations and Best Practices

#### Limitations
- **30-second execution limit** for scheduled functions
- **No response streaming** (functions don't return response body)
- **UTC timezone only** (no custom timezone support)
- **No branch deploy support** (only runs on published deploys)

#### Best Practices
1. **Use Background Functions** for long-running tasks (>30 seconds)
2. **Implement proper error handling** and logging
3. **Test thoroughly** with `--debug` flag before deployment
4. **Monitor execution** in production dashboard
5. **Use descriptive function names** for easier management

### Example: PDF Cleanup Function

This project includes a cleanup function that removes old watermarked PDFs:

```javascript
// .netlify/functions/cleanup_supabase_watermarked.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'astronautbooks-pdfs';
const FOLDER = 'watermarked-pdfs/';
const DAYS_TO_KEEP = 7;

exports.handler = async (event, context) => {
  console.error('🚀 INICIANDO LIMPEZA DE ARQUIVOS SUPABASE');
  console.error('📅 Data/Hora:', new Date().toISOString());
  
  // Function logic here...
  
  return { statusCode: 200, body: `Limpeza concluída. ${deleted} arquivos deletados.` };
};

exports.config = {
  schedule: "@daily"
};
```

### Troubleshooting Checklist

- [ ] Function file exists in `.netlify/functions/`
- [ ] Schedule configured in `netlify.toml`
- [ ] Environment variables set in Netlify dashboard
- [ ] Function tested locally with `--debug` flag
- [ ] Deployed to production (not just preview)
- [ ] Function appears in Netlify dashboard with "Scheduled" badge
- [ ] Next execution time is visible in dashboard

### Resources

- [Netlify Scheduled Functions Documentation](https://docs.netlify.com/build/functions/scheduled-functions/)
- [Netlify Functions API Reference](https://docs.netlify.com/build/functions/api/)
- [Cron Expression Guide](https://crontab.guru/)

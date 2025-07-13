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

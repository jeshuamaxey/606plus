This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Sanity CMS Setup

This project includes Sanity CMS configured at `/cms`. To set it up:

1. Create a Sanity project at [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token_here
   ```
3. Replace `your_project_id_here` with your actual Sanity project ID
4. Get your API token from [https://www.sanity.io/manage](https://www.sanity.io/manage) (go to your project → API → Tokens → Add API token with Editor permissions)

The CMS includes four schemas:
- **Category**: For organizing items (name, slug)
- **Brand**: Brand information (name, logo)
- **Designer**: Designer information (name, image)
- **Item**: Catalogue items with fields:
  - number (#)
  - name
  - category (reference - required)
  - designer (reference - optional)
  - brand (reference - optional)
  - yearStart (optional)
  - yearEnd (optional)
  - description

### Populating the CMS

To populate the CMS with data from `vitsoe_catalogue.md`, run:

```bash
npm run populate-cms
```

This script will:
1. Parse the markdown file
2. Extract unique categories, brands, and designers
3. Create all documents in Sanity
4. Link items to their respective categories, designers, and brands

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

Access the Sanity CMS at [http://localhost:3000/cms](http://localhost:3000/cms) after setting up your environment variables.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

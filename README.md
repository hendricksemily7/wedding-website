This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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


## Notes ##
* Home page: Picture, welcome message, event details + location
* Clean up shuttle RSVP look + feel
* After home: Schedule/Itinerary: A breakdown of key event timings (e.g., ceremony start, cocktail hour, reception end)
* Travel / Accommodations - hotel blocks, airport, transportation details
* Need to build in RSVP flow for rehersal dinner people
* View your RSVP selection - food can change until certsin date
* Registry tab after RSVP
* FAQ - dresscode, parking, plus 1, weather considerations

# TOdo
i think i need to create parties together with a common name, and individual names
a party will have multiple guests. each guest has a 1:1 relationship with RSVP

## Planning Data Import (Local or Deployed DB)

Use the import script to load vendors, expenses, and tasks into any environment where `DATABASE_URL` points at the right database.

1. Copy and edit [data/planning-import.example.json](data/planning-import.example.json).
2. Run:

```bash
npm run planning:import -- --file data/planning-import.example.json
```

Useful options:

```bash
# Clear existing planning data first (vendors, expenses, tasks)
npm run planning:import -- --file data/planning-import.example.json --clear

# Attempt to link existing unlinked expenses to vendors by matching text
npm run planning:import -- --file data/planning-import.example.json --link-existing-expenses
```

Notes:
- Expenses and tasks can link vendors using either `vendorId` or `vendorName` in the JSON input.
- Tasks can link parties by `partySlug`.
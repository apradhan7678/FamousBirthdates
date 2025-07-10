# Famous Birthdates

A single-page Next.js application that helps you discover famous people who share your birthdate. Simply input your birthdate and get information about the top 3 famous individuals born on the same day.

## Features

- **Birthdate Input**: Easy-to-use date picker for entering your birthdate
- **Famous People Discovery**: Find the top 3 most notable people who share your birthdate
- **Rich Information**: Get details about each person including their profession, achievements, and background
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

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

## How to Use

1. Navigate to the homepage
2. Select your birthdate using the date picker
3. Click "Find Famous People" or press Enter
4. View the top 3 famous individuals who share your birthdate
5. Read about their achievements and contributions

## Technology Stack

- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **CSS Modules** - Scoped styling
- **App Router** - Modern Next.js routing system

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page component
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   └── page.module.css   # Page-specific styles
├── components/           # Reusable components
└── utils/               # Utility functions
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

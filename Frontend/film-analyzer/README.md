This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Step 1: cd into the Frontend/film-analyzer to install dependencies
```
    cd Frontend
    cd film-analyzer
    npm install
```

## Step 2: Ask Mahathir for clerk access keys. Create a .env.local file withint film-analyzer, and place public and secret key in there

## Step 3 Running Code

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

# Clerk Installation
## First Brew Install Ngork
    brew install ngrok/ngrok/ngrok

## Second connect my ngrok agent to your ngrok account
    ngrok config add-authtoken <TOKEN> (the token is something aurnab only has)

## Thrid Starts a tunnel wioth the domain that was generated for me, also since my frontend server runs on port 3000, that is the reason why the port at the end is 3000
    ngrok http --domain=prime-escargot-relative.ngrok-free.app 3000

    

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Runing The APP

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# info

- No "pages/index.tsx" is used. Instead "next.config.js" redirects traffic from "/" to "/home" so that "pages/[slug].tsx" can handöe the request. "/home" is stored inside ".env.local".

# Formating data in WordPress

- Lists must start with a "header" element. For instance:

<ul>
	<li>Courses</li>
	<li>Mathematics</li>
	<li>Computer Programming</li>
</ul>

- The menu is to be loaded from a menu byt the name "Main".
- The social menu is to be loaded from a menu byt the name "Social".

# Sources:

- badges from:
https://github.com/alexandresanlim/Badges4-README.md-Profile?tab=readme-ov-file

# Setup

1. Clone the repository.
2. Follow the instructions in file ".env.example".
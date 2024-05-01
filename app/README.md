# WilliamFridh.com - Portfolio

![image](https://img.shields.io/badge/Wordpress-21759B?style=for-the-badge&logo=wordpress&logoColor=white)
![image](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![image](https://img.shields.io/badge/GitKraken-179287?style=for-the-badge&logo=GitKraken&logoColor=white)
![image](https://img.shields.io/badge/GraphQl-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![image](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![image](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![image](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![image](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![image](https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white)
![image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Welcome to the repository containing my portoflio website. It uses the techonlogies Next.js (thus also React JS), TypeScript, Tailwind CSS, TypeScript, GraphQL, and deploys to Vercel. A liver version is avalible at [WilliamFridh.com](https://williamfridh.com/). it has basic support for pages and in addition, portfolio and make use [Advanced Custom Fields (ACF)](https://www.advancedcustomfields.com/).**

## Background

This project is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) that I built on to archieve my vision. It was requested as part of the course [EH1021 Active Career Start](https://www.kth.se/student/kurser/kurs/EH1021) with the goal to prepare us as students for the job application process.

# Running The APP

1. Clone the repository.
2. Follow the instructions in file ".env.example".
3. Read trough the code and find what's required by the WordPress GraphQL.
4. Run the veleopment server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see website in action.

# info

- No "pages/index.tsx" is used. Instead "next.config.js" redirects traffic from "/" to "/home" so that "pages/[slug].tsx" can handle the request. "/home" is stored inside ".env.local".

- This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# WordPress

The website has unique styling for certain elements to keep the theme consistent.

## Formating data in WordPress

- Lists must start with a "header" element. For instance:

```
<ul>
	<li>Courses</li>
	<li>Mathematics</li>
	<li>Computer Programming</li>
</ul>
```

- The menu is to be loaded from a menu byt the name "Main".
- The social menu is to be loaded from a menu byt the name "Social".

# Sources:

- Badges from:
https://github.com/alexandresanlim/Badges4-README.md-Profile?tab=readme-ov-file


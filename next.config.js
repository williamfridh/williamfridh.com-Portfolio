/** @type {import('next').NextConfig} */



module.exports = {
	async redirects() {
	  return [
		{
		  source: '/',
		  destination: process.env.WORDPRESS_DEFAULT_SLUG,
		  permanent: true,
		},
	  ];
	},

	images: {
		domains: ['wp.williamfridh.com', 'img.shields.io'],

		/**
		 * WARNING
		 * Next.js will allow rendering SVGs with potentially unsafe content.
		 * However, be cautious when using this feature, as it can expose the
		 * application to security risks if not used carefully. Make sure to
		 * sanitize any user-generated or untrusted SVG content before
		 * rendering it in the application.
		 * 
		 * More info: https://nextjs.org/docs/pages/api-reference/components/image
		 */
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	}
	
};


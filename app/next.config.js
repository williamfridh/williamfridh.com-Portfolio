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
		remotePatterns: [
			// Used for allowing loading assets from remote sources.
			{
				protocol: 'https',
				hostname: 'wp.williamfridh.com'
			}
		]
	}
};

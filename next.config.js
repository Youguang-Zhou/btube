/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [{ hostname: '*.bili.tube' }, { hostname: '*.aliyuncs.com' }],
	},
}

module.exports = nextConfig

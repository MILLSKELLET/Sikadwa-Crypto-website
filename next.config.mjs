import nextPwa from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  ...nextPwa({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development', // Disable in dev mode
  }),
};

export default nextConfig;

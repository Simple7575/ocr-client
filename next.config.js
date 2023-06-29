/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
        config.module.rules.push({
            resolve: {
                fallback: {
                    fs: false,
                    path: false,
                    crypto: false,
                },
            },
        });
        // Important: return the modified config
        return config;
    },
};

module.exports = nextConfig;

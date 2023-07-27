/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
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
        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    {
                        from: "node_modules/tesseract.js/dist",
                        to: path.resolve(__dirname, "public", "dist"),
                    },
                ],
            })
            // new CopyPlugin({
            //     patterns: [
            //       { from: "node_modules/tesseract.js/dist", to: "public/" },
            //     ],
            //   }),
        );

        // Important: return the modified config
        return config;
    },
};

module.exports = nextConfig;

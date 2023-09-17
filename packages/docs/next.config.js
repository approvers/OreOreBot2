// @ts-checks

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
});

module.exports = {
  ...withNextra({
    /**
     * Next.js v13.3 以降、 next export は非推奨
     * nextConfig で指定すると next build 実行時に Static Export が行われるようになる
     */
    output: 'export',
    images: {
      unoptimized: true
    }
  })
};

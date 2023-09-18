import Image from 'next/image';
import { useRouter } from 'next/router';
import { DocsThemeConfig } from 'nextra-theme-docs';

import pkg from './package.json' assert { type: 'json' };

const themeConfig: DocsThemeConfig = {
  logo: (
    <>
      <Image
        src={'./assets/haracho-transmission.png'}
        width={50}
        height={50}
        alt={'はらちょのアイコン'}
      />
      <span style={{ marginLeft: '.4em', fontWeight: 500 }}>
        OreOreBot2 Documents
      </span>
    </>
  ),
  docsRepositoryBase: `${pkg.repository}/blob/main/docs`,
  primaryHue: 193,
  project: {
    link: pkg.repository
  },
  search: {
    placeholder: '検索する'
  },
  editLink: {
    text: 'このページを編集する'
  },
  feedback: {
    content: 'Issueを作成する',
    useLink() {
      return `${pkg.repository}/issues/new?assignees=&labels=T-Documents&projects=&template=content_report.yml`;
    }
  },
  footer: {
    text: <span>Copyright {new Date().getFullYear()} Approvers</span>
  },
  head: (
    <>
      <meta property="og:title" content="OreOreBot2 Documents" />
      <meta property="og:description" content={pkg.description} />
      <link
        rel="icon"
        type="image/svg+xml"
        href="/packages/bot/assets/favicon.svg"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/packages/bot/assets/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/packages/bot/assets/favicon-16x16.png"
      />
      <link rel="icon" href="/packages/bot/assets/favicon.ico" />
    </>
  ),
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== '/') {
      return {
        titleTemplate: '%s - OreOreBot2 Documents'
      };
    }
  }
};

export default themeConfig;

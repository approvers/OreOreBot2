/**
 *  next lint は lint-staged で実行するとエラーになるので, 公式が推奨している方法に従う
 *  https://github.com/vercel/next.js/issues/33096
 */

const path = require('path');

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, 'prettier --write']
};

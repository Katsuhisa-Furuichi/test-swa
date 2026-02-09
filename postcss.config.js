import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  plugins: {
    'postcss-import': {
      path: [path.resolve(__dirname, 'node_modules')],
    },
  },
};

import { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenvFlow from 'dotenv-flow';

dotenvFlow.config();

const config: CodegenConfig = {
  schema: 'https://www.dnd5eapi.co/graphql',
  documents: ['src/graphql/dnd/*.graphql'],
  generates: {
    'src/utils/__generated__/dndGraphql.tsx': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withRefetchFn: true,
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
};

export default config;

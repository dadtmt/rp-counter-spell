import { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenvFlow from 'dotenv-flow';

dotenvFlow.config();

const config: CodegenConfig = {
  schema: [
    {
      [`https://${process.env.REACT_APP_NHOST_SUBDOMAIN}.graphql.${process.env.REACT_APP_NHOST_REGION}.nhost.run/v1`]:
        {
          headers: {
            'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || '',
          },
        },
    },
  ],
  documents: ['src/**/*.graphql'],
  generates: {
    'src/utils/__generated__/graphql.tsx': {
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

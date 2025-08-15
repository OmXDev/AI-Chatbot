import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { nhost } from './nhost';

// Hasura GraphQL endpoint from Nhost
const httpLink = createHttpLink({
  uri: nhost.graphql.getUrl(),
});

const authLink = setContext(async (_, { headers }) => {
  const session = nhost.auth.getSession();
  const token = session?.accessToken || null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

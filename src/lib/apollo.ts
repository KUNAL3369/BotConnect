import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { nhost } from './nhost';

const httpLink = createHttpLink({
  uri: `https://${import.meta.env.VITE_NHOST_SUBDOMAIN}.graphql.${import.meta.env.VITE_NHOST_REGION}.nhost.run/v1`,
});

const wsLink = new GraphQLWsLink(createClient({
  url: `wss://${import.meta.env.VITE_NHOST_SUBDOMAIN}.graphql.${import.meta.env.VITE_NHOST_REGION}.nhost.run/v1`,
  connectionParams: () => {
    const token = nhost.auth.getAccessToken();
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  },
}));

const authLink = setContext((_, { headers }) => {
  const token = nhost.auth.getAccessToken();
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
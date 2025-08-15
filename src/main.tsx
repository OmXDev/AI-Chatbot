// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// import { NhostProvider } from '@nhost/react';
// import { NhostApolloProvider } from '@nhost/react-apollo';
// import { nhost } from './nhost.ts';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo.ts';

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
);

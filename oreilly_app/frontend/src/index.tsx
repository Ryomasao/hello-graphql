import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, ApolloLink, InMemoryCache, split, concat } from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws'
import { createUploadLink } from 'apollo-upload-client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const URL_BACKEND = 'http://localhost:4000/graphql'

const httpLink = createUploadLink({
  uri: URL_BACKEND,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || null,
    }
  }));
  return forward(operation);
})

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem('token') || null,
    },
  }
});

// apolloClientはHTTP/WebSoketとかのリクエストをApolloLinkなるもので管理してる。
// リクエスト/レスポンスの前後に処理を差し込みたい場合は、ApolloLinkをチェインしていくような感じになる。  
// splitはSubscriptionであればWebSocket/それ以外はHTTPリクエストっていう振り分けを行うための関数
const splitLink = split(
  ({ query }) => {
    const difinition = getMainDefinition(query);
    return difinition.kind === 'OperationDefinition' && difinition.operation === 'subscription'
  },
  // ↑がtrueのときに利用するlink
  wsLink,
  // ↑がfalseのときに利用するlink
  // https://www.apollographql.com/docs/react/networking/advanced-http-networking/
  concat(authMiddleware, httpLink)
)

const client = new ApolloClient({ 
  link: splitLink,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider,  } from 'react-apollo';
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import App from './App';
import reportWebVitals from './reportWebVitals';

const URL_BACKEND = 'http://localhost:4000/graphql'
const cache = new InMemoryCache()
const client = new ApolloClient({ 
  uri: URL_BACKEND,
  request: operation => {
    operation.setContext((context:any) => ({
      headers: {
        ...context.headers,
        authorization: localStorage.getItem('token')
      }
    }))
  },
  cache
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

import React from 'react';
import './App.css';
import Routes from './routes/';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const httpLink = createHttpLink({ uri: 'http://localhost:8080/graphql' });
const middlewareLink = setContext(() => ({
	headers: {
		'x-token': localStorage.getItem('token'),
		'x-refresh-token': localStorage.getItem('refreshToken'),
	},
}));

const afterwareLink = new ApolloLink((operation, forward) => {
	return forward(operation).map((response) => {
		const {
			response: { headers },
		} = operation.getContext();

		if (headers) {
			const token = headers.get('x-token');
			const refreshToken = headers.get('x-refresh-token');

			if (token) {
				localStorage.setItem('token', token);
			}

			if (refreshToken) {
				localStorage.setItem('refreshToken', refreshToken);
			}
		}
		return response;
	});
});

const httpLinkWithMiddleware = afterwareLink.concat(
	middlewareLink.concat(httpLink)
);

const wsLink = new WebSocketLink({
	uri: 'ws://localhost:8080/subscriptions',
	options: {
		reconnect: true,
		connectionParams: {
			token: localStorage.getItem('token'),
			refreshToken: localStorage.getItem('refreshToken'),
		},
	},
});

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	wsLink,
	httpLinkWithMiddleware
);

// Create the Apollo Client & connect to Apollo Server
const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
	request: (operation) => {
		const token = localStorage.getItem('token');
		const refreshToken = localStorage.getItem('refreshToken');

		operation.setContext({
			headers: {
				'x-token': token ? token : '',
				'x-refresh-token': refreshToken ? refreshToken : '',
			},
		});
	},
});

function App() {
	return (
		<ApolloProvider client={client}>
			<Routes />
		</ApolloProvider>
	);
}

export default App;

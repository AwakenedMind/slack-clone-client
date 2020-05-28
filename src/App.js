import React from 'react';
import './App.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import Routes from './routes/';

// Create the Apollo Client & connect to Apollo Server
const client = new ApolloClient({
	uri: 'http://localhost:8000/graphql',
});

function App() {
	return (
		<ApolloProvider client={client}>
			<Routes />
		</ApolloProvider>
	);
}

export default App;

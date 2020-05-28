import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import ALL_USERS_QUERY from '../graphql/queries/allUsers';

const Home = () => {
	const { loading, error, data } = useQuery(ALL_USERS_QUERY);
	console.log(data);
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return (
		<div>
			{data.allUsers.map((user) => (
				<div key={user.id}>
					<h1>{user.email}</h1>
				</div>
			))}
		</div>
	);
};

export default Home;

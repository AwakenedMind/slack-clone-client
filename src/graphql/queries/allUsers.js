import { gql } from 'apollo-boost';

const ALL_USERS_QUERY = gql`
	{
		allUsers {
			id
			email
			username
		}
	}
`;

export default ALL_USERS_QUERY;

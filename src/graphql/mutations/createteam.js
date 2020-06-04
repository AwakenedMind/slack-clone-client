import { gql } from 'apollo-boost';

const CREATE_TEAM = gql`
	mutation($name: String!) {
		createTeam(name: $name) {
			ok
			errors {
				path
				message
			}
		}
	}
`;

export default CREATE_TEAM;

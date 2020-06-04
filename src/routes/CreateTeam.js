import React, { useReducer } from 'react';
import {
	Button,
	Input,
	Container,
	Header,
	Message,
	Form,
} from 'semantic-ui-react';
import CREATE_TEAM from '../graphql/mutations/createteam.js';
import { useMutation } from '@apollo/react-hooks';

const CreateTeam = ({ history }) => {
	const initialState = {
		name: '',
		nameError: '',
	};

	const [
		createTeam,
		{ loading: mutationLoading, error: mutationError },
	] = useMutation(CREATE_TEAM);

	const reducer = (state, action) => {
		switch (action.type) {
			case 'reset':
				return initialState;
			case 'errorReset':
				return {
					...state,
					nameError: '',
				};
			case 'error':
				return { ...state, [action.path]: action.value };
			default:
				return {
					...state,
					[action.type]: action.value,
				};
		}
	};

	const [state, dispatch] = useReducer(reducer, initialState);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await createTeam({
			variables: {
				name: state.name,
			},
		});
		const { ok } = res.data.createTeam;
		const { errors } = res.data.createTeam;

		if (ok) {
			history.push('/');
		} else {
			errors.forEach(({ path, message }) => {
				dispatch({ type: 'error', value: message, path: `${path}Error` });
				dispatch({ type: path, value: '' });
			});
		}
	};

	// Error Array
	let errList = [];
	if (state.nameError) errList.push(state.nameError);

	return (
		<Container text>
			<Form>
				<Header as="h4">Create a team!</Header>
				<Form.Field error={state.nameError}>
					<Input
						name="name"
						onChange={(e) =>
							dispatch({ type: e.target.name, value: e.target.value })
						}
						value={state.name}
						placeholder="Name"
						fluid
					/>
				</Form.Field>
				<Button type="submit" onClick={handleSubmit}>
					Submit
				</Button>
			</Form>
			{state.nameError ? (
				<Message
					error
					header="There was some errors with your submission"
					list={errList}
				/>
			) : null}
		</Container>
	);
};

export default CreateTeam;

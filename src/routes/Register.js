import React, { useReducer } from 'react';
import {
	Button,
	Input,
	Container,
	Header,
	Message,
	Form,
} from 'semantic-ui-react';
import REGISTER_USER from '../graphql/mutations/register';
import { useMutation } from '@apollo/react-hooks';

const Register = ({ history }) => {
	const initialState = {
		username: '',
		email: '',
		password: '',
		usernameError: '',
		passwordError: '',
		emailError: '',
	};

	const [
		registerUser,
		{ loading: mutationLoading, error: mutationError },
	] = useMutation(REGISTER_USER);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Reset Error State on submission
		dispatch({ type: 'errorReset' });

		const res = await registerUser({
			variables: {
				username: state.username,
				password: state.password,
				email: state.email,
			},
		});
		console.log(res);
		console.log(res.data.register.errors);

		let success = res.data.register.ok ? true : false;
		let errors = res.data.register.errors;

		if (success) {
			dispatch({ type: 'reset', value: '' });
			history.push('/');
		} else {
			errors.forEach(({ path, message }) => {
				dispatch({ type: 'error', value: message, path: `${path}Error` });
				dispatch({ type: path, value: '' });
			});
		}
	};

	const reducer = (state, action) => {
		switch (action.type) {
			case 'reset':
				return initialState;
			case 'errorReset':
				return {
					...state,
					usernameError: '',
					passwordError: '',
					emailError: '',
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

	let errList = [];

	if (state.usernameError) errList.push(state.usernameError);
	if (state.passwordError) errList.push(state.passwordError);
	if (state.emailError) errList.push(state.emailError);

	return (
		<Container text>
			<Form>
				<Header as="h4">Register</Header>
				<Form.Field error={state.usernameError}>
					<Input
						name="username"
						onChange={(e) =>
							dispatch({ type: e.target.name, value: e.target.value })
						}
						value={state.username}
						placeholder="Username"
						fluid
					/>
				</Form.Field>
				<Form.Field error={state.emailError}>
					<Input
						name="email"
						onChange={(e) =>
							dispatch({ type: e.target.name, value: e.target.value })
						}
						value={state.email}
						placeholder="Email"
						fluid
					/>
				</Form.Field>
				<Form.Field error={state.passwordError}>
					<Input
						name="password"
						onChange={(e) =>
							dispatch({ type: e.target.name, value: e.target.value })
						}
						value={state.password}
						placeholder="Password"
						fluid
					/>
				</Form.Field>
				<Button type="submit" onClick={handleSubmit}>
					Submit
				</Button>
				{mutationLoading && <p>Loading...</p>}
				{mutationError && <p>Error :( Please try again</p>}
			</Form>
			{state.usernameError || state.passwordError || state.emailError ? (
				<Message
					error
					header="There was some errors with your submission"
					list={errList}
				/>
			) : null}
		</Container>
	);
};

export default Register;

import React, { useState, useReducer } from 'react';
import {
	Button,
	Input,
	Container,
	Header,
	Message,
	Form,
} from 'semantic-ui-react';
import LOGIN_USER from '../graphql/mutations/login';
import { useMutation } from '@apollo/react-hooks';

const Login = ({ history }) => {
	const initialState = {
		email: '',
		password: '',
		passwordError: '',
		emailError: '',
	};

	const [
		loginUser,
		{ loading: mutationLoading, error: mutationError },
	] = useMutation(LOGIN_USER);

	const reducer = (state, action) => {
		switch (action.type) {
			case 'reset':
				return initialState;
			case 'errorReset':
				return {
					...state,
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

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await loginUser({
			variables: {
				password: state.password,
				email: state.email,
			},
		});
		const { ok, token, refreshToken } = res.data.login;
		const errors = res.data.login.errors;

		if (ok) {
			localStorage.setItem('token', token);
			localStorage.setItem('refreshToken', refreshToken);
			history.push('/');
		} else {
			errors.forEach(({ path, message }) => {
				dispatch({ type: 'error', value: message, path: `${path}Error` });
				dispatch({ type: path, value: '' });
			});
		}
	};

	let errList = [];
	if (state.passwordError) errList.push(state.passwordError);
	if (state.emailError) errList.push(state.emailError);

	return (
		<Container text>
			<Form>
				<Header as="h4">Login</Header>
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
			</Form>
			{state.passwordError || state.emailError ? (
				<Message
					error
					header="There was some errors with your submission"
					list={errList}
				/>
			) : null}
		</Container>
	);
};

export default Login;

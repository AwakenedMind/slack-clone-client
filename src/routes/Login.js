import React, { useState, useReducer } from 'react';
import { Button, Input, Container, Header, Message } from 'semantic-ui-react';

const Login = () => {
	const initialState = {
		email: '',
		password: '',
		passwordError: '',
		emailError: '',
	};

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

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	let errList = [];
	if (state.passwordError) errList.push(state.passwordError);
	if (state.emailError) errList.push(state.emailError);

	return (
		<Container text>
			<Header as="h4">Login</Header>
			<Input
				error={state.emailError}
				name="email"
				onChange={(e) =>
					dispatch({ type: e.target.name, value: e.target.value })
				}
				value={state.email}
				placeholder="Email"
				fluid
			/>
			<Input
				error={state.passwordError}
				name="password"
				onChange={(e) =>
					dispatch({ type: e.target.name, value: e.target.value })
				}
				value={state.password}
				placeholder="Password"
				fluid
			/>
			<Button type="submit" onClick={handleSubmit}>
				Submit
			</Button>
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

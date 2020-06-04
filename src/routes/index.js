import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import CreateTeam from './CreateTeam';
import decode from 'jwt-decode';
import ViewTeam from './ViewTeam';

const isAuthenticated = () => {
	const token = localStorage.getItem('token');
	const refreshToken = localStorage.getItem('refreshToken');

	try {
		decode(token);
		decode(refreshToken);
	} catch (err) {
		return false;
	}
	return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			isAuthenticated ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: '/login',
						state: { from: props.location },
					}}
				/>
			)
		}
	/>
);

const Router = () => (
	<BrowserRouter>
		<Switch>
			<Route path="/" exact component={Home} />
			<Route path="/register" exact component={Register} />
			<Route path="/view-team" exact component={ViewTeam} />
			<PrivateRoute path="/create-team" exact component={CreateTeam} />
		</Switch>
	</BrowserRouter>
);

export default Router;

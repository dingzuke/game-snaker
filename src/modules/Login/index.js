import React, { Component } from 'react';
const css = require('./index.scss');

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		console.log('路由传参', this.props.location.state);
	}
	render() {
		return (
		<div className={css.login}>
			登录
		</div>
		);
	}
}

export default Login;

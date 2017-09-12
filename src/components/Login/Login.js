import React, {Component} from 'react';
import {firebaseAuth} from "../../util/firebaseUtils.js";

class Login extends Component {

    constructor() {
        super();
        this.state = {email: '', password: '', userLogin: null};
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillMount() {
        this.setState({
            email: '', password: ''
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    createUser(event) {
        event.preventDefault();

        const email = this.state.email;
        const password = this.state.password;

        console.log(email + " " + password);

        firebaseAuth.signInWithEmailAndPassword(email, password).catch(function(error) {
            alert(error.message);
        });

        this.cleanState();
    }

    cleanState() {
        this.setState({
            email:'',
            password:''
        });
    }

    render() {
        return <form onSubmit={this.createUser.bind(this)}>
            Login <br/>
            <label>E-mail</label>
            <input name="email" id="email" value={this.state.email} type="email" onChange={this.handleInputChange}/>
            <label>Password</label>
            <input name="password" id="password" value={this.state.password} type="password" onChange={this.handleInputChange}/>
            <button type="submit">Login</button>
        </form>;
    }
}

export default Login;
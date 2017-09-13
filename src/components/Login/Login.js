import React, {Component} from 'react';
import {firebaseAuth, firebaseDatabase} from "../../util/firebaseUtils.js";
import {RaisedButton, TextField} from "material-ui";
import {Card, CardText} from "material-ui/Card/index";
import {Redirect, withRouter} from "react-router-dom";
import urls from "../../util/urlUtils";

class Login extends Component {

    constructor() {
        super();
        this.state = {email: '', password: '', startedUseCreation: false};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.createUser = this.createUser.bind(this);
        this.startUseCreation = this.startUseCreation.bind(this);
    }

    componentWillMount() {
        this.setState({
            email: '',
            password: '',
            startedUseCreation: false
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

    login(event) {
        event.preventDefault();

        const email = this.state.email;
        const password = this.state.password;

        firebaseAuth.signInWithEmailAndPassword(email, password).catch(function (error) {
            alert(error.message);
        });

        this.cleanState();

        this.props.history.push(urls.data);
    }

    startUseCreation() {
        this.setState({
            startedUseCreation: true
        });
    }

    createUser() {
        event.preventDefault();

        const username = this.state.username;
        const email = this.state.email;
        const password = this.state.password;

        firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(function (user) {
                console.log(user);
                this.writeUserData(user.uid, username, user.email);
                this.setState({
                    startedUseCreation: false
                });
            }.bind(this))
            .catch(function (error) {
                alert(error.message);
            });

        this.cleanState();
    }

    cleanState() {
        this.setState({
            email: '',
            password: '',
            startedUseCreation: false,
        });
    }

    writeUserData(userId, name, email) {
        firebaseDatabase.ref('users/' + userId).set({
            username: name,
            email: email
        });
    }

    render() {
        if (firebaseAuth.currentUser) {
            return <Redirect to={urls.data}/>
        }

        const inputName =
            this.state.startedUseCreation
                ? (
                    <TextField
                        hintText="User name"
                        floatingLabelText="User name"
                        name="username"
                        id="username"
                        fullWidth={true}
                        value={this.state.username}
                        type="text"
                        onChange={this.handleInputChange}
                    />
                )
                : '';

        const createUserButtons = !this.state.startedUseCreation
            ? <RaisedButton label="sign-up" onClick={this.startUseCreation}/>
            : <RaisedButton label="create" onClick={this.createUser}/>;

        return (
            <Card>
                <CardText>
                    <form onSubmit={this.login.bind(this)}>
                        {inputName}
                        <TextField
                            hintText="E-mail Field"
                            floatingLabelText="E-mail"
                            name="email"
                            id="email"
                            fullWidth={true}
                            value={this.state.email}
                            type="email"
                            onChange={this.handleInputChange}
                        />
                        <br/>
                        <TextField
                            hintText="Password"
                            floatingLabelText="Password"
                            name="password"
                            id="password"
                            fullWidth={true}
                            value={this.state.password}
                            type="password"
                            onChange={this.handleInputChange}
                        />
                        <br/>
                        <RaisedButton label="sign-in" style={{marginRight: "5px"}} type="submit"/>
                        {createUserButtons}
                    </form>
                </CardText>
            </Card>
        );
    }
}

export default withRouter(Login);
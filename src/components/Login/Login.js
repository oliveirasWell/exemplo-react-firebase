import React, {Component} from 'react';
import {firebaseAuth} from "../../util/firebaseUtils.js";
import {RaisedButton, TextField} from "material-ui";
import {Card, CardText} from "material-ui/Card/index";
import {Redirect, withRouter} from "react-router-dom";
import urls from "../../util/urlUtils";

class Login extends Component {

    constructor() {
        super();
        this.state = {email: '', password: ''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.createUser = this.createUser.bind(this);
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

    createUser() {
        event.preventDefault();

        const email = this.state.email;
        const password = this.state.password;

        firebaseAuth.createUserWithEmailAndPassword(email, password)
            .catch(function (error) {
                alert(error.message);
            });

        this.cleanState();
    }

    cleanState() {
        this.setState({
            email: '',
            password: ''
        });
    }


    render() {

        if (firebaseAuth.currentUser) {
            return <Redirect to={urls.data}/>
        }

        const form = (
            <form onSubmit={this.login.bind(this)}>
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
                <RaisedButton label="sign-up" onClick={this.createUser}/>
            </form>
        );

        return (
            <Card>
                <CardText>
                    {form}
                </CardText>
            </Card>
        );
    }
}

export default withRouter(Login);
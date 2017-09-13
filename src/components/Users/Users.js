import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {firebaseAuth} from "../../util/firebaseUtils";
import urls from "../../util/urlUtils";

class Users extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {

        if (!firebaseAuth.currentUser) {
            return <Redirect to={urls.login}/>
        }

        return (
            <div>Users</div>
        );
    }
}

export default Users;
import React, {Component} from 'react';
import './App.css';
import {firebaseDatabase} from "../../util/firebaseUtils.js";
import nodes from "../../util/databaseUtils";
import UserCreate from "../UserCreate/UserCreate";
import Login from "../Login/Login";
import {firebaseAuth} from "../../util/firebaseUtils";

class App extends Component {

    constructor() {
        super();
        this.state = {leituras: [], userLoginEmail: null};
    }

    componentWillMount() {
        firebaseDatabase.ref(nodes.leituras)
            .limitToLast(20)
            .on('value', function (dataSnapshot) {
                let items = [];
                dataSnapshot.forEach(childSnapshot => {
                    let item = childSnapshot.val();
                    item['.key'] = childSnapshot.key;
                    items.push(item);
                });
                this.setState({
                    leituras: items
                });
            }.bind(this));

        firebaseAuth.onAuthStateChanged(function (user) {
            if (user) {
                this.setState({userLoginEmail: user.email});
            } else {
                this.setState({userLoginEmail: null});
            }
        }.bind(this));
    }

    logout(event) {

        event.preventDefault();

        firebaseAuth.signOut().then(function() {
            console.log("sucess");
        }, function(error) {
            console.log(error);
        });
    }

    render() {
        const leituras = this.state.leituras.filter((leitura, index) =>
            this.state.userLoginEmail !== null
                ? leitura.cliente === this.state.userLoginEmail
                : true
        ).map((leitura, index) =>
            <tr>
                <td>{!leitura.data ? '0' : leitura.data}</td>
                <td>{leitura.temperatura}</td>
                <td>{leitura.umidade}</td>
                <td>{leitura.cliente}</td>
            </tr>
        );

        const loginButtons = this.state.userLoginEmail !== null
            ? <div> {this.state.userLoginEmail}
                <button onClick={this.logout}>Logout</button>
            </div>
            : <div><Login/><UserCreate/></div>;

        return (
            <div className="App">

                {loginButtons}

                <table>
                    <thead>
                    <tr>
                        <th>Data</th>
                        <th>Temperature</th>
                        <th>Humidity</th>
                        <th>Client</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leituras}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default App;
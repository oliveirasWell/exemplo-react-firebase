import React, {Component} from 'react';
import './App.css';
import {firebaseDatabase} from "../../util/firebaseUtils.js";
import nodes from "../../util/databaseUtils";

class App extends Component {

    constructor() {
        super();
        this.state = {leituras: []};
    }

    componentWillMount() {

        let ref = firebaseDatabase.ref(nodes.leituras);

        ref.limitToLast(20).on('value', function (dataSnapshot) {

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
    }

    render() {
        const leituras = this.state.leituras.map((leitura, index) =>
            <tr>
                <td>{!leitura.data ? '0' : leitura.data}</td>
                <td>{leitura.temperatura}</td>
                <td>{leitura.umidade}</td>
                <td>{leitura.cliente}</td>
            </tr>
        );

        return (
            <div className="App">
                <table>
                    <tr>
                        <th>Data</th>
                        <th>Temperatura</th>
                        <th>Umidade</th>
                        <th>Cliente</th>
                    </tr>
                    {leituras}
                </table>
            </div>
        );
    }
}

export default App;
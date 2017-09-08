import React, {Component} from 'react';
import './App.css';
import {firebaseDatabase} from "../../util/firebaseUtils.js";
import ReactFireMixin from "reactfire";
import reactMixin from "react-mixin";
import nodes from "../../util/databaseUtils";

class App extends Component {

    constructor() {
        super();
        this.state = {leituras: []};
    }

    componentWillMount() {

        let ref = firebaseDatabase.ref(nodes.leituras);

        ref.limitToLast(25).on('value', function(dataSnapshot) {

            let items = [];

            dataSnapshot.forEach( childSnapshot => {
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
            <div>
                <div>{ !!!leitura.data ? '0' : leitura.data} - {leitura.temperatura} - {leitura.umidade} - {leitura.cliente}</div>
            </div>
        );

        return (
            <div className="App">
                {leituras}
            </div>
        );
    }
}

reactMixin(App.prototype, ReactFireMixin);

export default App;
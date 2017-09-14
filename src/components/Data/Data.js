import React, {Component} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table/index";
import {firebaseDatabase, firebaseAuth} from "../../util/firebaseUtils.js";
import nodes from "../../util/databaseUtils";
import {Redirect} from "react-router-dom";
import urls from "../../util/urlUtils";

class Data extends Component {

    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        firebaseDatabase.ref(nodes.data)
            .limitToLast(10)
            .orderByChild(nodes.client)
            .equalTo(firebaseAuth.currentUser.email)
            .on('value', function (dataSnapshot) {
                let items = [];
                dataSnapshot.forEach(childSnapshot => {
                    let item = childSnapshot.val();
                    item['.key'] = childSnapshot.key;
                    items.push(item);
                });
                this.setState({
                    data: items
                });
            }.bind(this));
    }

    render() {

        if (!firebaseAuth.currentUser) {
            return <Redirect to={urls.login}/>
        }

        const data = this.state.data.reverse().map((leitura, index) =>
            <TableRow>
                <TableRowColumn>{!leitura.data ? '0' : leitura.data}</TableRowColumn>
                <TableRowColumn>{leitura.temperatura}</TableRowColumn>
                <TableRowColumn>{leitura.umidade}</TableRowColumn>

                {firebaseAuth.currentUser ? (<TableRowColumn>{leitura.cliente}</TableRowColumn>) : ('')}

            </TableRow>
        );

        return (
            <Table selectable={false}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>Data</TableHeaderColumn>
                        <TableHeaderColumn>Temperature</TableHeaderColumn>
                        <TableHeaderColumn>Humidity</TableHeaderColumn>
                        {firebaseAuth.currentUser ? (<TableHeaderColumn>Client</TableHeaderColumn>) : ('')}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data.length
                            ? data
                            : <TableRow><TableRowColumn style={{textAlign: "center"}}>There's no data
                                foryou</TableRowColumn></TableRow>
                    }
                </TableBody>
            </Table>
        );
    }
}

export default Data;
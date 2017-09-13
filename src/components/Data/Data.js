import React, {Component} from 'react';
import urls from "../../util/urlUtils";
import {Redirect} from "react-router-dom";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table/index";
import {firebaseDatabase, firebaseAuth} from "../../util/firebaseUtils.js";
import nodes from "../../util/databaseUtils";

class Data extends Component {

    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentWillMount() {
        firebaseDatabase.ref(nodes.data)
            .limitToLast(20)
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

        const data = this.state.data.filter((leitura, index) =>
            firebaseAuth.currentUser
                ? leitura.cliente === firebaseAuth.currentUser.email
                : true
        ).map((leitura, index) =>
            <TableRow>
                <TableRowColumn>{!leitura.data ? '0' : leitura.data}</TableRowColumn>
                <TableRowColumn>{leitura.temperatura}</TableRowColumn>
                <TableRowColumn>{leitura.umidade}</TableRowColumn>
                <TableRowColumn>{leitura.cliente}</TableRowColumn>
            </TableRow>
        );

        return (
            <Table selectable={false}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>Data</TableHeaderColumn>
                        <TableHeaderColumn>Temperature</TableHeaderColumn>
                        <TableHeaderColumn>Humidity</TableHeaderColumn>
                        <TableHeaderColumn>Client</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data.length
                            ? data
                            : <TableRow><TableRowColumn style={{textAlign: "center"}}>There's no data for you</TableRowColumn></TableRow>
                    }
                </TableBody>
            </Table>
        );
    }
}

export default Data;
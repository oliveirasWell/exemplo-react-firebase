import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {firebaseAuth, firebaseDatabase} from "../../util/firebaseUtils";
import urls from "../../util/urlUtils";
import nodes from "../../util/databaseUtils";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table/index";

class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {users: []};
    }

    componentDidMount = () => {
        firebaseDatabase.ref(nodes.users)
            .limitToLast(20)
            .on('value', (dataSnapshot) => {
                let items = [];
                dataSnapshot.forEach(childSnapshot => {
                    let item = childSnapshot.val();
                    item['.key'] = childSnapshot.key;
                    items.push(item);
                });
                this.setState({
                    users: items
                });
            });
    }

    render() {

        if (!firebaseAuth.currentUser) {
            return <Redirect to={urls.login}/>
        }

        const users = this.state.users.map((user, index) =>
            <TableRow>
                <TableRowColumn>{user.username}</TableRowColumn>
                <TableRowColumn>{user.email}</TableRowColumn>
            </TableRow>
        );

        return (
            <Table selectable={false}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>E-mail</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length
                        ? users
                        : <TableRow><TableRowColumn style={{textAlign: "center"}}>There's no users registered</TableRowColumn></TableRow>}
                </TableBody>
            </Table>
        );
    }
}

export default Users;
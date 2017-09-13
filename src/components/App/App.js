import React, {Component} from 'react';
import './App.css';
import {firebaseDatabase} from "../../util/firebaseUtils.js";
import nodes from "../../util/databaseUtils";
import Login from "../Login/Login";
import {firebaseAuth} from "../../util/firebaseUtils";
import {MuiThemeProvider} from "material-ui/styles/index";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table/index";
import {Card, CardActions, CardHeader, CardText} from "material-ui/Card/index";
import {AppBar, Divider, FlatButton, IconButton, RaisedButton} from "material-ui";
import {IconMenu, MenuItem} from "material-ui/IconMenu/index";
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

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
        firebaseAuth.signOut().then(function () {
            console.log("sucess");
        }, function (error) {
            console.log(error);
        });
    }

    render() {
        const cardButtonsLogin = (
            this.state.userLoginEmail !== null
                ? ''
                : <Card>
                    <CardText>
                        <Login/>
                    </CardText>
                </Card>
        );


        const leituras = this.state.leituras.filter((leitura, index) =>
            this.state.userLoginEmail !== null
                ? leitura.cliente === this.state.userLoginEmail
                : true
        ).map((leitura, index) =>
            <TableRow>
                <TableRowColumn>{!leitura.data ? '0' : leitura.data}</TableRowColumn>
                <TableRowColumn>{leitura.temperatura}</TableRowColumn>
                <TableRowColumn>{leitura.umidade}</TableRowColumn>
                <TableRowColumn>{leitura.cliente}</TableRowColumn>
            </TableRow>
        );

        const table = (
            this.state.userLoginEmail === null
                ? ''
                : <Table selectable={false}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Data</TableHeaderColumn>
                            <TableHeaderColumn>Temperature</TableHeaderColumn>
                            <TableHeaderColumn>Humidity</TableHeaderColumn>
                            <TableHeaderColumn>Client</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leituras}
                    </TableBody>
                </Table>
        );


        const xml = (
            <IconMenu
                iconButtonElement={
                    <IconButton><MoreVertIcon/></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                <MenuItem primaryText={this.state.userLoginEmail} style={{text: "5px"}}/>
                <Divider />
                <MenuItem primaryText="Sign out" onClick={this.logout}/>
            </IconMenu>);


        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title={"Data Logger"}
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        iconElementRight={this.state.userLoginEmail ? xml : ''}
                    />
                    {cardButtonsLogin}
                    {table}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
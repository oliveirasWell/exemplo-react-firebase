import React, {Component} from 'react';
import Login from "../Login/Login";
import {firebaseAuth} from "../../util/firebaseUtils";
import {MuiThemeProvider} from "material-ui/styles/index";
import {AppBar, Divider, IconButton} from "material-ui";
import {IconMenu, MenuItem} from "material-ui/IconMenu/index";
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {NavigationMenu} from "material-ui/svg-icons/index";
import urls from "../../util/urlUtils";
import Data from "../Data/Data";
import {Route} from 'react-router-dom';
import {withRouter} from "react-router-dom";

class App extends Component {

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout(event) {
        event.preventDefault();
        firebaseAuth.signOut()
            .then(function () {
                this.props.history.push('/')
            }.bind(this), function (error) {
                console.log(error);
            });
    }

    render() {
        const rightButton = (
            firebaseAuth.currentUser
                ?
                <IconMenu
                    iconButtonElement={
                        <IconButton><MoreVertIcon/></IconButton>
                    }
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                    <MenuItem primaryText={firebaseAuth.currentUser.email} style={{text: "5px"}}/>
                    <Divider/>
                    <MenuItem primaryText="Sign out" onClick={this.logout}/>
                </IconMenu>
                : <IconButton/>
        );

        const leftButton = (
            firebaseAuth.currentUser ? <IconButton><NavigationMenu/></IconButton> : <IconButton/>
        );

        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title={"Data Logger"}
                        iconElementLeft={leftButton}
                        iconElementRight={rightButton}
                    />

                    <Route exact path="/" component={Login}/>
                    <Route path={urls.login} component={Login}/>
                    <Route path={urls.data} component={Data}/>

                </div>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
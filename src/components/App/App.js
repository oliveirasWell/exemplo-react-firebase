import React, {Component} from 'react';
import Login from "../Login/Login";
import {firebaseAuth} from "../../util/firebaseUtils";
import {MuiThemeProvider} from "material-ui/styles/index";
import {AppBar, Divider, Drawer, IconButton} from "material-ui";
import {IconMenu, MenuItem} from "material-ui/IconMenu/index";
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {NavigationMenu} from "material-ui/svg-icons/index";
import urls from "../../util/urlUtils";
import Data from "../Data/Data";
import {Route} from 'react-router-dom';
import {withRouter} from "react-router-dom";
import Users from "../Users/Users";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    logout = event => {
        event.preventDefault();
        firebaseAuth.signOut()
            .then(() => {
                this.props.history.push('/')
            }, function (error) {
                console.log(error);
                alert(error.message);
            });
    };

    handleToggle = () => {
        this.setState({open: !this.state.open});
    };

    handleToggleAndGoToUrl = url => {
        this.setState({open: !this.state.open});
        this.props.history.push(url);
    };

    render() {
        const rightButton = (
            firebaseAuth.currentUser
                ?
                <IconMenu
                    iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
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
                        onLeftIconButtonTouchTap={this.handleToggle}
                    />

                    <Drawer
                        docked={false}
                        width={300}
                        open={this.state.open}
                        onRequestChange={(open) => this.setState({open})}
                    >
                        <MenuItem
                            onClick={() => this.handleToggleAndGoToUrl(urls.data)}>
                            Data
                        </MenuItem>

                        <MenuItem
                            onClick={() => this.handleToggleAndGoToUrl(urls.users)}>
                            Users
                        </MenuItem>

                    </Drawer>

                    <Route exact path="/" component={Login}/>
                    <Route path={urls.login} component={Login}/>
                    <Route path={urls.data} component={Data}/>
                    <Route path={urls.users} component={Users}/>

                </div>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
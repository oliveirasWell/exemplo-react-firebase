import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import './index.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import urls from "./util/urlUtils";

ReactDOM.render(
    <Router>
        <div>
            <Route path={urls.home} component={App}/>
        </div>
    </Router>,
    document.getElementById('root')
);

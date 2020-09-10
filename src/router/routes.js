import React from "react";
import {
    Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";

import { browserHistory } from "./browserHistory";
import withTopBarLayout from "../layouts/withTopBarLayout";
import Posts from "../components/posts/posts";
import PostDetails from "../components/post-details/postDetails.jsx"
import EditPost from "../components/edit-post/edit-post.jsx";
import GuardedRoute from "./guardedRoute";

const Routes = () => (
    <Router history={browserHistory}>
        <Switch>
            <Route exact path="/posts" render={props => withTopBarLayout(<Posts {...props} />)} />
            <Route exact path="/post-details/:postIndex" render={props => withTopBarLayout(<PostDetails {...props} />)} />
            <GuardedRoute exact path="/edit-post/:postIndex" render={props => withTopBarLayout(<EditPost {...props} />)} />
            <GuardedRoute exact path="/add-post" render={props => withTopBarLayout(<EditPost {...props} />)} />
            <Redirect exact from="/*" to="/posts" />
        </Switch>
    </Router>
);

export default Routes;

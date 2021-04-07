import React from "react";
import { Container } from "@material-ui/core";

import TopBar from "../components/top-bar/topBar.jsx";
import Login from "../modals/login/login.jsx";
import Logout from "../modals/logout/logout.jsx";
import DeletePost from "../modals/delete-post/deletePost.jsx";
import ConfirmDialog from "../modals/confirm-dialog/confirmDialog.jsx";
import ComponentLoader from "../components/componentLoader/componentLoader.jsx";

const withTopBarLayout = component => (
    <div className="app-container">
        <TopBar />
        <div className="app-content">
            <Container fixed className="app-content-container">
                {component}
            </Container>
        </div>
        <Login />
        <Logout />
        <DeletePost />
        <ConfirmDialog />
        <ComponentLoader />
    </div>
);

export default withTopBarLayout;

import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";

import NavigationLink from "../../primitives/navigation-link/navigationLink";
import { useAppState } from "../../state/useAppState";
import "./topBar.css";
import ActionButton from "../../primitives/action-button/actionButton";

const TopBar = () => {
    const [{ authenticated, title, showExport, posts }, { setLoginModalVisible, setLogoutModalVisible }] = useAppState();
    
    return (
        <AppBar position="static" color="default">
            <Container fixed>
                <Toolbar>
                    <div className="app-header-logo-title">
                        <NavigationLink className="app-header-logo-link" to="/posts">
                            <img alt="home" src="/posts76-icon.png" className="app-header-logo" />
                        </NavigationLink>
                        <span>
                            {title}
                        </span>
                    </div>
                    <div className="button-group">
                        {authenticated && showExport && (
                            <ActionButton text="EXPORT TO JSON" disabled={(posts || []).length === 0} />
                        )}
                        {authenticated && (
                            <NavigationLink className="button-link" to="/add-post">
                                <ActionButton text="ADD POST" variant="outlined" color="primary" />
                            </NavigationLink>
                        )}
                        {authenticated ? (
                            <ActionButton text="LOGOUT" onClick={() => setLogoutModalVisible(true)} />
                        ) : (
                            <ActionButton text="LOGIN" onClick={() => setLoginModalVisible(true)} />
                        )}
                    </div>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default TopBar;

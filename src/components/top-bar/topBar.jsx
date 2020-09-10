import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";

import { useAppState } from "../../state/useAppState";
import "./topBar.css";

const TopBar = () => {
    const [{ authenticated, title, showExport, posts }, { setLoginModalVisible, setLogoutModalVisible }] = useAppState();
    
    return (
        <AppBar position="static" color="default">
            <Container fixed>
                <Toolbar>
                    <div className="app-header-logo-title">
                        <Link className="app-header-logo-link" to="/posts">
                            <img alt="home" src="/posts76-icon.png" className="app-header-logo" />
                        </Link>
                        <span>
                            {title}
                        </span>
                    </div>
                    <div className="button-group">
                        {authenticated && showExport && (
                            <Button variant="outlined" color="primary" disabled={(posts || []).length === 0}>
                                EXPORT TO JSON
                            </Button>
                        )}
                        {authenticated && (
                            <Link className="button-link" to="/add-post">
                                <Button variant="outlined" color="primary">
                                    ADD POST
                                </Button>
                            </Link>
                        )}
                        {authenticated ? (
                            <Button variant="outlined" color="primary" onClick={() => setLogoutModalVisible(true)}>
                                LOGOUT
                            </Button>
                        ) : (
                            <Button variant="outlined" color="primary" onClick={() => setLoginModalVisible(true)}>
                                LOGIN
                            </Button>
                        )}
                    </div>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default TopBar;

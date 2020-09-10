import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

import { useAppState } from "../../state/useAppState";
import "./post.css";

const Post = ({ id, post }) => {
    const [{ authenticated }, { setDeletePostModalData }] = useAppState();

    const handleDeletePost = () => {
        setDeletePostModalData({
            visible: true,
            postTitle: post.title,
            postIndex: id,
        });
    };

    return (
        <Card className="post-card">
            <Link className="post-navigation" to={`/post-details/${id}`}>
                <CardHeader
                    avatar={
                        <Avatar alt="post" aria-label="post" src="/posts76-icon.png" className="post-header-image">
                        </Avatar>
                    }
                    title={post.title}
                    subheader={(post.comments || []).length}
                />
            </Link>
            <CardContent className="post-content">
                <p>
                    {post.body}
                </p>
            </CardContent>
            {authenticated && (
                <CardActions className="post-commands">
                    <Button variant="outlined" color="secondary" onClick={handleDeletePost}>
                        DELETE
                    </Button>
                    <Link className="post-edit" to={`/edit-post/${id}`}>
                        <Button variant="outlined" color="primary" >
                            EDIT
                        </Button>
                    </Link>
                </CardActions>
            )}
        </Card>
    );
};

Post.propTypes = {
    id: PropTypes.number.isRequired,
    post: PropTypes.object.isRequired,
};

export default Post;

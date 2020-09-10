import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";

import { useAppState } from "../../state/useAppState";
import "./postDetails.css";

const PostDetails = ({ match: { params: { postIndex } } }) => {
    const [{ apiPost, authenticated }, { callApiPost, setTitle }] = useAppState();

    useEffect(() => {
        setTitle("Post Details");
        callApiPost(postIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const post = apiPost && apiPost.status === 200 && apiPost.data ? apiPost.data : null;

    return post ? (
        <Fragment>
            <Card className="post-details-card">
                <CardHeader
                    className="width-100"
                    action={authenticated && (
                        <Link className="post-details-edit" to={`/edit-post/${postIndex}`}>
                            <IconButton aria-label="edit">
                                <Icon color="primary">edit</Icon>
                            </IconButton>
                        </Link>
                    )}
                    title="Post"
                />
                <CardContent className="post-details-content">
                    <div className="post-details-table">
                        <h2>{post.title}</h2>
                        {post.body}
                    </div>
                </CardContent>
            </Card>
            <Card className="post-details-card">
                <CardHeader title="Comments" />
                <CardContent>
                    {post.comments && post.comments.map((comment, index) => (
                        <Card key={`comment-${index}`} className="post-details-card">
                            <CardHeader title={comment.name} />
                            <CardContent className="post-details-content">
                                {comment.body}
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </Fragment>
    ) : null;
};

PostDetails.propTypes = {
    match: PropTypes.object.isRequired,
};

export default PostDetails;

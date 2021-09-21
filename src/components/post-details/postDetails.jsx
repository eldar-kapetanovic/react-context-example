import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";

import ApiCallsHelper from "../../helpers/apiCallsHelper";
import ResponseDataParser from "../../helpers/responseDataParser";
import NavigationLink from "../../primitives/navigation-link/navigationLink";
import { useAppState } from "../../state/useAppState";
import "./postDetails.css";

const PostDetails = ({ match: { params: { postId } } }) => {
    const [post, setPost] = useState();
    const [
        { apiPost, authenticated, apiCallStatus },
        { callApiPost, setApplicationTitle, setApiCallStatus },
    ] = useAppState();

    useEffect(() => {
        setApplicationTitle("Post Details");
        setApiCallStatus((state) => ({
            ...state,
            apiCallStatus: ApiCallsHelper.addApiCallToStatus(
                state.apiCallStatus,
                { callerId: "PostDetails", isComponent: true }
            ),
        }));
        callApiPost(postId);
    }, []);

    useEffect(() => {
        if (apiPost && apiCallStatus.ongoing) {
            setApiCallStatus((state) => ({
                ...state,
                apiCallStatus: ApiCallsHelper.removeApiCallFromStatus(
                    state.apiCallStatus,
                    "PostDetails"
                ),
            }));
            setPost(ResponseDataParser.getPostFromResponse(apiPost, postId));
        }
    }, [apiPost]);

    return post ? (
        <>
            <Card className="post-details-card">
                <CardHeader
                    className="width-100"
                    action={authenticated && (
                        <NavigationLink className="post-details-edit" to={`/edit-post/${postId}`}>
                            <IconButton aria-label="edit">
                                <Icon color="primary">edit</Icon>
                            </IconButton>
                        </NavigationLink>
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
                    {post.comments && post.comments.map((comment) => (
                        <Card key={comment.id} className="post-details-card">
                            <CardHeader title={comment.name} />
                            <CardContent className="post-details-content">
                                {comment.body}
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </>
    ) : null;
};

PostDetails.propTypes = {
    match: PropTypes.object.isRequired,
};

export default PostDetails;

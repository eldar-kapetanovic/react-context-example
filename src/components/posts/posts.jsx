import React, { useEffect } from "react";

import ResponseDataParser from "../../helpers/responseDataParser";
import { useAppState } from "../../state/useAppState";
import Post from "../post/post";
import "./posts.css";

const Posts = () => {
    const [{ posts, apiPosts }, { setPosts, setApplicationTitle, setShowExport }] = useAppState();

    useEffect(() => {
        setApplicationTitle("Posts List");
        setShowExport(true);
        return () => setShowExport(false);
    }, []);

    useEffect(() => {
        if (apiPosts) {
            setPosts(ResponseDataParser.getPostsFromResponse(apiPosts));
        }
    }, [apiPosts]);

    return (
        <div className="posts-grid">
            {posts.map((post, index) => post && <Post key={post.id} post={post} />)}
        </div>
    );
};

export default Posts;

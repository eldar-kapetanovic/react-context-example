/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import { useEffect } from "react";
import { useAppState } from "../../state/useAppState";
import Post from "../post/post";
import "./posts.css";

const Posts = () => {
    const [{ posts, apiPosts, updatePosts }, { setPosts, setTitle, setShowExport }] = useAppState();

    useEffect(() => {
        setTitle("Posts List");
        setShowExport(true);
        return () => setShowExport(false);
    }, []);

    useEffect(() => {
        if (apiPosts &&
            apiPosts.status === 200 &&
            Array.isArray(apiPosts.data)) {
            setPosts(apiPosts.data);
        }
    }, [apiPosts]);

    useEffect(() => {
        if (updatePosts &&
            updatePosts.status === 200 &&
            Array.isArray(updatePosts.data)) {
            setPosts(updatePosts.data);
        }
    }, [updatePosts]);

    return (
        <div className="posts-grid">
            {posts.map((post, index) => post && <Post key={`post-${index}`} id={index} post={post} />)}
        </div>
    );
};

export default Posts;

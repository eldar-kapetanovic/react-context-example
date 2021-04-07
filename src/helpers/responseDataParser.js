class ResponseDataParser {
    getPostsFromResponse(response) {
        if (response && response.status === 200) {
            return this.getPostsFromData(response.data);
        }

        return [];
    }

    getPostsFromData(postsData) {
        let posts = [];

        if (postsData && typeof postsData === "object") {
            Object.keys(postsData).forEach((postId) => {
                posts.push({
                    id: postId,
                    title: postsData[postId].title,
                    body: postsData[postId].body,
                    timestamp: postsData[postId].timestamp,
                    comments: this._getPostComments(postsData, postId),
                });
            });
        }

        return posts;
    }

    _getPostComments(postsData, postId) {
        const postComments = [];

        if (!postsData[postId].comments) {
            return [];
        }

        Object.keys(postsData[postId].comments).forEach((commentId) => {
            postComments.push({
                id: commentId,
                name: postsData[postId].comments[commentId].name,
                body: postsData[postId].comments[commentId].body,
                timestamp: postsData[postId].comments[commentId].timestamp,
            });
        });

        return postComments;
    }

    getPostFromResponse(response, postId) {
        if (response && response.status === 200) {
            return this.getPostFromData(response.data, postId);
        }

        return null;
    }

    getPostFromData(postData, postId) {
        let post = null;

        if (postData && typeof postData === "object") {
            post = {
                id: postId,
                title: postData.title,
                body: postData.body,
                timestamp: postData.timestamp,
                comments: [],
            };

            if (postData.comments) {
                Object.keys(postData.comments).forEach((commentId) => {
                    post.comments.push({
                        id: commentId,
                        name: postData.comments[commentId].name,
                        body: postData.comments[commentId].body,
                        timestamp: postData.comments[commentId].timestamp,
                    });
                });
            }
        }

        return post
    }
}

export default new ResponseDataParser();

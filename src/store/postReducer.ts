import { POLICY_POST_ID } from '@constant/index';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Post } from '@type/common';
import { shuffleArray } from '@util/index';

interface PostState {
    expire_timestamp: number;

    policyPost: Post[];

    blogPost: Post[];
}
const initialState: PostState = {
    expire_timestamp: 1,
    policyPost: [],
    blogPost: [],
};

/**
 * lưu trữ các bài viết trên Printerval
 */
const posts = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        //define cac action
        setPrintervalPosts: (state, action: PayloadAction<{ timeStamp: number; list: Post[] }>) => {
            state.expire_timestamp = action.payload.timeStamp;

            state.policyPost = action.payload.list.filter(item => POLICY_POST_ID.includes(item.id) && item.id != 11);

            var blogPost = action.payload.list.filter(item => !POLICY_POST_ID.includes(item.id));
            state.blogPost = shuffleArray<Post>(blogPost);
        },
        shuffleBlog: state => {
            if (state?.blogPost && state.blogPost.length > 0) {
                state.blogPost = shuffleArray<Post>(state.blogPost);
            }
        },
    },
});

export default posts;

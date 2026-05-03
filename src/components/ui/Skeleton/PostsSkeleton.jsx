import React from 'react';
import PostCardSkeleton from './PostCardSkeleton';

const PostsSkeleton = ({ count = 3 }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <PostCardSkeleton key={i} />
        ))}
    </>
);

export default PostsSkeleton;

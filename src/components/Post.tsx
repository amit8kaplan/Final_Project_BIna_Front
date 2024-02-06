
export interface PostData {
    title: string;
    message: string;
    owner: string;
}

interface PostProps {
    post: PostData
}

function Post({ post }: PostProps) {
    return (
        <div>
            <h1>owner:{post.owner} title:{post.title}</h1>
            <h2>{post.message}</h2>
        </div>
    )
}

export default Post
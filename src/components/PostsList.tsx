import { useEffect, useState } from 'react'
import Post, { PostData } from './Post'
// import Alert from './Alert'
import postService, { CanceledError } from "../services/posts-service"

function PostList() {
    const [posts, setPosts] = useState<PostData[]>([])
    const [error, setError] = useState()
    useEffect(() => {
        const { req, abort } = postService.getAllPosts()
        req.then((res) => {
            setPosts(res.data)
        }).catch((err) => {
            console.log(err)
            if (err instanceof CanceledError) return
            setError(err.message)
        })
        return () => {
            abort()
        }
    }, [])

    return (
        <>
            {/* {alertVisibility && <Alert onDismiss={() => { setAlertVisibvility(false) }}>This is my alert</Alert>}
      <button type="button" className="btn btn-primary" onClick={() => setAlertVisibvility(!alertVisibility)}>Toggle Alert</button> */}

            {error && <p className='text-danger'>{error}</p>}
            {posts.map((post, index) =>
                <div className="p-4" key={index}>
                    <Post post={post} />
                </div>
            )}
        </>

    )
}

export default PostList
import { useEffect, useState } from "react"
import Post from "./Post"
import axios from "axios";


interface PostData {
    title: string;
    message: string;
    owner: string;
}

function PostsList() {
    const [posts, setPosts] = useState<PostData[]>([])

    useEffect(() => {
        console.log("use effect")
        axios.get<PostData[]>("http://localhost:3000/studentpost").then((response) => {
            console.log(response.data)
            setPosts(response.data)
        })
        return () => {
            console.log("clean up")
        }
    }, [])
    return (
        <div>
            {posts.map((post, index) => <Post key={index} post={post} />)}
        </div>
    )
}

export default PostsList
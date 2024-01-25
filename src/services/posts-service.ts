import apiClient, { CanceledError } from "./api-client"

import { IPost } from "../Post"

export { CanceledError }
const getAllPosts = () => {
    const abortController = new AbortController()
    const req = apiClient.get<IPost[]>('studentpost', { signal: abortController.signal })
    return { req, abort: () => abortController.abort() }

}

export default { getAllPosts }
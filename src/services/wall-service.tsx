import exp from "constants";
import apiClient from "./api-client";

//todo: i added here idInstractor , now i need to deal with it in the server
export interface IPostforSubmit {
    idTrainer: string;
    nameInstractor: string;
    idInstractor: string;
    title?: string;
    content?: string;
    date: Date;
    _id?: string;
}
interface ILikes {
    _id: string;
    flag: boolean;
    idDapitOrPost: string;
    count: number;
}
export interface Icomment {
    personalName: string
    content: string;
    date: Date;
    _id?: string;
}
export const handleLike = async (idDapitOrPost: string, likes: ILikes[] ) => {
    console.log("handleLike: ", idDapitOrPost);
    let flag = false
    let count = 0
    likes?.forEach((like: any) => {
        if (like.idDapitOrPost === idDapitOrPost) {
            flag = true;
            count = like.count;
        }
    });
    if (flag) {
        await putLike(idDapitOrPost, 'like', count);
    }
    if (!flag) {
        await postLike(idDapitOrPost);
    }
}
export const fetchLikes = async (trainerId: string) => {
    try {
        if (trainerId === undefined) {
            return;
        }
        const likes = await getLikes(trainerId);
        return likes;
    } catch (error) {
        console.error('Error fetching likes:', error);
    }
}
export const fetchComments = async (trainerId: string) => {
    try {
        if (!trainerId) {
            return;
        }
        const comments = await getComments(trainerId);
        return comments;
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}
export const changeFlag = async (idDapitOrPost: string) => {
    try{
        console.log("handleChangeFlag: ", idDapitOrPost)
        const response = (await apiClient.put('/wall/flag/', {idDapitOrPost}))
        console.log ("handleChangeFlag the new flag: ", response.data)
        return response.data;
    }
    catch (error) {
        console.error('Error putting flag:', error);
    }
}
export const getWall = async (trainerId: string) => {
    try{
        console.log("trainerId: ", trainerId)
        const response = await apiClient.get(`/wall/${trainerId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching wall:', error);
    }
}

export const postPost = async (post: IPostforSubmit) => {
    try{
        const response = await apiClient.post("/post/", post);
        return response.data;
    }
    catch (error) {
        console.error('Error posting post:', error);
    }
}

export const getLikes = async (trainerId: string) => {
    try{
        const response = await apiClient.get(`/wall/likes/${trainerId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching likes:', error);
    }
}

export const putLike = async (idDapitOrPost: string, like: string, count: number) => {
    console.log("putLike: ", idDapitOrPost, like, count);
    try{
        const response = (await apiClient.put('/wall/likes/', {idDapitOrPost, like, count}))
        return response.data;
    }
    catch (error) {
        console.error('Error putting like:', error);
    }
}

export const postLike = async (idDapitOrPost: string) => {
    try{
        const response = (await apiClient.post('/wall/likes/', {idDapitOrPost}))
        return response.data;
    }
    catch (error) {
        console.error('Error posting like:', error);
    }
}

export const getComments = async (trainerId: string) => {
    try{
        const response = await apiClient.get(`/wall/comments/${trainerId}`);
        console.log("getComments: ", response.data)
        return response.data;
    }
    catch (error) {
        console.error('Error fetching comments:', error);
    }
}

export const  putComment = async (idDapitOrPost: string, personalName: string, content: string) => {
    try{
        const response = (await apiClient.put('/wall/comments/', {idDapitOrPost, personalName, content}))
        return response.data;
    }
    catch (error) {
        console.error('Error putting comment:', error);
    }
}

export const postComment = async (idDapitOrPost: string, personalName: string, content: string) => {
    try{
        const response = (await apiClient.post('/wall/comments/', {idDapitOrPost, personalName, content}))
        console.log("try1 res postComment: ", response.data)
        return response.data;
    
    }
    catch (error) {
        console.error('try1 Error posting comment:', error);
    }
}

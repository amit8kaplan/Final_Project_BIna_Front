import exp from "constants";
import apiClient from "./api-client";

export interface IPostforSubmit {
    idTrainer: string;
    nameInstractor: string;
    title?: string;
    content?: string;
    date: Date;
    _id?: string;
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

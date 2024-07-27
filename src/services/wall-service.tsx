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

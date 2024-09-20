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
    file: File | null
    filePath?: string;

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
    //console.log("handleLike: ", idDapitOrPost);
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
        //console.log("handleChangeFlag: ", idDapitOrPost)
        const response = (await apiClient.put('/wall/flag/', {idDapitOrPost}))
        //console.log ("handleChangeFlag the new flag: ", response.data)
        return response.data;
    }
    catch (error) {
        console.error('Error putting flag:', error);
    }
}
export const getWall = async (trainerId: string) => {
    try{
        //console.log("trainerId: ", trainerId)
        const response = await apiClient.get(`/wall/${trainerId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching wall:', error);
    }
}
export const postPost = async (post: IPostforSubmit) => {
    const formData = new FormData();

    // Log individual fields
    //console.log("postPost idTrainer:", post.idTrainer);
    //console.log("postPost nameInstractor:", post.nameInstractor);
    //console.log("postPost idInstractor:", post.idInstractor);
    //console.log("postPost title:", post.title);
    //console.log("postPost content:", post.content);
    //console.log("postPost date:", post.date);
    //console.log("postPost file:", post.file);

    formData.append("idTrainer", post.idTrainer);
    formData.append("nameInstractor", post.nameInstractor);
    formData.append("idInstractor", post.idInstractor);
    if (post.title) formData.append("title", post.title);
    if (post.content) formData.append("content", post.content);
    formData.append("date", post.date.toISOString()); // Convert date to ISO string
    if (post._id) formData.append("_id", post._id);
    if (post.file !=null )
        if (post.file) formData.append("file", post.file); // Correctly append the file
    //console.log("postPost", JSON.stringify(formData))
    // Log FormData entries
    for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
            //console.log(`postPost ${pair[0]}: [File] name=${pair[1].name}, size=${pair[1].size}, type=${pair[1].type}`);
        } else {
            //console.log(`postPost ${pair[0]}: ${pair[1]}`);
        }
    }

    try {
        const response = await apiClient.post("/post/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error posting post:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};

export const getLikes = async (trainerId: string) => {
    try{
        const response = await apiClient.get(`/wall/likes/${trainerId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching likes:', error);
    }
}
export const getFile = async (filePath: string) => {
    //console.log("getFile in wall-service")
    filePath = encodeURIComponent(filePath)
    try {
        const response = await apiClient.get(`/post/getFileByPathFile/${filePath}`, {
            responseType: 'blob' // Ensure the response is treated as a binary file
        });

        if (response.status === 200) {
            //console.log("getFile the res is 200")
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = filePath.split('/').pop(); // Extract the filename from the filePath
            link.setAttribute('download', fileName || 'download'); // Set the file name
            document.body.appendChild(link);
            link.click();
            link.remove();
            return 200;
        } else {
            throw new Error('Failed to download file');
        }
    } catch (error) {
        console.error('Error getting file:', error);
        throw error;
    }
};

export const putLike = async (idDapitOrPost: string, like: string, count: number) => {
    //console.log("putLike: ", idDapitOrPost, like, count);
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
        //console.log("getComments: ", response.data)
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
        //console.log("try1 res postComment: ", response.data)
        return response.data;
    
    }
    catch (error) {
        console.error('try1 Error posting comment:', error);
    }
}

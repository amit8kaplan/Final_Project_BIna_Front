// import apiClient from "./api-client"
import apiClientWithPython5000 from "./api-client-py";

export const postChat = async (question: string) => {
    const body = {"question": question};
    //console.log('body:', body);
    try {
        const response = await apiClientWithPython5000.post('/ai', body);
        //console.log('response:', response.data);
        return response.data
    } catch (error) {
        console.error('Error posting chat:', error);
    }
}

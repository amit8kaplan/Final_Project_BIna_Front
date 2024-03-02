import apiClient from "./api-client"
import { handleAccessToken } from "./user-service";
interface Course {
  name: string;
  owner: string;
  owner_name: string;
  description: string;
  Count: number;
  videoUrl: string;
}
// const handleAccessToken = () => {
//     const accessToken = sessionStorage.getItem('accessToken');
//     if (!accessToken) {
//         console.error('No access token found');
//         return null;
//     }
//     const headers = { 
//         'Content-Type': 'application/json',
//          Authorization: `Bearer ${accessToken}`,
// };
//     return headers;
    
// }


const fetchCourses = async () => {
    const headers = handleAccessToken();
    if (headers == null) return;
    return (await apiClient.get("/course/", {headers})).data ?? [];
}

const fetchData = async () => {
    try {
        const response = await apiClient.get('/course');
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

const fetchCoursesBySearch = async (searchQuery: string, selectedOption: string) => {
    try {
        const queryString = `/?${selectedOption}=${searchQuery}`;
        console.log("the query string is:" + queryString)
        const response = await apiClient.get(`/course${queryString}`);
        console.log("the response is:", response.data)
        console.log(JSON.stringify(response.data))
        return response.data
    } catch (error) {
        console.error('Error fetching courses by search:', error);
    }
}
const fetchCoursesByOwner = async () => {
    try{
        const headers = await handleAccessToken();
        if (headers == null) return;
        const response = await apiClient.get('/course/:1234', {headers});
        return response.data
    
    }
    catch (error) {
        console.error('Error fetching courses by owner:', error);
    }   
}

const putCourse = async (course: Course, courseID :string) => {
    const headers = await handleAccessToken();
    if (headers == null) return;
    try {
        const response = await apiClient.put(`/course/${courseID}`,  course , {headers});
        return response.data
    } catch (error) {
        console.error('Error putCourse course:', error);
    }
}

const postCourse = async (course: Course) =>{
    const headers = await handleAccessToken();
    console.log("the headers are:", headers)
    console.log("the course is:", course)
    if (headers == null) return;
    try {
        return await apiClient.post('/course/', course , {headers});
    } catch (error) {
        console.error('Error postCourse course:', error);
    }

}
const postVideo = async (vidScr: File) =>{

    try {
        const formData = new FormData();
        formData.append('video', vidScr);
        const videoRes = await apiClient.post('/course/upload_Video', formData ,{
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
        });
        console.log("the video response is:", videoRes.data.url)
        return videoRes.data.url;
    } catch (error) {
        console.error('Error postVideo course:', error);
    }

}
const deleteCourse = async (courseID: string) => {
    const headers = await handleAccessToken();
    if (headers == null) return;
    try {
        const response = await apiClient.delete(`/course/${courseID}`, {headers});
        console.log("the response is:", response.data)
        return response.data
    } catch (error) {
        console.error('Error deleteCourse course:', error);
    }
}

export {
    fetchCourses,
    fetchData,
    fetchCoursesBySearch,
    postCourse,
    postVideo,
    putCourse,
    deleteCourse,
    fetchCoursesByOwner
}
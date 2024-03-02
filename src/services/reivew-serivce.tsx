import apiClient from "./api-client"
import { handleAccessToken } from "./user-service";
import { fetchCoursesBySearch } from "./course-service";
interface IcourseReview {
    course_id: string;
    course_name: string;
    title: string;
    message: string;
    score: number;
    owner_id: string;
    owner_name: string;
  }
  interface IcourseReviewForm {
    title: string;
    message: string;
    score: number;
    course_id: string;
  }

  const fetchReviewsByCourseID = async (courseID: string) => {
    try {
        const quaryString = `/?$course_id=${courseID}`;
        const response = await apiClient.get(`/review${quaryString}`);
        console.log("the response is:" + response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
  }
  const postReview = async (rev: IcourseReview) => {
    const headers = handleAccessToken();
    if (headers == null || rev.course_id=='') return;
    try {
        const response = await apiClient.post('/review', rev, {headers});
        return response.data
    } catch (error) {
        console.error('Error posting review:', error);
    }
}
export{
    fetchReviewsByCourseID,
    postReview
}
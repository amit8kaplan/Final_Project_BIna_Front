import apiClient from "./api-client"
interface IcourseReview {
    course_id: string;
    course_name: string;
    title: string;
    message: string;
    score: number;
    owner_id: string;
    owner_name: string;
  }

  const fetchReviewsByCourseID = async (courseID: string) => {
    try {
        const quaryString = `/?$course_id=${courseID}`;
        const response = await apiClient.get(`/review/${quaryString}`);
        console.log("the response is:" + response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
  }
  const postReview = async (review: IcourseReview) => {
    const headers = handleAccessToken();
    if (headers == null) return;
    try {
        const response = await apiClient.post('/review', review, {headers});
        return response.data
    } catch (error) {
        console.error('Error postReview course:', error);
    }

export{
    fetchReviewsByCourseID
}
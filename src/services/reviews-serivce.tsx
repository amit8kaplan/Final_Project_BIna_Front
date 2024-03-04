import apiClient from "./api-client"
import { handleAccessToken } from "./user-service";

interface IcourseReview {
  _id?: string; // Include the ID for updates
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

// Fetch reviews for a specific course by ID
const fetchReviewsByCourseID = async (courseID: string) => {
  try {
    const queryString = `/?course_id=${courseID}`;
    const response = await apiClient.get(`/review${queryString}`);
    console.log("the response is:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
}

// Post a new review
const postReview = async (review: IcourseReview) => {
  const headers = handleAccessToken();
  if (headers == null || review.course_id === '') return;
  try {
    const response = await apiClient.post('/review', review, { headers });
    return response.data;
  } catch (error) {
    console.error('Error posting review:', error);
  }
}

// Fetch reviews submitted by the current user
const fetchMyReviews = async (userId: string) => {
  const headers = handleAccessToken();
  if (headers == null) return;
  try {
    const response = await apiClient.get(`/review/user/${userId}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching my reviews:', error);
  }
}

// Update an existing review
const updateReview = async (review: IcourseReview) => {
  const headers = handleAccessToken();
  if (headers == null || !review._id) return; // Ensure review ID is present for update
  try {
    const response = await apiClient.put(`/review/${review._id}`, review, { headers });
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
  }
}


const fetchReviewsByUserID = async (userID) => {
  try {
    const headers = handleAccessToken();
    if (!headers) return [];
    const response = await apiClient.get(`/reviews/user/${userID}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews by user ID:', error);
    return [];
  }
};


export {
  fetchReviewsByCourseID,
  postReview,
  fetchMyReviews,
  updateReview,
  fetchReviewsByUserID
}

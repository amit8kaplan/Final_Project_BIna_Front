import apiClient from "./api-client"

const fetchCourses = async () => {
    return (await apiClient.get("/course/", {
        headers: {
            Authorization: `Berear ${sessionStorage.getItem("accessToken")}`
        }
    })).data ?? []
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
        const response = await apiClient.get(`/course${queryString}`);
        return response.data
    } catch (error) {
        console.error('Error fetching courses by search:', error);
    }
}
export {
    fetchCourses,
    fetchData,
    fetchCoursesBySearch
}
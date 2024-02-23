import apiClient from "./api-client"

const fetchCourses = async () => {
    return (await apiClient.get("/course/", {
        headers: {
            Authorization: `Berear ${sessionStorage.getItem("accessToken")}`
        }
    })).data ?? []
}



export {
    fetchCourses
}
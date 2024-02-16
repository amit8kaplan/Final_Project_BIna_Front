import axios from "axios";

export async function getRandomPhoto() {
    try {
        const response = await axios.get('https://source.unsplash.com/random?book,course,students,studies,class,reading');
        const photoUrl = response.request.responseURL; // Axios doesn't automatically follow redirects, so we need to access the responseURL property to get the final URL.
        return photoUrl;
    } catch (error) {
      console.error('Error fetching random photo:', error);
    }
}
import axios from "axios";

export async function homepagephoto(query: string) {
  try {
    const response = await axios.get(
      `https://source.unsplash.com/random?${query}`
    );
    const photoUrl = response.request.responseURL; // Axios doesn't automatically follow redirects, so we need to access the responseURL property to get the final URL.
    //console.log("type Photo URL:", typeof photoUrl);
    return photoUrl;
  } catch (error) {
    console.error("Error fetching random photo:", error);
  }
}

export async function downloadPhoto() {
  try {
    const res2 = await axios.get(
      "http://localhost:3000/auth/register/randomPhoto?query=man,womam,people,portrait"
    );
    //console.log("the res2 of unsplah is: " + JSON.stringify(res2));
    return {
      id: res2.data.id,
      url: res2.data.urls.full,
      downloadLocation: res2.data.links.download_location,
    };
  } catch (error) {
    console.error("Error downloading photo:", error);
  }
}

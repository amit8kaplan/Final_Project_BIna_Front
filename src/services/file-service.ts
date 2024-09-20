import apiClient from "./api-client";

interface IUpoloadResponse {
    url: string;
}
export const uploadPhoto = async (photo: File, accessToken: string) => {
    return new Promise<string>((resolve, reject) => {
        //console.log("Uploading photo..." + photo)

        //console.log("Uploading photo access token..." + JSON.stringify(accessToken, null, 2))
        const formData = new FormData();
        if (photo) {
            formData.append("file", photo);
            //console.log("Uploading photo..." + photo)
            apiClient.post<IUpoloadResponse>('/user', formData, {
                headers: {
                    'Content-Type': 'image/jpeg',
                    'Authorization': `JWT ${accessToken}`
                }
            }).then(res => {
                //console.log("upliad res: " + JSON.stringify(res, null, 2));
                resolve(res.data.url);
            }).catch(err => {
                //console.log("upliad err: " + JSON.stringify(err, null, 2));
                reject(err);
            });
        }
    });
}


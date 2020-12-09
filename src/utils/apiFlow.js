import axios from 'axios';

const apiUrls = {
    baseUrl: 'http://localhost:3000',
    uploadEndpoint: '/api/upload',
    mergeEndpoint: '/api/merge',
}

const fileAPI = {
    async uploadSlicedFiles(files) {
        const url = apiUrls.baseUrl + apiUrls.uploadEndpoint;
        console.log('---files uploade', files);
        let res = await axios.post(url, files);
        console.log('---post response---', res);
        return res;
    },
    async mergeRequest(name = 'uploadname') {
        const url = apiUrls.baseUrl + apiUrls.mergeEndpoint;
        let res = await axios.get(url, { fileName: name })
        return new Promise((resolve) => {
            if (res) {
                resolve(res);
            }
        })
    }
}

export { fileAPI };
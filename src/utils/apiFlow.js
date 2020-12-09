import axios from 'axios';

const apiUrls = {
    baseUrl: 'http://localhost:3000',
    uploadEndpoint: '/api/upload',
    mergeEndpoint: '/api/merge',
    verifyEndpoint: '/api/verify'
}

const fileAPI = {
    async uploadSlicedFiles(files) {
        const url = apiUrls.baseUrl + apiUrls.uploadEndpoint;
        console.log('---files uploade', files);
        let res = await axios.post(url, files);
        console.log('---post response---', res);
        return res;
    },
    async mergeRequest(name, fileHash, size) {
        const url = apiUrls.baseUrl + apiUrls.mergeEndpoint;
        let res = await axios.post(url, { fileName: name, fileHash, size  })
        return new Promise((resolve) => {
            if (res) {
                resolve(res);
            }
        })
    },
    async verifyFileOnServer(fileName, hash) {
        const url = apiUrls.baseUrl + apiUrls.verifyEndpoint;
        return await axios.post(url, { fileName, hash });
    }
}

export { fileAPI };
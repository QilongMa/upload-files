import axios from 'axios';

const baseUrl = 'http://localhost:3000';

const fileAPI = {
    async uploadSlicedFiles(files) {
        const url = baseUrl + '/api/upload';
        let res = axios.post(url, { files });
        console.log('----upload sliced files', res)
        return new Promise((resolve) => {
            if(res) {
                resolve(res);
            }
        })
    },
    async mergeRequest(name = 'uploadname') {
        const url = baseUrl + '/api/merge';
        let res = await axios.get(url, { fileName: name })
        console.log('---res---', res);

        return new Promise((resolve) => {
            if (res) {
                resolve(res);
            }
        })
    }
}

export { fileAPI };
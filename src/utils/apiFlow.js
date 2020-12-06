import axios from 'axios';

const baseUrl = 'http://localhost:3000';

function request({
    url,
    method = "post",
    data,
    headers = {
        
    },
    requestList
}) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        Object.keys(headers).forEach(key =>
            xhr.setRequestHeader(key, headers[key])
        );
        xhr.send(data);
        xhr.onload = e => {
            resolve({
                data: e.target.response
            });
        };
    });
}


const fileAPI = {
    async uploadSlicedFiles(files) {
        const url = baseUrl + '/api/upload';
        // console.log('---formdata', Object.keys(files))

        let res = await request({url, data:files});
        console.log('----upload sliced files', res)
        return res;
        return new Promise((resolve) => {
            if (res) {
                resolve(res);
            }
        })
    },
    // async uploadSlicedFiles(files) {
    //     const url = baseUrl + '/api/upload';
    //     // console.log('---formdata', Object.keys(files))

    //     let res = axios.post(url, files, {
    //         headers: {
    //             "Content-Type": "multipart/form-data",
    //             transformRequest: [files => files]
    //         }
    //     });
    //     console.log('----upload sliced files', res)
    //     return new Promise((resolve) => {
    //         if (res) {
    //             resolve(res);
    //         }
    //     })
    // },
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
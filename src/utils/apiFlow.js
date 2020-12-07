import axios from 'axios';

const baseUrl = 'http://localhost:3000';

export function request({
    url,
    method = "post",
    data,
    onProgress = e=>e,
    headers = {},
    requestList
}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = onProgress
        xhr.open(method, baseUrl+url);
        Object.keys(headers).forEach(key =>
            xhr.setRequestHeader(key, headers[key])
        );
        xhr.send(data);

        xhr.onreadystatechange = e => {
            if(xhr.readyState === 4) {
                if(xhr.status === 200){
                    if(requestList){
                        // 成功后删除列表
                        const i = requestList.findIndex(req=>req===xhr)
                        requestList.splice(i, 1)
                    }
                    resolve({
                        data: e.target.response
                    });
                }else if(xhr.status === 500){
                    reject('报错了 大哥')
                }
              }
        };
    });
}


const fileAPI = {
    async uploadSlicedFiles(files) {
        const url = '/api/upload';
        // console.log('---formdata', Object.keys(files))

        let res = await request({url, data:files});
        console.log('----upload sliced files', res)
    },
    // async uploadSlicedFiles(files) {
    //     const url = baseUrl + '/api/upload';
    //     console.log('---formdata', files)

    //     let res = axios.post(url, files);
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
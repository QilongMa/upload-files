import axios from 'axios';

const baseUrl = 'http://localhost:3000';


export const uploadSlicedFiles = (files) => {
    axios.post(baseUrl, {files})
        .then(res => {
            console.log('----upload res---', res);
        });
}
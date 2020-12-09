import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { chunkFiles, limitRequest } from './utils/fileHandler';
import { fileAPI } from './utils/apiFlow';
import './index.scss';

export const HomeComponent = () => {

    const [file, setFile] = useState(null);

    const onChange = (e) => {
        if(e.target.files && e.target.files.length) {
            const data = e.target.files[0];
            setFile(data);
            console.log(file)
        }
    }

    async function handleUpload() {
        if(file) {
            let data = chunkFiles(file);
            data = data.map((item, index) => {
                return {
                    chunk: item,
                    hash: file.name + '-' + index
                }
            })
            console.log('---wait to upload---', data);
            await uploadChunks(data);
        }
    }
    // mergeRequest, uploadSlicedFiles
    async function uploadChunks(data) {
        const dataList = data.map(({chunk, hash}) => {
            let formData = new FormData();
            formData.append("chunk", chunk.file);
            formData.append("hash", hash);
            formData.append("filename", file.name);
            formData.append("filehash", file.hash);
            return {formData};
        })
        // .map(async ({formData}) => {
        //     return fileAPI.uploadSlicedFiles(formData);
        // })
        // console.log('--watit to upload', dataList)
        let res = await limitRequest(dataList);

        // let sentData = await Promise.all(dataList);
        // console.log('---uploaded---', res);
        await fileAPI.mergeRequest();
    }

    return (
        <div className="app-container">
            <input type="file" onChange={onChange} />
            <button className="btn-upload" onClick={handleUpload}>Upload</button>
        </div>
    )
}

const host = document.getElementById("app");
host ? ReactDOM.render(<HomeComponent />, host) : null;

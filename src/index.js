import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { chunkFiles, limitRequest } from './utils/fileHandler';
import { fileAPI } from './utils/apiFlow';
import SparkMD5 from 'spark-md5';
import './index.scss';

export const HomeComponent = () => {

    const [file, setFile] = useState(null);
    const [hash, setHash] = useState("");
    const SIZE = 1024;

    const onChange = (e) => {
        if(e.target.files && e.target.files.length) {
            const data = e.target.files[0];
            setFile(data);
            console.log(file)
        }
    }

    async function calculateHash() {
        return new Promise(resolve => {
            const spark = new SparkMD5.ArrayBuffer();
            const reader = new FileReader();
            const size = file.size;
            const offset = 1024 * 1024;
            let chunks = [file.slice(0, offset)];

            let cur = offset;
            while(cur < size) {
                let mid = cur + offset/2;
                chunks.push(file.slice(cur, cur + 2));
                chunks.push(file.slice(mid, mid + 2));
                cur += offset;
            }

            reader.readAsArrayBuffer(new Blob(chunks));
            reader.onload = e => {
                spark.append(e.target.result);
                resolve(spark.end());
            }
        })
    }

    async function handleUpload() {
        if(file) {
            let data = chunkFiles(file);
            
            console.log('---wait to upload---', data);
            const fileHash = await calculateHash();
            setHash(fileHash);

            const { uploaded, uploadedList } = fileAPI.verifyFileOnServer(file.name, fileHash);

            if(uploaded) {
                return '秒传成功';
            }

            data = data.map((item, index) => {
                const chunkName = file.name + '-' + index;
                return {
                    chunk: item,
                    chunkHash: chunkName,
                    index,
                    progress: uploadedList.indexOf(chunkName) > -1 ? 100 : 0,
                    size: item.size,
                    fileHash
                }
            })


            await uploadChunks(data);
        }
    }
    // mergeRequest, uploadSlicedFiles
    async function uploadChunks(data) {
        const dataList = data.map(({chunk, chunkHash}) => {
            let formData = new FormData();
            formData.append("chunk", chunk.file);
            formData.append("hash", chunkHash);
            formData.append("filename", file.name);
            formData.append("fileHash", hash);
            return {formData};
        })
        // .map(async ({formData}) => {
        //     return fileAPI.uploadSlicedFiles(formData);
        // })
        // console.log('--watit to upload', dataList)
        await limitRequest(dataList);

        await fileAPI.mergeRequest(file.name, hash, SIZE);
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

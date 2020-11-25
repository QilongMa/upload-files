import React, {useState} from 'react';
import ReactDOM from 'react-dom';

export const HomeComponent = () => {

    const [file, setFile] = useState(null);

    const onChange = (e) => {
        if(e.target.files && e.target.files.length) {
            const data = e.target.files[0];
            setFile(data);
            console.log(file)
        }
    }

    const onClickUploadBtn = () => {
        console.log('---start to upload---', file);
    }

    return (
        <div className="app-container">
            <input type="file" onChange={onChange} />
            <button className="btn-upload" onClick={onClickUploadBtn}>Upload</button>
        </div>
    )
}

const host = document.getElementById("app");
host ? ReactDOM.render(<HomeComponent />, host) : null;

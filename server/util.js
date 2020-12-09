const fse = require('fs-extra');
const path = require('path');

exports.extractExt = filename => filename && filename.slice(filename.lastIndexOf("."), filename.length);

exports.resolvePost = req => {
    return new Promise(resolve => {
        let chunkData = '';
        req.on("data", data => {
            chunkData += data;
        })
        console.log('----resolvepost----', chunkData)
        
        req.on("end", () => {
            resolve(JSON.parse(chunkData));
        })
    })
}

exports.getUploadedList = async (path) => {
    return fse.existsSync(path) ? (await fse.readdir(path)).filter(name => name[0] !== '.') : [];
}

const pipeStream = (filePath, writeStream) => {
    return new Promise(resolve => {
        const readStream = fse.createReadStream(filePath);
        readStream.on("end", () => {
            fse.unlinkSync(filePath);
            resolve();
        })
        readStream.pipe(writeStream);
    })
}

exports.mergeFiles = async (files, target, size) => {
    await Promise.all(
        files.map((file, idx) => {
            return pipeStream(
                file,
                fse.createWriteStream(target, {
                    start: idx * size,
                    end: (idx+1) * size
                })
            )
        })
    )
}
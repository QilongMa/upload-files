const fse = require('fs-extra');
const path = require('path');

exports.extractExt = filename => filename && filename.slice(filename.lastIndexOf("."), filename.length);

exports.resolvePost = req => {
    return new Promise(resolve => {
        let chunkData = '';
        req.on("data", data => {
            chunkData += data;
        })
        // console.log('----resolvepost----', chunkData)
        
        req.on("end", () => {
            resolve(JSON.parse(chunkData));
        })
    })
}

exports.getUploadedList = async (path) => {
    const res = fse.existsSync(path) ? (await fse.readdir(path)).filter(name => name[0] !== '.') : [];
    return res;
}

const pipeStream = (filePath, writeStream) => {
    return new Promise(resolve => {
        const readStream = fse.createReadStream(filePath);
        readStream.on("end", () => {
            // fse.unlinkSync(filePath);
            resolve();
        })
        console.log(readStream, writeStream)
        readStream.pipe(writeStream);
    })
}

exports.mergeFiles = async (files, target, size) => {
    // console.log('----merge files, ', files, target, size);
    await Promise.all(
        files.map((file, idx) => {
            console.log('---file-------', file)
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
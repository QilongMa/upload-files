const path = require('path');
const fse = require("fs-extra");
const { extractExt, resolvePost, getUploadedList, mergeFiles } = require("./util");
const multiparty = require('multiparty');

class Controller {
    constructor(destination) {
        this.STORE_DIR = destination;
    }

    async mergeFileChunks(filePath, fileHash, size) {
        const dir = path.resolve(this.STORE_DIR, fileHash);
        let paths = await fse.readdir(dir);
        paths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
        paths = paths.map(p => path.resolve(dir, p));
        await mergeFiles(paths, filePath, size);
    }

    async handleUpload(request, response) {
        const multiForm = new multiparty.Form();
        multiForm.parse(request, async (err, field, file) => {
            if(err) {
                console.log('--err--', err);
                return;
            }
            const [chunk] = file.chunk;
            const [hash] = field.hash;
            const [filename] = field.filename;
            const [fileHash] = field.fileHash;
            // console.log('---upload chunks---', chunk, hash, filename)
            const filePath = path.resolve(this.STORE_DIR, `${fileHash}${extractExt(filename)}`);
            const chunkDir = path.resolve(this.STORE_DIR, fileHash);

            if(fse.existsSync(filePath)) {
                response.end("file exists");
                return;
            }
            if(!fse.existsSync(chunkDir)) {
                await fse.mkdirs(chunkDir);
            }
            await fse.move(chunk.path, `${chunkDir}/${hash}`);
            response.end("received file chunk ", hash);
        })
    }

    async handleMerge(request, response) {
        const data = await resolvePost(request);
        const { fileHash, fileName, size } = data;
        const ext = extractExt(fileName);
        const filePath = path.resolve(this.STORE_DIR, `${fileHash}${ext}`);

        console.log('---merge chunks on server---', fileHash, fileName, size, ext, filePath)
        await this.mergeFileChunks(filePath, fileHash, size);

        response.end(
            JSON.stringify({
                code: 0,
                message: "file merged success"
            })
        )
    }

    async handleVerify(request, response) {
        const data = await resolvePost(request);
        const { fileName, hash } = data;
        const ext = extractExt(fileName);
        const filePath = path.resolve(this.STORE_DIR, `${hash}${ext}`);

        let uploaded = false;
        let uploadedList = [];
        if(fse.existsSync(filePath)) {
            uploaded = true;
        }
        else {
            uploadedList = await getUploadedList(path.resolve(this.STORE_DIR, hash));
        }
        console.log('--uploadedList--', uploadedList)
        response.end(
            JSON.stringify({
                uploaded,
                uploadedList
            })
        )
    }
}

module.exports = Controller;
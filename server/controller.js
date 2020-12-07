const path = require('path');
const fse = require("fs-extra");
const { extractExt } = require("./util");
const multiparty = require('multiparty');

class Controller {
    constructor(destination) {
        this.STORE_DIR = destination;
    }
    // mergeFileChunks
    async mergeFileChunks(filePath, fileHash, size) {
        const dir = path.resolve(this.STORE_DIR, fileHash);
        let paths = await fse.readdir(dir);
        paths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
        paths = paths.map(p => path.resolve(dir, p));
        await mergeFiles(paths, filePath, size);
    }

    // handleUpload
    async handleUpload(request, response) {
        const multiForm = new multiparty.Form();
        multiForm.parse(request, async (err, field, file) => {
            if(err) {
                console.log('--err--', err);
                return;
            }
            console.log('----file--ds--', field, file);
            // const [chunk] = file.chunk;
            const [hash] = field.hash;
            const [filename] = field.filename;
            const [filehash] = field.filehash;
            const filePath = path.resolve(this.STORE_DIR, `${filehash}${extractExt(filename)}`);
            const chunkDir = path.resolve(this.STORE_DIR, filehash);

            if(fse.existsSync(filePath)) {
                response.end("file exists");
                return;
            }
            if(!fse.existsSync(chunkDir)) {
                await fse.mkdirs(chunkDir);
            }
            // await fse.move(chunk.path, `${chunkDir}/${hash}`);
            response.end("received file chunk ", hash);
        })
    }


    // handleMerge
    async handleMerge(request, response) {
        // await

        response.end('merge')
    }
    // handleVerify
}

module.exports = Controller;
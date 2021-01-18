// const { WriteStream } = require("fs-extra");
// const fse = require("fs-extra");


// const pipeStream = (filePath, WriteStream) => {
//     return new Promise(resolve => {
//         const readStream = fse.createReadStream(filePath);
//         readStream.on("end", () => {
//             fse.unlinkSync(filePath);
//             resolve();
//         })
//         readStream.pipe(WriteStream);
//     })
// }

// exports.mergeFiles = async (files, destination, size) => {
//     await Promise.all(
//         files.map((file, index) => {
//             return pipeStream(
//                 file,
//                 fse.createWriteStream(destination, {
//                     start: index * size,
//                     end: (index+1) * size
//                 })
//             )
//         })
//     )
// }


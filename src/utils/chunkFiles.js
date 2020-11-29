const CHUNK_SIZE = 1 * 1024;
// const CHUNK_SIZE = 10 * 1024 * 1024;

export function chunkFiles(file, chunkSize = CHUNK_SIZE) {
    const chunksList = [];
    let idx = 0;
    const size = file.size;

    while(idx < size) {
        chunksList.push({ file: file.slice(idx, idx + chunkSize)});
        idx += chunkSize;
    }

    return chunksList;
}


import { fileAPI } from "./apiFlow";
const OFF_SET = 1024 * 1024;

const upload = fileAPI.uploadSlicedFiles;

export function chunkFiles(file, chunkSize = OFF_SET) {
    const chunksList = [];
    let idx = 0;
    const size = file.size;

    while (idx < size) {
        chunksList.push({ file: file.slice(idx, idx + chunkSize) });
        idx += chunkSize;
    }

    return chunksList;
}

export async function limitRequest(requests, limit = 4) {
    return new Promise(resolve => {
        if (requests.length === 0) {
            resolve([]);
            return;
        }

        let len = requests.length;
        let inProcess = 0;
        let complete = 0;
        let index = 0;
        let res = new Array(len);

        function run() {
            if (complete === len) {
                resolve(res);
                return;
            }

            for (; index < len && inProcess < limit; index++) {
                inProcess++;
                upload(requests[index].formData).then(data => {
                    inProcess--;
                    complete++;
                    res[index] = data;
                    run();
                })
            }
        }

        run();
    });
}
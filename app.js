import { run } from './src/service.js';
import { data } from './data/data.js';

const entrypoint = () => {
    try {
        const result = run(process.argv, data)
        console.log(JSON.stringify(result))
    } catch(err) {
        console.log(err.message ? err.message : err)
    }
}

entrypoint()

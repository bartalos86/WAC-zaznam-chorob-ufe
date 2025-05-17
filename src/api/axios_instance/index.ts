import axios from "axios";

const AXIOS_INSTANCE = axios.create({
    baseURL: 'http://localhost:300081/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default AXIOS_INSTANCE
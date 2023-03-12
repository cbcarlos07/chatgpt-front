import axios from 'axios'

const URL = process.env.REACT_APP_HOST

const setAuthToken = () => {
    if (localStorage.getItem('token')) {
        //applying token
        api.defaults.headers['x-access-token'] = localStorage.getItem('token');
    } else {
        //deleting the token from header
        delete api.defaults.headers['x-access-token'];
    }
}




const api = axios.create({
    baseURL: URL,
    
})

export {api, setAuthToken}
import axios from 'axios';
import { setUser } from '../reducers/userReducer';
import { APi_URL } from '../config';

export const registration = (email, password) => {
    return async dispatch => {
        try {
            const response = await axios.post(`${APi_URL}api/auth/registration`, {
                email,
                password
            })
            alert(response.data.message)
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

export const login = (email, password) => {
    return async dispatch => {
        try {
            const response = await axios.post(`${APi_URL}api/auth/login`, {
                email,
                password
            })

            dispatch(setUser(response.data.user));
            localStorage.setItem('token', response.data.token);

        } catch (e) {
            alert(e.response.data.message)
        }

    }
}

export const auth = () => {
    return async dispatch => {

        try {
            const response = await axios.get(`${APi_URL}api/auth/auth`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })

            dispatch(setUser(response.data.user));
            localStorage.setItem('token', response.data.token);

        } catch (e) {
            console.log(e.response.data.message);
            localStorage.removeItem('token');
        }

    }
}

export const uploadAvatar = (file) => {
    return async dispatch => {

        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${APi_URL}api/files/avatar`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })

            dispatch(setUser(response.data))

        } catch (e) {
            console.log(e);

        }

    }
}

export const deleteAvatar = () => {
    return async dispatch => {

        try {

            const response = await axios.delete(`${APi_URL}api/files/avatar`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })

            dispatch(setUser(response.data))

        } catch (e) {
            console.log(e);

        }

    }
}


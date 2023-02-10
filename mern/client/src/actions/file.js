import axios from "axios";
import { hideLoader, showLoader } from "../reducers/appReducer";
import { addFIle, deleteFIleAction, setFiles } from "../reducers/fileReducer";
import { addUploader, changeUploader, showUploader } from "../reducers/uploadReducer";
import {APi_URL} from '../config';

export function getFiles(dirId, sort) {
    return async dispatch => {
        try {
            dispatch(showLoader());
            let url = `${APi_URL}api/files`;

            if(dirId) {
                url = `${APi_URL}api/files?parent=${dirId}`;
            }

            if(sort) {
                url = `${APi_URL}api/files?sort=${sort}`;
            }

            if(sort && dirId) {
                url = `${APi_URL}api/files?sort=${sort}&parent=${dirId}`;
            }

            const response = await axios.get(url, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            dispatch(setFiles(response.data))
        } catch (e) {
            console.log(e.response.data.message)
        } finally {
            dispatch(hideLoader())
        }
    }
}

export function createDir(dirId, name) {
    return async dispatch => {
        try {
            const response = await axios.post(`${APi_URL}api/files`, {
                name: name,
                parent: dirId,
                type: 'dir'
            }, 
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            dispatch(addFIle(response.data))
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

export function uploadFile(file, dirId) {
    return async dispatch => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            if(dirId) {
                formData.append('parent', dirId);
            }

            const fileUpload = {name: file.name, progress: 0, id: Date.now()};
            dispatch(showUploader());
            dispatch(addUploader(fileUpload));

            const response = await axios.post(`${APi_URL}api/files/upload`,
            formData, 
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                onUploadProgress: progressEvent => {
                    const totalLength = progressEvent.total;
                    // const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    if(totalLength) {
                        // let progress = Math.round(progressEvent.loaded * 100 / totalLength);
                        fileUpload.progress =  Math.round(progressEvent.loaded * 100 / totalLength);
                        dispatch(changeUploader(fileUpload));
                    }
                }
            });
            dispatch(addFIle(response.data))
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

export async function downloadFile(file) {
    const response = await fetch(`${APi_URL}api/files/download?id=${file._id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    if(response.status === 200) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove(); 
    }
}

export function deleteFile(file) {
    return async dispatch => {
        try {
          
            const response = await axios.delete(`${APi_URL}api/files?id=${file._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(deleteFIleAction(file._id));
            alert(response.data.message)
        } catch (e) {
            alert(e.response.data.message);
        }
    }
}

export function searchFiles(search) {
    return async dispatch => {
        try {
          
            const response = await axios.get(`${APi_URL}api/files/search?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(setFiles(response.data));
        } catch (e) {
            alert(e.response.data.message);
        } finally {
            dispatch(hideLoader())
        }
    }
}
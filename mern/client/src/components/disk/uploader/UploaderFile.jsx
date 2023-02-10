import React from "react";
import { useDispatch } from "react-redux";
import { removeUploader } from "../../../reducers/uploadReducer";
import './uploader.css';

const UploaderFile = ({ file }) => {

    const dispatch = useDispatch()

    return (
        <div className="upload-file">
            <div className="upload-file__header">
                <div className="upload-file__name">{file.name}</div>
                <div className="upload-file__remove" onClick={() => dispatch(removeUploader(file.id))}>X</div>
            </div>
            <div className="upload-file__progress-bar">
                <div className="upload-file__upload-bar" style={{width: file.progress + '%'}}/>
                <div className="upload-file__percent">{file.progress}%</div>
            </div>
        </div>
    )
}

export default UploaderFile;
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles, uploadFile } from "../../actions/file";
import FileList from "./filelist/FilesList";
import './disk.css'
import Popup from "./Popup";
import { setCurrentDIr, setPopupDisplay } from "../../reducers/fileReducer";
import { useState } from "react";
import Uploader from "./uploader/Uploader";

const Disk = () => {

    const dispatch = useDispatch();
    const currentDIr = useSelector(state => state.files.currentDir);
    const diskStack = useSelector(state => state.files.dirStack);
    const [dragEnter, setDragEnter] = useState(false);
    const [sort, setSort] = useState('type');
    const loader = useSelector(state => state.app.loader);

    useEffect(() => {
        dispatch(getFiles(currentDIr, sort))
    }, [currentDIr, sort])

    function showPopupHandler () {
        dispatch(setPopupDisplay('flex'))
    }

    function backClickHandler() {
        const backDirId = diskStack.pop();
        dispatch(setCurrentDIr(backDirId))
    }

    function fileUploadHandler(event) {
        const files = [...event.target.files];
        files.forEach(file => dispatch(uploadFile(file, currentDIr)));
    }

    function dragEnterHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(true);
    }

    function dragLeaveHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(false);
    }

    function dropHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        let files = [...event.dataTransfer.files];
        files.forEach(file => dispatch(uploadFile(file, currentDIr)))
        setDragEnter(false);
    }

    if(loader) {
        return (
            <div className="loader">
                <div className="lds-default">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    }

    return ( !dragEnter ?
        <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            <div className="disk__btns">
                <button className="disk__back" onClick={() => backClickHandler()}>Назад</button>
                <button className="disk__create" onClick={() => showPopupHandler()}>Создать папку</button>
                <div className="disl_upload">
                    <label htmlFor="disk__upload-input"  className="disk__upload-lable" >Загрузить файл</label>
                    <input multiple={true} onChange={(event) => fileUploadHandler(event)}  className="disk__upload-input" id="disk__upload-input" type="file" />
                </div>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="disk__select">
                    <option value="name">По имени</option>
                    <option value="type">По типу</option>
                    <option value="date">По дате</option>
                </select>
            </div>
            <FileList/>
            <Popup/>
            <Uploader />
        </div>
        :
        <div className="drag__area" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
            Перетащите файлы сюда
        </div>
    );
}

export default Disk;
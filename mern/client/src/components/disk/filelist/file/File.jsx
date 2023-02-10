import React from "react";
import './file.css';
import dirLogo from '../../../../assets/img/derictory.svg';
import fileLogo from '../../../../assets/img/file.svg';
import { useDispatch, useSelector } from "react-redux";
import { pushToStack, setCurrentDIr } from "../../../../reducers/fileReducer";
import { deleteFile, downloadFile } from "../../../../actions/file";

const File = ({file}) => {

    const dispatch = useDispatch();
    const currentDIr = useSelector(state => state.files.currentDir);

    function openDIrHandler(file) {
        if(file.type === 'dir') {
            dispatch(pushToStack(currentDIr))
            dispatch(setCurrentDIr(file._id))
        }
    }

    function downloadCreateHandler(e) {
        console.log(file)
        e.stopPropagation();
        downloadFile(file);
    }

    function deleteCLickHandler(e) {
        e.stopPropagation();
        dispatch(deleteFile(file))
    }

    return (
        <div className='fileItem' onClick={()=> openDIrHandler(file)}>
            <img src={file.type === 'dir' ? dirLogo : fileLogo} alt="logo" className="file__img"/>
            <div className="file__name">{file.name}</div>
            <div className="file__date">{file.date.slice(0,10)}</div>
            <div className="file__size">{file.size}</div>
            {file.type !== 'dir' && <button className="file__btn file__download" onClick={(e)=> downloadCreateHandler(e)}>Скачать</button>}
            <button className="file__btn file__delete" onClick={(e) => deleteCLickHandler(e)}>Удалить</button>
        </div>
    )
}

export default File;
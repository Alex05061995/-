import React from "react";
import { useSelector } from "react-redux";
import File from "./file/File";
import './filelist.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const FileList = () => {

    const files = useSelector(state => state.files.files);

    if(files.length === 0) {
        return <div className="noFiles">Файлы не найдены</div>
    }


    return (
        <div className='filelist'>
            <div className="filelist__header">
                <div className="filelist__name">Название</div>
                <div className="filelist__date">Дата</div>
                <div className="filelist__size">Размер</div>
            </div>
          
                {files.map(file =>
                  
                    <div key={file._id} className="file">
                        <File   file={file} />
                    </div>
                   
                )}
          
        </div>
    );
}
export default FileList;
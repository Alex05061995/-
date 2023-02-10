import React from "react";
import { useDispatch } from "react-redux";
import { deleteAvatar, uploadAvatar } from "../../actions/user";
import './profile.css';

const Profile = () => {

    const dispatch = useDispatch();

    function changeHandler (e) {
        const file = e.target.files[0];
        dispatch(uploadAvatar(file));
    }

    return (
        <div>
            <button className="delete" onClick={() => dispatch(deleteAvatar())}>Удалить аватар</button>
            <input accept="image/*" onChange={(e) => changeHandler(e)} type="file" />Загрузить аватар
        </div>
    )
}

export default Profile;
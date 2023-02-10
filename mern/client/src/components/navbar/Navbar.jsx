import React, { useState } from "react";
import './navbar.css';
import Logo from '../../assets/img/Mylogo.png';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reducers/userReducer";
import { getFiles, searchFiles } from "../../actions/file";
import { showLoader } from "../../reducers/appReducer";
import avatarLogo from '../../assets/img/avatar.svg';
const {APi_URL} = require('../../config');

const Navbar = () => {

    const auth = useSelector(state => state.user.isAuth);
    const currentDir = useSelector(state => state.files.currentDir);
    const currentUser = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch();
    const [searchhName, setSearchName] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(false);
    const avatar = currentUser.avatar ? `${APi_URL + currentUser.avatar}` : avatarLogo;
    const userName = currentUser.name ? currentUser.name : 'Аноним';


    function searchHandler(e) {
        setSearchName(e.target.value);

        if (searchTimeout !== false) {
            clearTimeout(searchTimeout);
            console.log(searchTimeout, 'searchTimeout');
        }

        dispatch(showLoader());

        if (e.target.value !== '') {
            setSearchTimeout(setTimeout((value) => {
                dispatch(searchFiles(value))
            }, 500, e.target.value))
        } else {
            dispatch(getFiles(currentDir))
        }

    }

    return (
        <div className="navbar">
            <div className="container">
                <img src={Logo} alt="" className="navbar__logo" />
                <div className="navbar__header">Облачное хранилище</div>
                {auth && <input className="navbar__search" type="text" value={searchhName} onChange={(e) => searchHandler(e)} placeholder="Введите название файла" />}
                {!auth && <div className="navbar__login"><Link to='/login'>Войти</Link></div>}
                {!auth && <div className="navbar__registration"><Link to='/registration'>Регистрация</Link></div>}
                {auth && <div className="navbar__login" onClick={() => dispatch(logout())}>Выйти</div>}
                {auth && 
                <Link to={'./profile'}> 
                    <img className="navbar__avatar" src={avatar} alt="avatar" />
                    <p className="name">{userName}</p>
                </Link>  }
            </div>
        </div>
    )
}

export default Navbar;
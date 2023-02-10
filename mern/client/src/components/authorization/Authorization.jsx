import React, { useState } from "react";
import { login } from "../../actions/user";
import Input from "../../utils/input/Input";
import './authorization.css';
import {useDispatch} from 'react-redux'

const Authorization = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const dispatch = useDispatch()



    const [errMessage, setErrMessage] = useState('');
    const [errPasswordMessage, setErrPasswordMessage] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);

    function validationEmail(value) {
        if (value.length > 0 && value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{1,3}$/g)) {
            setErrMessage('');
            if(password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/g)) {
                setBtnDisabled(false);
            }
        }
        else {
            setErrMessage('Введите корректный email');
            setBtnDisabled(true);
        } 
    }

    function validationPassword(value) {
        if (value.length > 0 && value.match(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/g)) {
            setErrPasswordMessage('');
            if(email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{1,3}$/g)) {
                setBtnDisabled(false);
            }
        }
        else {
            setErrPasswordMessage('Пароль должен состоять из букв(больших букв) и символов и не меньше 6');
            setBtnDisabled(true);
        }
    }

    function loginUser(email, password) {
        dispatch(login(email, password))
        setPassword('');
        setEmail('');
    }








    return (
        <div className='authorization'>
            <div className="authorization__header">Авторизация</div>
            <Input onInput={validationEmail} value={email} setValue={setEmail} type="text" placeholder="Введите email..."/>
            {errMessage &&
                <div className="validation">
                    {errMessage}
                </div>
            }
            <Input onInput={validationPassword} value={password} setValue={setPassword} type="password" placeholder="Введите пароль..."/>
            {errPasswordMessage &&
                <div className="validation">
                    {errPasswordMessage}
                </div>
            }
            <button disabled={btnDisabled} className="authorization__btn" onClick={() => loginUser(email, password)}>Войти</button>
        </div>
    );
}

export default Authorization;
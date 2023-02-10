import React from 'react';
import './input.css'

const Input = (props) => {
    return (
        <input onChange={(event)=> props.setValue(event.target.value)}
               value={props.value}
               type={props.type}
               placeholder={props.placeholder}
               onInput={(e) => props.onInput ? props.onInput(e.target.value) : console.log('')}
               />
    );
};

export default Input;
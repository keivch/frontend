import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Input({ type, name, placeholder, value, onChange, resetPassword }) {


    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        setShowPopup(true);
    };


  

    return (
        <div className="flex flex-col gap-2">
            <div className='flex justify-between'>
                <label htmlFor={name} className="text-lg font-semibold">{name} </label>
                {type === "password" && 
                    <a 
                        className='text-green-950 font-semibold text-lg cursor-pointer'
                        onClick={resetPassword}
                    >
                        Olvidé mi contraseña?
                    </a>
                }
            </div>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="border-2 border-slate-300 rounded-lg p-4 focus:ring-green-800 focus:border-green-800 outline-none shadow-lg"
            />

        </div>
    );
}

Input.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    resetPassword: PropTypes.func
};

export default Input;

import React from 'react';
import './border_button.scss'

function BorderButton(props) {
    return (
        <div onClick={props.onclick} className="border-button" >
            {props.content}
        </div>
    );
}

export default BorderButton;
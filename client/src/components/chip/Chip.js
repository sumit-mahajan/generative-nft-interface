import React from 'react';
import './chip.scss'

function Chip(props) {
    return (
        <div onClick={props.onClick} className="chip-container" >
            <p className="chip-content no-select">{props.content}</p>
        </div>
    );
}

export default Chip;
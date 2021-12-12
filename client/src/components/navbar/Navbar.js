import React, { useEffect, useState } from 'react';
import { useConnection } from '../../providers/connection_provider';
import { Box } from '../Box';
import Chip from '../chip/Chip';
import './navbar.scss'
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const { connectionState, setConnectionState, connectWallet } = useConnection();
    const { web3, accounts, networkName } = connectionState;
    const navigate = useNavigate()

    return (
        <nav className="no-select">
            <div onClick={() => { navigate('/') }} className="logo">MINTIT</div>

            <div className="nav-btn-flex">
                <Chip content={networkName} />

                <Box width="20" />

                {accounts.length > 0 ?
                    <BorderButton
                        content={accounts[0].substring(0, 5) + "..." + accounts[0].substring(accounts[0].length - 3, accounts[0].length)}
                    /> :
                    <BorderButton
                        onClick={connectWallet}
                        content="Connect"
                    />
                }

            </div>
        </nav>
    );
}

function BorderButton(props) {
    return (
        <div onClick={props.onClick} className="border-button" >
            {props.content}
        </div>
    );
}

export default Navbar;
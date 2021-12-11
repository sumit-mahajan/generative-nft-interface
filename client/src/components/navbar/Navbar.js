import React, { useEffect, useState } from 'react';
import { useConnection } from '../../providers/connection_provider';
import BorderButton from '../border_button/BorderButton';
import { Box } from '../Box';
import Chip from '../chip/Chip';
import './navbar.scss'

function Navbar() {
    const { connectionState, setConnectionState, connectWallet } = useConnection();
    const { web3, accounts, networkName } = connectionState;

    return (
        <nav className="no-select">
            <div className="logo">caya</div>

            <div className="nav-btn-flex">
                <Chip content={networkName.toLowerCase()} />

                <Box width="20" />

                {accounts.length > 0 ?
                    <BorderButton
                        content={accounts[0].substring(0, 5) + "..." + accounts[0].substring(accounts[0].length - 3, accounts[0].length)}
                    /> :
                    <BorderButton
                        onclick={connectWallet}
                        content="connect"
                    />
                }

            </div>
        </nav>
    );
}

export default Navbar;
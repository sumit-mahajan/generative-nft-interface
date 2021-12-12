import React from 'react';
import { useConnection } from '../../providers/connection_provider';
import { Box } from '../Box';
import './loading.scss'

function Loading(props) {
    const { connectionState } = useConnection();

    return (
        <div className="loading">
            <div className="loading-container">
                <div className="load load1"></div>
                <Box width="20" />
                <div className="load load2"></div>
                <Box width="20" />
                <div className="load load3"></div>
                <Box height="70" />
            </div>
            <div className="load-msg">{props.message}</div>
        </div>
    );
}

export default Loading;
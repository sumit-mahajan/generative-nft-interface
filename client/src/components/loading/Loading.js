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
                {/* {props.page} */}
            </div>
            <Box height="80" />
            {/* {props.tx && connectionState.networkName === "Rinkeby" &&
                "Please wait. Transactions on Rinkeby might take about 15-20 seconds"} */}
        </div>
    );
}

export default Loading;
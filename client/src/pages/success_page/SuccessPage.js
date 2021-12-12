import React, { useEffect, useState } from "react";
import { Box } from "../../components/Box";
import "./success_page.scss";
import { useMint } from "../../providers/mint_provider";
import { useNavigate } from 'react-router-dom';

function SuccessPage() {
    const { mintState, setMintState } = useMint()
    const navigate = useNavigate()

    return (
        <div className="container center-child success-parent">
            <div className="success-flex">
                <h1>Success</h1>

                <Box height="10" />

                <h2 style={{ wordSpacing: "2px" }}>Minted {mintState.nfts.length} NFTs in collection at {mintState.collection.address}</h2>

                <Box height="50" />

                <p onClick={() => { }}>Download Mintit mobile app from <span className="link"> here </span> to see the collection</p>

                <Box height="20" />
                <p>OR</p>
                <Box height="20" />

                <button onClick={() => { navigate('/') }} style={{ width: "200px" }}>Create Again</button>

                <Box height="70" />
            </div>
        </div>
    );
}

export default SuccessPage;
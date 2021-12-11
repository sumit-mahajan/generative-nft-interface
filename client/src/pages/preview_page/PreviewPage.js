import React from "react";
import { Box } from "../../components/Box";
import { useMint } from "../../providers/mint_provider";
import { useNavigate } from 'react-router-dom';
import { useGenerate } from "../../providers/generate_provider";

function PreviewPage() {
    const { configState, setConfigState } = useGenerate()
    const { mintState } = useMint()
    const navigate = useNavigate()

    return (
        <div>
            Preview generated Images

            <Box height="40" />

            <div className="nft-grid">
                {mintState.nfts.sort((a, b) => a.id - b.id).map((nft) =>
                    <div className="nft-card">
                        <img src={nft.image} height="100%" width="100%" />
                        <p className="caption">{nft.metadata.name}</p>
                    </div>
                )}
            </div>

            <Box height="50" />

            <div className="row-flex">
                <div className="outlined-btn"
                    onClick={() => { setConfigState({ ...configState, isDone: false }) }} >
                    Retry
                </div>
                <Box width="50" />
                <button onClick={() => { navigate('/collection') }}> Next </button>
            </div>

            <Box height="50" />

        </div>
    );
}

export default PreviewPage;
import React from "react";
import { Box } from "../../components/Box";
import "./success_page.scss";
import { useMint } from "../../providers/mint_provider";
import { useNavigate } from 'react-router-dom';
import { useGenerate } from "../../providers/generate_provider";


function SuccessPage() {
    const { mintState, setMintState } = useMint()
    const { setConfigState } = useGenerate()

    const navigate = useNavigate()

    const txURL = 'https://mumbai.polygonscan.com/address/' + mintState.collection.address

    const appURL = 'https://drive.google.com/drive/folders/1C5y4Tv5_5WRmpK1faeO1tOliHs31J_w1?usp=sharing'

    return (
        <div className="container center-child success-parent">
            <div className="success-flex">
                <h1>Success</h1>

                <Box height="10" />

                <h2 onClick={() => { window.open(txURL, '_blank'); }} style={{ wordSpacing: "2px" }}>
                    Minted {mintState.nfts.length} NFTs in collection at
                    <span style={{ fontSize: 'var(--sm-text-size)' }} className="link"> {mintState.collection.address} </span>
                </h2>

                <Box height="50" />

                {/* <p onClick={() => { window.open(appURL, '_blank'); }}>Download Mintit mobile app from <span className="link"> here </span> to see the collection</p>

                <Box height="20" />
                <p>OR</p>
                <Box height="20" /> */}

                <button onClick={() => {
                    setMintState({ nfts: [], collection: {} })

                    setConfigState({
                        inputDirHandle: null,
                        outputDirHandle: null,
                        namePrefix: "",
                        commonDescription: "",
                        width: "",
                        height: "",
                        outputSize: "",
                        properties: [],
                        isLoading: false,
                        isDone: false,
                        time: 0,
                        error: "",
                    })

                    navigate('/generate')
                }} style={{ width: "200px" }}>Create Again</button>

                <Box height="70" />
            </div>
        </div>
    );
}

export default SuccessPage;
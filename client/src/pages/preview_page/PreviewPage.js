import React, { useEffect, useState } from "react";
import { Box } from "../../components/Box";
import { useMint } from "../../providers/mint_provider";
import { useNavigate } from 'react-router-dom';
import { useGenerate } from "../../providers/generate_provider";
import { uploadMetadata } from '../../services/ipfs_service'

function PreviewPage() {
    const { configState, setConfigState } = useGenerate()
    const { mintState, setMintState } = useMint()
    const navigate = useNavigate()
    const [activeReqs, setActiveReqs] = useState(0)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const stopIfMoreReqs = () => {
        if (activeReqs >= 15) {
            setTimeout(stopIfMoreReqs, 100)
        }
        return;
    }

    const handleNext = async () => {
        setConfigState({ ...configState, isLoading: true })

        const nftsWithMetadata = [];
        let count = 0
        mintState.nfts.forEach(async (nft) => {

            stopIfMoreReqs()

            setActiveReqs(activeReqs + 1)

            const metadataCID = await uploadMetadata(JSON.stringify(nft.metadata))
            console.log("Metadata ", count + 1, " done")

            setActiveReqs(activeReqs - 1)

            nftsWithMetadata.push({
                ...nft,
                metadataCID
            })

            count++

            if (count === mintState.nfts.length) {
                nftsWithMetadata.sort((a, b) => a.id - b.id)
                setMintState({ ...mintState, nfts: nftsWithMetadata })
                setConfigState({ ...configState, isLoading: false })

                navigate('/collection')
            }
        })
    }

    return (
        <div>
            Preview generated Images

            <Box height="40" />

            <div className="nft-grid">
                {mintState.nfts.sort((a, b) => a.id - b.id).map((nft) =>
                    <div key={nft.id} className="nft-card">
                        <img alt={nft.metadata.name} src={nft.image} height="100%" width="100%" />
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
                <button onClick={handleNext}> Next </button>
            </div>

            <Box height="50" />

        </div>
    );
}

export default PreviewPage;
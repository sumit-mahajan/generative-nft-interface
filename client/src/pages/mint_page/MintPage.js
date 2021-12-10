import React, { useEffect, useState } from "react";
import { useMint } from "../../providers/mint_provider";
import "./mint_page.scss";

function MintPage() {
    const { mintState } = useMint()

    useEffect(() => {
        console.log(mintState.nfts)
    }, [])

    return (<div>
        {mintState.nfts.map(nft =>
            <div key={nft.id}>
                <img src={nft.image} />
                <p>{nft.metadata.name}</p>
                <p>{nft.metadata.image}</p>
            </div>
        )}
    </div>);
}

export default MintPage;
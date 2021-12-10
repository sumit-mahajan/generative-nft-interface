import React, { useEffect, useState } from "react";
import { useMint } from "../../providers/mint_provider";
import { Box } from "../../components/Box";
import "./mint_page.scss";
/* global BigInt */
import { uploadMetadata } from '../../services/ipfs_service'
import { useConnection } from "../../providers/connection_provider";

function MintPage() {
    const { connectionState, createCollectionInstance } = useConnection()
    const { web3, accounts } = connectionState
    const { mintState, setMintState } = useMint()
    const [commonData, setCommonData] = useState({
        forSale: true,
        isFixedPrice: false,
        price: -1,
        royalty: -1
    })

    useEffect(() => {
        const nftsWithMetadata = [];
        let count = 0
        mintState.nfts.forEach(async (nft) => {
            const metadataCID = await uploadMetadata(JSON.stringify(nft.metadata))
            nftsWithMetadata.push({
                ...nft,
                metadataCID
            })
            count++
            if (count === mintState.nfts.length) {
                nftsWithMetadata.sort((a, b) => a.id - b.id)
                setMintState({ ...mintState, nfts: nftsWithMetadata })
            }
        })
    }, [])

    const validateInput = () => {
        let errorField
        if (commonData.price < 0) {
            errorField = "price"
        } else if (commonData.royalty < 0) {
            errorField = "royalty"
        }
        return errorField
    }

    const handleSubmit = async () => {
        const error = validateInput()
        if (error) {
            document.getElementById('error-field').innerHTML = error + " is empty";
            return;
        }
        document.getElementById('error-field').innerHTML = "";

        let cContract = await createCollectionInstance(web3, mintState.collection.address);
        // let batch = new web3.BatchRequest();

        mintState.nfts.forEach(async (nft) => {
            console.log(nft.id)
            // batch.add(
            await cContract.methods
                .mintNFT(
                    nft.metadata.name,
                    nft.metadata.image,
                    nft.metadata.properties.toString(),
                    nft.metadataCID,
                    commonData.forSale,
                    commonData.isFixedPrice,
                    commonData.price,
                    commonData.royalty,
                    "Never gonna give you up, Never gonna let you down"
                )
                .send({ from: accounts[0] })
            // )
        })
        // batch.execute()
    }

    return (<div>
        <Box height="20" />
        <input type="checkbox" id="forsale"
            onChange={(e) => {
                setCommonData({ ...commonData, forSale: e.target.checked })
            }}
        />
        <label for="forsale">For Sale</label>
        <Box height="20" />
        <input type="radio" id="fixedprice" name="selltype" value="Fixed Price"
            onChange={(e) => {
                setCommonData({ ...commonData, isFixedPrice: e.target.checked })
            }}
        />
        <label for="fixedprice">Fixed Price </label>
        <input type="radio" id="bidding" name="selltype" value="Bidding" checked
            onChange={(e) => {
                setCommonData({ ...commonData, isFixedPrice: !e.target.checked })
            }}
        />
        <label for="bidding">Bidding</label>
        <Box height="20" />
        <input type="number" placeholder={commonData.isFixedPrice ? "Price" : "Minimum Bid Price"}
            onChange={(e) => {
                if (e.target.value !== "") {
                    setCommonData({ ...commonData, price: BigInt(parseFloat(e.target.value) * 1e4) * BigInt(1e14) })
                } else {
                    setCommonData({ ...commonData, price: -1 })
                }
            }}
        />
        <Box height="20" />
        <input type="number" placeholder="Royalty"
            onChange={(e) => {
                let royalty = e.target.value === "" ? -1 : parseInt(e.target.value)
                setCommonData({ ...commonData, royalty })
            }}
        />
        <Box height="20" />
        <p id="error-field"></p>
        <button onClick={handleSubmit}>Mint</button>
        {/* <img src={mintState.collection.imageUrl} />
        <p>{mintState.collection.address}</p>
        <p>{mintState.collection.metadata.name}</p>
        {mintState.nfts.map(nft =>
            <div key={nft.id}>
                <img src={nft.image} />
                <p>{nft.metadata.name}</p>
                <p>{nft.metadata.image}</p>
            </div>
        )} */}
    </div>);
}

export default MintPage;
import React, { useContext, useState } from "react";

const MintContext = React.createContext();

export function useMint() {
    return useContext(MintContext);
}

export function MintProvider(props) {
    const [mintState, setMintState] = useState({
        nfts: [],
        collection: {}
    });

    return (
        <>
            <MintContext.Provider
                value={{
                    mintState,
                    setMintState
                }}
            >
                {props.children}
            </MintContext.Provider>
        </>
    );
}

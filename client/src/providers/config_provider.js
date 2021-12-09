import React, { useContext, useEffect, useState } from "react";

const ConfigContext = React.createContext();

export function useConfig() {
    return useContext(ConfigContext);
}

export function ConfigProvider(props) {
    const [configState, setConfigState] = useState({
        inputDirHandle: null,
        outputDirHandle: null,
        namePrefix: "Cryptopunk",
        commonDescription: "Common description",
        outputSize: 10,
        stopAfterNDuplicates: 100,
        properties: [],
        format: {
            width: 512,
            height: 512,
        }
    });

    return (
        <>
            <ConfigContext.Provider
                value={{
                    configState,
                    setConfigState,
                }}
            >
                {props.children}
            </ConfigContext.Provider>
        </>
    );
}

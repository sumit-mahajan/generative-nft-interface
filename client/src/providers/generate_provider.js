import React, { useContext, useState } from "react";
import { createCanvas } from "canvas";
import { uploadImage } from "../services/ipfs_service";
import { useMint } from './mint_provider'

const GenerateContext = React.createContext();

export function useGenerate() {
    return useContext(GenerateContext);
}

export function GenerateProvider(props) {
    const { mintState, setMintState } = useMint()

    const [configState, setConfigState] = useState({
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
    });

    const setInputDir = async () => {
        let inputDirHandle = await window.showDirectoryPicker();

        const properties = [];
        let nProperties = 0;

        for await (let [name, subDirHandle] of inputDirHandle) {
            properties.push({ id: nProperties, name, subDirHandle, values: [] });

            let nValues = 0;
            for await (let [filename, fileHandle] of properties.at(-1).subDirHandle) {
                const name = filename.slice(0, -4)
                properties.at(-1).values.push({
                    id: nValues,
                    name,
                    filename,
                    fileHandle,
                    weight: 1,
                })
                nValues++;
            }
            nProperties++;
        }

        setConfigState({ ...configState, inputDirHandle, properties })
    }

    const setOutputDir = async () => {
        let outputDirHandle = await window.showDirectoryPicker();
        setConfigState({ ...configState, outputDirHandle })
    }

    const createCombination = () => {
        let weightedRandomChoices = [];
        configState.properties.forEach((property) => {

            var totalWeight = 0;
            property.values.forEach((value) => {
                totalWeight += value.weight;
            });

            // number between 0 to totalWeight
            let random = Math.floor(Math.random() * totalWeight);
            for (var i = 0; i < property.values.length; i++) {
                // subtract the current weight from the random weight until we reach a below zero value.
                random -= property.values[i].weight;
                if (random < 0) {
                    return weightedRandomChoices.push(property.values[i].id);
                }
            }
        });

        return weightedRandomChoices.join("-");
    }

    const propertiesFromCombination = (_combination, _properties) => {
        let combinationToProperties = _properties.map((property, index) => {
            let selectedValue = property.values.find(
                (e) => e.id === Number(_combination.split("-")[index])
            );
            return {
                name: property.name,
                selectedValue: selectedValue,
            };
        });
        return combinationToProperties;
    };

    const createImages = async () => {
        let startTime = Date.now()
        setConfigState({ ...configState, error: '', isLoading: true })

        if (configState.outputDirHandle !== null) {
            // Clear old output images and metadata
            for await (let [filename] of configState.outputDirHandle) {
                configState.outputDirHandle.removeEntry(filename, { recursive: true })
            }
        }

        let uniques = 0;
        let duplicates = 0;
        let combinations = new Set()

        while (uniques < configState.outputSize) {
            let newCombination = createCombination();

            if (!combinations.has(newCombination)) {
                uniques++;
                combinations.add(newCombination);
            } else {
                duplicates++;
                if (duplicates === configState.outputSize * 10) {
                    console.log("Need more properties and values");
                    setConfigState({ ...configState, error: 'Need more properties and values' })
                    return;
                }
            }
        }

        combinations = Array.from(combinations);
        let nfts = []
        let count = 0
        let activeReqs = 0

        const stopIfMoreReqs = () => {
            if (activeReqs >= 15) {
                setTimeout(stopIfMoreReqs, 100)
            }
            return;
        }

        combinations.forEach(async (combination, index) => {
            let attributesList = []
            let selectedValues = propertiesFromCombination(combination, configState.properties);

            const canvas = createCanvas(configState.width, configState.height);
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, configState.width, configState.height);

            for await (let property of selectedValues) {
                const image = await property.selectedValue.fileHandle.getFile()
                const imageBitmap = await createImageBitmap(image)

                // Draw value of a property
                ctx.drawImage(
                    imageBitmap,
                    0,
                    0,
                    configState.width,
                    configState.height
                );

                // Add property and value to attributesList
                let selectedValue = property.selectedValue;
                attributesList.push({
                    type: property.name,
                    value: selectedValue.name,
                });
            }

            // Construct image
            const blob = await new Promise(
                (resolve) => canvas.toBlob(blob => resolve(blob), "image/png")
            );

            // Save current image to <OUTPUT_DIR>/images in png format
            if (configState.outputDirHandle !== null) {
                const imagesDirHandle = await configState.outputDirHandle.getDirectoryHandle("images", { create: true })
                const iHandle = await imagesDirHandle.getFileHandle((index + 1).toString() + '.png', { create: true })
                const iStream = await iHandle.createWritable({ keepExistingData: false })
                iStream.write(blob);
                iStream.close()
            }

            stopIfMoreReqs()

            activeReqs++;

            // Upload image to IPFS
            const imageCID = await uploadImage(blob);

            activeReqs--;

            // Construct metadata
            const metadata = {
                name: `${configState.namePrefix} #${(index + 1)}`,
                description: configState.commonDescription,
                image: imageCID,
                properties: attributesList,
            };
            attributesList = [];

            // Save metadata of current image to <OUTPUT_DIR>/metadata
            if (configState.outputDirHandle !== null) {
                const metadataDirHandle = await configState.outputDirHandle.getDirectoryHandle("metadata", { create: true })
                const mHandle = await metadataDirHandle.getFileHandle((index + 1).toString() + '.json', { create: true })
                const mStream = await mHandle.createWritable({ keepExistingData: false })
                mStream.write(JSON.stringify(metadata));
                mStream.close()
            }

            console.log("Image ", (index + 1), " Done")

            nfts.push({
                id: index + 1,
                image: URL.createObjectURL(blob),
                metadata
            })

            count++

            if (count.toString() === configState.outputSize.toString()) {
                setConfigState({ ...configState, isDone: true, isLoading: false, time: (Date.now() - startTime) / 1000 })
                setMintState({ ...mintState, nfts })
                console.log("Took ", (Date.now() - startTime) / 1000, " seconds to generate")
            }
        })
    }

    return (
        <>
            <GenerateContext.Provider
                value={{
                    configState,
                    setConfigState,
                    setInputDir,
                    setOutputDir,
                    createImages
                }}
            >
                {props.children}
            </GenerateContext.Provider>
        </>
    );
}

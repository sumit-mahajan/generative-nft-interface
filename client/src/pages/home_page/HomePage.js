import React, { useEffect, useState } from "react";
import { useConfig } from "../../components/config_provider";
import "./home_page.scss";

import { createCanvas } from "canvas";

function HomePage() {
  const { configState, setConfigState } = useConfig();

  const [dragId, setDragId] = useState();

  const createImages = async () => {
    let uniques = 0;
    let duplicates = 0;
    let combinations = new Set()

    // Clear old outputs
    for await (let [filename] of configState.outputDirHandle) {
      configState.outputDirHandle.removeEntry(filename, { recursive: true })
    }

    while (uniques < configState.outputSize) {
      let newCombination = createCombination();

      if (!combinations.has(newCombination)) {
        let attributesList = []
        let selectedValues = propertiesFromCombination(newCombination, configState.properties);

        const canvas = createCanvas(configState.format.width, configState.format.height);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, configState.format.width, configState.format.height);

        for await (let property of selectedValues) {
          const image = await property.selectedValue.fileHandle.getFile()
          const imageBitmap = await createImageBitmap(image)

          // Draw value of a property
          ctx.drawImage(
            imageBitmap,
            0,
            0,
            configState.format.width,
            configState.format.height
          );

          // Add property and value to attributesList
          let selectedValue = property.selectedValue;
          attributesList.push({
            type: property.name,
            value: selectedValue.name,
          });
        }

        uniques++;

        // Save current image in canvas to <OUTPUT_DIR>/images in png format
        const imagesDirHandle = await configState.outputDirHandle.getDirectoryHandle("images", { create: true })
        const iHandle = await imagesDirHandle.getFileHandle(uniques.toString() + '.png', { create: true })
        const iStream = await iHandle.createWritable({ keepExistingData: false })
        const blob = await new Promise(
          (resolve) => canvas.toBlob(blob => resolve(blob), "image/png")
        );
        const fr = new FileReader()
        fr.readAsArrayBuffer(blob);
        fr.onload = () => {
          iStream.write(fr.result);
          iStream.close()
        }

        // Save metadata of current image to <OUTPUT_DIR>/images in json format
        const metadata = {
          name: `${configState.namePrefix} #${uniques}`,
          description: configState.commonDescription,
          image: `${'ipfsFolderUri'}/${uniques}.png`,
          properties: attributesList,
        };
        attributesList = [];

        const metadataDirHandle = await configState.outputDirHandle.getDirectoryHandle("metadata", { create: true })
        const mHandle = await metadataDirHandle.getFileHandle(uniques.toString() + '.json', { create: true })
        const mStream = await mHandle.createWritable({ keepExistingData: false })
        mStream.write(JSON.stringify(metadata));
        mStream.close()

        combinations.add(newCombination);
      } else {
        duplicates++;

        if (duplicates == configState.stopAfterNDuplicates) {
          console.log("Need more properties and values");
          return;
        }
      }
    }
  }

  const createCombination = () => {
    let weightedRandomChoices = [];
    configState.properties.forEach((property) => {

      var totalWeight = 0;
      property.values.forEach((value) => {
        totalWeight += value.weight;
      });

      // number between 0 - totalWeight
      let random = Math.floor(Math.random() * totalWeight);
      for (var i = 0; i < property.values.length; i++) {
        // subtract the current weight from the random weight until we reach a sub zero value.
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
        (e) => e.id == Number(_combination.split("-")[index])
      );
      return {
        name: property.name,
        selectedValue: selectedValue,
      };
    });
    return combinationToProperties;
  };

  const setInputDir = async () => {
    let inputDirHandle = await window.showDirectoryPicker();

    const properties = [];
    let nProperties = 0;

    for await (let [name, subDirHandle] of inputDirHandle) {
      properties.push({ id: nProperties, name, subDirHandle, values: [] });

      let nValues = 0;
      for await (let [filename, fileHandle] of properties.at(-1).subDirHandle) {
        const info = filename.slice(0, -4).split("#")
        properties.at(-1).values.push({
          id: nValues,
          name: info[0],
          filename,
          fileHandle,
          weight: parseInt(info[1] || 1),
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

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev) => {
    let dragBoxIndex;
    let dropBoxIndex;

    for (let i = 0; i < configState.properties.length; i++) {
      if (configState.properties[i].id.toString() === dragId) {
        dragBoxIndex = i;
      } if (configState.properties[i].id.toString() === ev.currentTarget.id) {
        dropBoxIndex = i;
      }
    }

    let properties = configState.properties;

    if (dragBoxIndex < dropBoxIndex) {
      const temp = properties[dragBoxIndex];
      for (let i = dragBoxIndex; i < dropBoxIndex; i++) {
        properties[i] = properties[i + 1];
      }
      properties[dropBoxIndex] = temp
    } else {
      const temp = properties[dragBoxIndex];
      for (let i = dragBoxIndex; i > dropBoxIndex; i--) {
        properties[i] = properties[i - 1];
      }
      properties[dropBoxIndex] = temp
    }

    setConfigState({ ...configState, properties });
  };

  return (
    <div>
      <button onClick={setInputDir}>Select Input Directory</button>
      <br />
      <button onClick={setOutputDir}>Select Output Directory</button>
      <br />
      <button onClick={createImages}>Create Images</button>
      <br />
      <br />
      {configState.properties.slice().reverse().map(property =>
        <div
          key={property.name}
          id={property.id}
          draggable="true"
          onDragOver={(ev) => ev.preventDefault()}
          onDragStart={handleDrag}
          onDrop={handleDrop}
        >
          <h2>Property: {property.name}</h2>
          {property.values.map(file => <p>Value: {file.name}, Rarity: {file.weight}%</p>)}
          <br />
        </div>
      )}
    </div>
  );
}

export default HomePage;

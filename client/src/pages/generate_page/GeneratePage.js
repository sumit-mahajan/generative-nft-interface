import React, { useEffect, useState } from "react";
import { useGenerate } from "../../providers/generate_provider";
import "./generate_page.scss";

function GeneratePage() {
  const { configState, setConfigState, setInputDir, setOutputDir, createImages } = useGenerate();

  const [dragId, setDragId] = useState();

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
      <br />
      <br />
      {configState.nfts.map(nft =>
        <div key={nft.id}>
          <img src={nft.image} />
          <p>{nft.metadata.name}</p>
          <p>{nft.metadata.image}</p>
        </div>
      )}
    </div>
  );
}

export default GeneratePage;

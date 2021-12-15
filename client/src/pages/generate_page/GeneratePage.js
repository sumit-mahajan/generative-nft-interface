import React, { useState } from "react";
import { useGenerate } from "../../providers/generate_provider";
import { Box } from "../../components/Box";
import Chip from "../../components/chip/Chip";
import Loading from "../../components/loading/Loading";
import "./generate_page.scss";
import PreviewPage from "../preview_page/PreviewPage";

function GeneratePage() {

  const { configState, setConfigState, setInputDir, setOutputDir, createImages } = useGenerate();

  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [dragId, setDragId] = useState();

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDragEnter = (ev) => {
    ev.currentTarget.classList.add("dragging-over")
  }

  const handleDragLeave = (ev) => {
    ev.currentTarget.classList.remove("dragging-over")
  }

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
    <div className="container">
      {configState.isLoading ?
        <Loading message={
          configState.isDone ? "Uploading metadata to IPFS"
            : "Generating " + configState.outputSize + " unique images"
        } /> : <div></div>}

      <Box height="30" />

      <h2>Step 2 / 4</h2>

      <Box height="10" />

      <h1>Generate Images</h1>

      <Box height="50" />

      {!configState.isDone ? <div>

        {/* SECTION 1 */}

        <div className="row-flex">
          <div className="dir-flex">
            <p>1. Select Input Directory  </p>
            <div className="select-flex">
              <p>{configState.inputDirHandle !== null ? "input" : "no folder selected"}</p>
              <Box width="30" />
              <Chip onClick={setInputDir} content={configState.inputDirHandle !== null ? "change" : "select"} />
            </div>
          </div>

          <Box width="50" />

          <div className="dir-flex"></div>
        </div>

        <Box height="30" />

        {/* SECTION 2 */}
        {configState.inputDirHandle !== null ? <div>

          <p>2. Order layers &emsp; &emsp; <span>( The layer on the top is printed above the bottom ones )</span>  </p>

          <Box height="30" />

          {configState.properties.slice().reverse().map((property, index) =>
            <div
              key={property.id}
              className="draggable"
              id={property.id}
              draggable="true"
              onDragOver={(ev) => ev.preventDefault()}
              onDragStart={handleDrag}
              onDrop={handleDrop}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              <div
                className="draggable-strip">
                <div className="draggable-icon">
                  <div className="d"></div>
                  <div className="d"></div>
                </div>
                <Box width="40" />
                <p>{property.name}</p>
                <p className="rarity-btn" onClick={() => {
                  if (selectedIndex === index) {
                    setSelectedIndex(-1)
                  } else {
                    setSelectedIndex(index)
                  }
                }}>
                  Adjust Rarity
                </p>
              </div>

              {index === selectedIndex ?

                <div><Box height="15" />
                  {property.values.map((_value, vIndex) =>
                    <div key={_value.id} className="values-parent">
                      {vIndex === 0 ? <div style={{ marginBottom: "10px" }} className="value-flex"><p>Value</p><p>Weight</p></div> : <div></div>}
                      <div className="value-flex">
                        <p className="value">{_value.name}</p>
                        <input
                          className="underlined-field"
                          type="text"
                          placeholder="weight"
                          onChange={(e) => {
                            let temp = configState.properties;
                            const curr = configState.properties.length - 1 - index
                            temp[curr].values[vIndex].weight = parseInt(e.target.value || 1)
                            setConfigState({ ...configState, properties: temp })
                          }}
                          defaultValue={_value.weight}
                        />
                      </div>
                    </div>
                  )} </div>
                : <div></div>
              }
            </div>
          )}

          <Box height="30" />


          {/* SECTION 3 */}

          <p>3. Configure Parameters  </p>

          <Box height="30" />

          <form onSubmit={(e) => {
            e.preventDefault()
            createImages()
          }}>

            <div className="textfield">
              <label>Name Prefix *</label>
              <input
                value={configState.namePrefix}
                onChange={(e) => { setConfigState({ ...configState, namePrefix: e.target.value }) }}
                type="text" placeholder='Your NFTs will be named as "<name_prefix>  #<token_id>" e.g. Cryptopunk #1'
                required />
            </div>

            <Box height="30" />

            <div className="textfield">
              <label>Description *</label>
              <input
                value={configState.commonDescription}
                onChange={(e) => { setConfigState({ ...configState, commonDescription: e.target.value }) }}
                type="text" placeholder='Every NFT of your collection will have this description'
                required />
            </div>

            <Box height="30" />

            <div className="row-flex">
              <div className="textfield">
                <label>Height in Pixels *</label>
                <input
                  value={configState.height}
                  onChange={(e) => { setConfigState({ ...configState, height: e.target.value }) }}
                  type="number" placeholder='Enter height in pixels of your exported layers'
                  min={1}
                  required />
              </div>

              <Box width="40" />

              <div className="textfield">
                <label>Width in Pixels *</label>
                <input
                  value={configState.width}
                  onChange={(e) => { setConfigState({ ...configState, width: e.target.value }) }}
                  type="number" placeholder='Enter width in pixels of your exported layers'
                  min={1} required />
              </div>
            </div>

            <Box height="30" />

            <div className="row-flex">
              <div className="textfield">
                <label>Number of NFTs *</label>
                <input
                  value={configState.outputSize}
                  onChange={(e) => { setConfigState({ ...configState, outputSize: e.target.value }) }}
                  type="number" placeholder='Enter number of NFTs you want to generate'
                  max={100}
                  min={1}
                  required
                />
              </div>

              <Box width="40" />

              <div className="dir-flex">
                <p>Select Output Directory<span> ( optional )</span></p>
                <div className="select-flex">
                  <p>{configState.outputDirHandle !== null ? "output" : "no folder selected"}</p>
                  <Box width="30" />
                  <Chip onClick={setOutputDir} content={configState.outputDirHandle !== null ? "change" : "select"} />
                </div>
              </div>
            </div>

            <Box height="50" />

            <div className="center-child">
              <button>
                Generate Images
              </button>
              <Box height="10" />
              <p className="error-field">{configState.error}</p>
            </div>

          </form>


        </div> : <div></div>}

        <Box height="50" />

      </div> : <PreviewPage />}

    </div>
  );
}

export default GeneratePage;


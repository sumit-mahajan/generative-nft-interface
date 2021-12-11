import React, { useEffect, useState } from "react";
import { useConnection } from "../../providers/connection_provider";
import { useGenerate } from "../../providers/generate_provider";
import { Box } from "../../components/Box";
import Chip from "../../components/chip/Chip";
import Loading from "../../components/loading/Loading";
import "./generate_page.scss";
import PreviewPage from "../preview_page/PreviewPage";

function GeneratePage() {
  const { connectionState } = useConnection()
  const { web3, accounts, mContract, errors } = connectionState;

  const { configState, setConfigState, setInputDir, setOutputDir, createImages } = useGenerate();
  const [isLoading, setLoading] = useState(false)

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

  // if (!web3 || accounts.length === 0 || errors) {
  //   return errors;
  // }

  return (
    <div className="container">
      {isLoading ? <Loading /> : <div></div>}

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

          <div className="dir-flex">
            {/* <p>Select Output Directory<span> ( optional )</span></p>
          <div className="select-flex">
            <p>output</p>
            <Box width="30" />
            <Chip onClick={setOutputDir} content="select" />
          </div> */}
          </div>
        </div>

        <Box height="30" />

        {/* SECTION 2 */}
        {configState.inputDirHandle !== null ? <div>

          <p>2. Order layers  </p>

          <Box height="30" />

          {configState.properties.slice().reverse().map(property =>
            <div
              className="draggable"
              key={property.name}
              id={property.id}
              draggable="true"
              onDragOver={(ev) => ev.preventDefault()}
              onDragStart={handleDrag}
              onDrop={handleDrop}
            >
              <div className="draggable-icon">
                <div className="d"></div>
                <div className="d"></div>
              </div>
              <Box width="40" />
              <p>{property.name}</p>
              <p className="rarity-btn">{property.values.length} values</p>
              {/* {property.values.map(file => <p>Value: {file.name}, Rarity: {file.weight}%</p>)}
          <br /> */}
            </div>
          )}

          <Box height="30" />


          {/* SECTION 3 */}

          <p>3. Configure Parameters  </p>

          <Box height="30" />

          <div className="textfield">
            <label>Name Prefix *</label>
            <input
              onChange={(e) => { setConfigState({ ...configState, namePrefix: e.target.value }) }}
              type="text" placeholder='Your NFTs will be named as "<name_prefix>  #<token_id>" e.g. Cryptopunk #1' />
          </div>

          <Box height="30" />

          <div className="textfield">
            <label>Description *</label>
            <input
              onChange={(e) => { setConfigState({ ...configState, commonDescription: e.target.value }) }}
              type="text" placeholder='Every NFT of your collection will have this description' />
          </div>

          <Box height="30" />

          <div className="row-flex">
            <div className="textfield">
              <label>Height in Pixels *</label>
              <input
                onChange={(e) => { setConfigState({ ...configState, height: e.target.value }) }}
                type="number" placeholder='Enter height in pixels of your exported layers' />
            </div>

            <Box width="40" />

            <div className="textfield">
              <label>Width in Pixels *</label>
              <input
                onChange={(e) => { setConfigState({ ...configState, width: e.target.value }) }}
                type="number" placeholder='Enter width in pixels of your exported layers' />
            </div>
          </div>

          <Box height="30" />

          <div className="row-flex">
            <div className="textfield">
              <label>Number of NFTs *</label>
              <input
                value={configState.outputSize}
                onChange={(e) => { setConfigState({ ...configState, outputSize: e.target.value }) }}
                type="number" placeholder='Enter number of NFTs you want to generate' />
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
            <button onClick={async () => {
              setConfigState({ ...configState, error: '' })
              setLoading(true)
              console.log(isLoading)

              await createImages()

              setLoading(false)
            }}>
              Generate Images
            </button>
            <Box height="10" />
            <p>{configState.error}</p>
          </div>


        </div> : <div></div>}

        <Box height="50" />

      </div> : <PreviewPage />}

    </div>
  );
}

export default GeneratePage;


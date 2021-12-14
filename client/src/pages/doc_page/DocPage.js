import React from "react";
import { useNavigate } from 'react-router-dom';
import { Box } from "../../components/Box";
import "./doc_page.scss";

function DocPage() {
    const navigate = useNavigate()

    return (
        <div className="container">

            <Box height="30" />

            <h2>Step 1 / 4</h2>

            <Box height="10" />

            <h1>Prerequisites</h1>

            <Box height="50" />

            <p>1. Create design components</p>
            <Box height="30" />

            <p>Build individual components of your artwork that you wish to randomize</p>
            <Box height="10" />
            <p>For example, Create main body structure, backgrounds, accessories etc for your character
                using a design tool of your choice
            </p>
            <Box height="10" />
            <p>In the following docs we are generating "Weird Eyes" NFT collection from layers (components)
                built using Adobe Photoshop
            </p>
            <Box height="10" />
            <p>The images and layers used in these docs are created by "Hashlips NFT" Youtube channel</p>

            <Box height="30" />

            <img alt="Layers" src="/images/layers.png" className="full-image" />

            <Box height="30" />
            <p>We can see individual layers in bottom right corner</p>

            <Box height="50" />

            <p>2. Export layers</p>

            <Box height="30" />
            <p>Once all individual layers are generated, choose export layers to files as shown in below screenshot</p>

            <Box height="30" />

            <img alt="Export" src="/images/export.png" className="full-image" />

            <Box height="30" />
            <p>Finally Run the export with following configurations</p>

            <Box height="30" />

            <img alt="Config" src="/images/config.png" className="full-image" />

            <Box height="30" />
            <p>Make sure all images have same dimensions</p>

            <Box height="50" />

            <p>3. Folder structure</p>

            <Box height="30" />
            <p>Structure the exported layers into 'input' directory in your local filesystem as follows.</p>

            <Box height="10" />
            <p></p>

            <Box height="30" />

            <img alt="Folder Structure" src="/images/folder.png" />

            <Box height="30" />

            <p>Each NFT has its own properties. Take a note that name of folder is the "type" of property and its contents are "values" of property</p>

            <Box height="10" />
            <p>Properties in metadata of NFTs will be automatically generated from folder and file names. Make sure you name them accordingly
            </p>

            <Box height="30" />
            <p>Optionally you can also wish to store copies of images and metadata locally</p>

            <Box height="10" />
            <p>If you wish so, create an empty directory as output. Before generating images and metadata, all previous
                contents of output directory are deleted permanently.
            </p>

            <Box height="30" />

            <p>Your manual work ends here. Mintit will take over from here</p>

            <Box height="50" />

            <div className="center-child">
                <button onClick={() => { navigate('/generate') }}
                    type="submit" >Let's Mint</button>
            </div>

            <Box height="50" />

        </div>
    );
}

export default DocPage;
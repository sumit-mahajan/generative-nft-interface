
# MINTIT - A Generative NFT Web interface

A web interface for generation of generative NFT artworks. 

## Features

- Creation of random multiple, unique NFTs in one go
- Rarity of traits can be controlled by assigning weights to each value of a attribute
- Batch minting of NFTs 
- Collection minted on our MINTIT marketplace.


## Documentation

**Installation**

`npm install` in client directory

**Usage**

Open two terminals

In one terminal `truffle develop` then `migrate`

In other terminal `cd client` then `npm run start`

You will also need to add to your Metamask wallet a Custom Network with following values
- Network RPC URL - http://localhost:7454
- Chain ID - 1337

Before you start, make sure your file structure which has the different layers looks like this:

YOUR_PROJECT/  
├─ trait1_name/  
│  ├─ file1.png  
│  ├─ file2.png  
│  ├─ file3.png  
│  ├─ ...  
├─ trait2_name/  
│  ├─ file4.png  
│  ├─ file5.png  
│  ├─ ...  
├─ trait3_name/  
│  ├─ file6.png  
│  ├─ ...  
├─ ...  

For e.g. - 

input/  
├─ Background/  
│  ├─ Black.png  
│  ├─ Green.png  
│  ├─ Purple.png  
│  ├─ ...  
├─ Eye Color/  
│  ├─ Cyan.png  
│  ├─ Yellow.png  
│  ├─ ...  
├─ ... 

This is necesary, since the application imports the traits based on the folder structure.

The first input allows you to select where your images are located (input folder in above example).

After selecting the directory (input) you can see all the folders shown as traits and all images inside that folder shown as attributes.
The ordering of the traits is important as layers will be stacked on top of each other based on the order. 
The ordering can be changed by dragging the trait to its approriate level.
Also, the rarity of an attribute can be set by adjusting the values against each value. The more the value, the more that attribute will appear in respective trait i.e. less rareness.

Then you mention the nummber of NFTs you want to generate.

There is also an option of Ouptut if you want the generated NFTs locally.

If you want metadata to be generated the script will ask you for a name, a description and an image url.

On the next page a preview of generated images is shown.

Provide data regarding collection and proceed to minting.

All generated NFTs are minted in a single transaction. You will need some test MATIC to mint which can be found on [https://faucet.polygon.technology/](https://faucet.polygon.technology/) 


## Tech Stack

- IPFS with NFT.Storage
- Canvas
- React Truffle Box

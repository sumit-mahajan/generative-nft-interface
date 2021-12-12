// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./CustomCollection.sol";

contract Marketplace {
    // ** User ** //

    // // To store user data
    // struct User {
    //     string name;
    //     string image;
    //     string twitterUrl;
    //     string websiteUrl;
    // }

    // // To store users (address => User)
    // mapping(address => User) public users;

    // On user creation/updation
    event UserCreated(
        address uAddress,
        string name,
        string image,
        string twitterUrl,
        string websiteUrl
    );

    // Create/Update user profile
    function createUser(
        string memory name_,
        string memory image_,
        string memory twitterUrl_,
        string memory websiteUrl_
    ) public {
        // Map address to User
        // users[msg.sender] = User(name_, image_, twitterUrl_, websiteUrl_);

        // Log event to subgraph
        emit UserCreated(msg.sender, name_, image_, twitterUrl_, websiteUrl_);
    }

    // ** Custom Collection ** //

    // On collection creation
    event CollectionCreated(
        address cAddress,
        string name,
        string image,
        address creator,
        string metadata
    );

    // Create and List collection on marketplace
    function createCollection(
        string memory name_,
        string memory symbol_,
        string memory image_,
        string memory metadata_
    ) public {
        address cAddress = address(
            // Deploy new collection contract
            new CustomCollection(name_, symbol_, metadata_, msg.sender)
        );

        // Log event to subgraph
        emit CollectionCreated(cAddress, name_, image_, msg.sender, metadata_);
    }

    // To buy fixed price nfts
    // CustomCollection - buyFixedPriceNft() calls this function
    function marketPlaceTransferFrom(
        address cAddress,
        address nftOwner,
        address newOwner,
        uint256 tokenId
    ) public {
        // Check if caller is collection
        require(
            msg.sender == cAddress,
            "Marketplace : marketPlaceTransferFrom -> Caller is not contract"
        );

        CustomCollection(cAddress).safeTransferFrom(
            nftOwner,
            newOwner,
            tokenId
        );
    }

    // Function to receive funds. 
    // Called when transfer is executed on this contract address
    // msg.data must be empty 
    receive() external payable {}
}

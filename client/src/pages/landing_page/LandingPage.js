import React from "react";
import { Box } from "../../components/Box";
import "./landing_page.scss";
import { useNavigate } from 'react-router-dom';
/* global BigInt */

function LandingPage() {

    const navigate = useNavigate()

    return (
        <div className="container">
            <Box height="50" />

            <h1>Randomly generate multiple NFTs in 4 easy steps</h1>

            <Box height="50" />

            <div className="landing-flex">
                <div className="intro">
                    <h2>PROMINENT FEATURES</h2>
                    <Box height="30" />
                    <ul>
                        <li>Randomly generate a collection of upto 100 NFTs from your base layers</li>
                        <Box height="10" />
                        <li>Customize rarity of traits and generate metadata</li>
                        <Box height="10" />
                        <li>No uploading / downloading of images. Completely private client side tool <br />( Works only on Chrome & Edge ) </li>
                        <Box height="10" />
                        <li>Adjoined Minting interface to create a new collection and batch minting of NFTs
                            {/* on MINTIT's mobile NFT marketplace */}
                        </li>
                    </ul>
                    <Box height="50" />
                    <button style={{ width: "200px" }}
                        onClick={() => { navigate('/prerequisites') }}
                    >Get Started</button>
                </div>
                <Box width="300" />

                <img className="illustration" src="/images/illustration.svg" alt="Illustration" />
            </div>
        </div>
    );
}

export default LandingPage;
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { firestore } from './firebase'; // Adjust the path to your Firebase config
import { doc, getDoc } from "firebase/firestore";
import { ethers } from 'ethers';
import NFTMarketplace from '../contract-api/NFTMarketplace.json'; // Adjust the path to your contract ABI
import { Heart } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import '../styles/DetailsNFT.css';

const CONTRACT_ADDRESS = "0xc19CfaB505A2d9BaA60640410Ef5D6B1B2e15bdD"; // Your contract address

const DetailsNFT = () => {
  const { nftId } = useParams();
  const [nft, setNft] = useState(null);

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        const nftDoc = await getDoc(doc(firestore, "nfts", nftId));
        if (nftDoc.exists()) {
          setNft(nftDoc.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching NFT:", error);
      }
    };

    fetchNFT();
  }, [nftId]);

  const handleBuyNow = async (nft) => {
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Connect to MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTMarketplace.abi, signer);

      // Call the createMarketSale function
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: ethers.utils.parseEther(nft.price) // Ensure the price is in ETH
      });

      await transaction.wait();
      console.log(`NFT purchased: ${nft.name}`);
      alert('NFT purchased successfully!');
    } catch (error) {
      console.error("Error buying NFT:", error);
      alert('Error buying NFT');
    }
  };

  if (!nft) {
    return (
      <div className="errorContainer">
        <h2>NFT not found.</h2>
        <p>The NFT you are looking for does not exist.</p>
        <Link to="/explore" className="backButton">Go back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="detailsNFTContainer">
      <img src={nft.image} alt={nft.name} className="nftImage" />
      <div className="detailsContent">
        <div className="nftInfo">
          <div className="nftDetails1">
            <p className="nftTitle">{nft.name}</p>
            <p className="nftAuthor">Author: {nft.creator}</p>
            <p className="nftDate">{nft.date}</p>
          </div>
          <div className="nftDetails2">
            <p className="nftLTP">{nft.LTP} LTP</p>
            <p className="nftPrice">{nft.price} ETH</p>
            <div className="likeContainer">
              <Heart className="heartIcon" />
              <span className="likeCount">{nft.likes}</span>
            </div>
          </div>
        </div>
        <div className="nftDescription">
          <h3>Description</h3>
          <p>{nft.description}</p>
        </div>
        <Button className="buyButton" onClick={() => handleBuyNow(nft)}>Buy now</Button>
      </div>
    </div>
  );
};

export default DetailsNFT;

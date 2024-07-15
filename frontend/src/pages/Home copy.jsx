import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Heart } from 'react-bootstrap-icons';
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the path to your firebase config
<<<<<<< HEAD
import NFTMarketplace from '../contract-api/NFTMarketplace.json'; // Adjust the path to your contract ABI
import '../styles/Home.css';

const CONTRACT_ADDRESS = "0xc19CfaB505A2d9BaA60640410Ef5D6B1B2e15bdD";
=======
//import NFTMarketplace from '../contract-api/NFTMarketplace.json'; // Adjust the path to your contract ABI
import '../styles/Home.css';

//const CONTRACT_ADDRESS = "0xc19CfaB505A2d9BaA60640410Ef5D6B1B2e15bdD";
>>>>>>> f2cdfa502a511fcbd9e69bb4506248b5a5276473

const Home = () => {
  const [nfts, setNfts] = useState([]);
  const [hoveredNFT, setHoveredNFT] = useState(null);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const nftCollection = collection(db, "nfts");
      const nftSnapshot = await getDocs(nftCollection);
      const fetchedNFTs = nftSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNfts(fetchedNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const handleMouseEnter = (nftId) => {
    setHoveredNFT(nftId);
  };

  const handleMouseLeave = () => {
    setHoveredNFT(null);
  };

<<<<<<< HEAD
  const handleBuyNow = async (nft) => {
=======
  /*const handleBuyNow = async (nft) => {
>>>>>>> f2cdfa502a511fcbd9e69bb4506248b5a5276473
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Connect to MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTMarketplace.abi, signer);

      // Call the createMarketSale function
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: ethers.utils.parseEther(nft.price)
      });

      await transaction.wait();
      console.log(`NFT purchased: ${nft.name}`);
      fetchNFTs(); // Refresh the NFT list after purchase
    } catch (error) {
      console.error("Error buying NFT:", error);
    }
<<<<<<< HEAD
  };
=======
  };*/
>>>>>>> f2cdfa502a511fcbd9e69bb4506248b5a5276473

  return (
    <Container className="home-container">
      <div className="homeContainer">
        <div className="hero">
          <p className="ltp">LTP</p>
          <h1 className="title">NFT MARKETPLACE</h1>
          <h2 className="subtitle">Where Masterpieces become digital</h2>
          <div className="heroButtons">
            <Link to="/explore">
              <Button variant="primary" className="exploreButton">Explore</Button>
            </Link>
            <Link to="/mint-nft">
              <Button variant="outline-light" className="createButton">Create</Button>
            </Link>
          </div>
        </div>

        <h3 className="whatsNew">What is new?</h3>
        <Row className="g-4">
          {nfts.map((nft) => (
            <Col key={nft.id} xs={12} sm={6} md={3}>
              <Link to={`/details-nft/${nft.id}`} className="nftCardLink">
                <div
                  className={`nftCard ${hoveredNFT === nft.id ? 'hovered' : ''}`}
                  onMouseEnter={() => handleMouseEnter(nft.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img src={nft.image} alt={nft.name} className="nftImage" />
                  {hoveredNFT === nft.id && (
                    <div className="nftInfo">
                      <div className="nftDetails1">
                        <p className="nftTitle">{nft.name}</p>
<<<<<<< HEAD
                        <p className="nftAuthor">Author: {nft.creator}</p>
=======
                        <p className="nftAuthor">Author: {nft.seller}</p>
>>>>>>> f2cdfa502a511fcbd9e69bb4506248b5a5276473
                        <p className="nftDate">{nft.date}</p>
                        <Button className="buyButton" onClick={(e) => { e.preventDefault(); handleBuyNow(nft); }}>
                          Buy now
                        </Button>
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
                  )}
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default Home;

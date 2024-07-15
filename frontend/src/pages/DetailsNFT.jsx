import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from './firebase'; // Điều chỉnh đường dẫn tới cấu hình Firebase của bạn
import { doc, getDoc } from "firebase/firestore";
import { ethers } from 'ethers';
import newNFT from '../contract-api/newNFT.json'; // Điều chỉnh đường dẫn tới ABI của contract
import { Heart } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import '../styles/DetailsNFT.css';
import addressContract from '../contract-api/addressContract';


const CONTRACT_ADDRESS = addressContract; // Điền địa chỉ contract của bạn

const DetailsNFT = () => {
  const { nftId } = useParams();
  const [nft, setNft] = useState(null);

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        // Kết nối tới MetaMask nếu chưa kết nối
        if (!window.ethereum) {
          console.error('MetaMask not detected');
          return;
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Kết nối tới provider của MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Tạo contract instance với ABI và địa chỉ của contract
        const contract = new ethers.Contract(CONTRACT_ADDRESS, newNFT.abi, signer);

        // Gọi hàm getNFTInfo từ contract để lấy thông tin của NFT với tokenId là nftId
        const [name, description, creator, owner, price, likes, imageURL] = await contract.getNFTInfo(nftId);

        // Lưu thông tin vào state
        setNft({
          name,
          description,
          creator,
          owner: owner.toLowerCase(), // Chuyển đổi owner về lower case để tránh lỗi Objects are not valid as a React child
          price: ethers.utils.formatEther(price), // Format giá để render
          likes: parseInt(likes._hex), // Parse giá trị likes từ BigNumber
          imageURL
        });
      } catch (error) {
        console.error("Error fetching NFT:", error);
      }
    };

    fetchNFT();
  }, [nftId]);

  if (!nft) {
    return (
      <div className="errorContainer">
        <h2>NFT not found.</h2>
        <p>The NFT you are looking for does not exist.</p>
        <Link to="/explore" className="backButton">Go back to Explore</Link> {/* Sử dụng Link để điều hướng */}
      </div>
    );
  }

  return (
    <div className="detailsNFTContainer">
      <img src={nft.imageURL} alt={nft.name} className="nftImage" />
      <div className="detailsContent">
        <div className="nftInfo">
          <div className="nftDetails1">
            <p className="nftTitle">{nft.name}</p>
            <p className="nftAuthor">Creator: {nft.creator}</p>
            <p className="nftOwner">Owner: {nft.owner}</p>
          </div>
          <div className="nftDetails2">
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

/*import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from './firebase'; // Adjust the path to your Firebase config
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
        const nftDoc = await getDoc(doc(db, "nfts", nftId));
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
*/
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from './firebase'; // Điều chỉnh đường dẫn tới cấu hình Firebase của bạn
<<<<<<< HEAD
=======
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
>>>>>>> f2cdfa502a511fcbd9e69bb4506248b5a5276473
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

<<<<<<< HEAD
export default DetailsNFT;
=======
export default DetailsNFT;
*/
>>>>>>> f2cdfa502a511fcbd9e69bb4506248b5a5276473

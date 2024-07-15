import { useState } from "react";
import { Button, Container, Form, Image } from "react-bootstrap";
import { ethers } from "ethers";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "./firebase"; // Adjust the path to your firebase config
import { collection, addDoc } from "firebase/firestore";
import NFTMarketplace from "../contract-api/NFTMarketplace.json"; // Adjust the path to your contract ABI

const CONTRACT_ADDRESS = "0xc19CfaB505A2d9BaA60640410Ef5D6B1B2e15bdD";

export default function MintNFT() {
    const [name, setName] = useState("");
    const [externalLink, setExternalLink] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [price, setPrice] = useState("");

    const handleCreateNFT = async (e) => {
        e.preventDefault();

        if (!file || !price) {
            alert("Please upload a file and set a price.");
            return;
        }

        try {
            const storageRef = ref(storage, `nfts/${file.name}`);
            await uploadBytes(storageRef, file);
            const fileURL = await getDownloadURL(storageRef);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTMarketplace.abi, signer);

            const tokenURI = JSON.stringify({
                name,
                description,
                image: fileURL,
                externalLink,
                seller
            });

            const transaction = await contract.createToken(tokenURI, ethers.utils.parseEther(price), {
                value: ethers.utils.parseEther("0.01"), // Listing price
            });

            await transaction.wait();

            // Save metadata to Firestore
            const nftMetadata = {
                name,
                description,
                image: fileURL,
                externalLink,
                price,
            };

            await addDoc(collection(db, "nfts"), nftMetadata);

            alert("NFT created and listed successfully!");

            // Optionally, you can redirect or refresh the page to show the new NFT
        } catch (error) {
            console.error("Error creating NFT:", error);
            alert("Error creating NFT");
        }
    };

    return (
        <Container className="mt-4">
            <Form data-bs-theme="dark" onSubmit={handleCreateNFT}>
                <h1 style={{ color: "white" }}>Create New Item</h1>
                <Form.Group className="mb-3" style={{ width: "100%" }} controlId="exampleForm.ControlInput5">
                    <Form.Label style={{ color: "white" }}>Your Masterpiece</Form.Label>
                    <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlqsyY5rh2kAACkIXtTDO97F5_Hsa7bCYDEg&s" style={{ width: 200, height: 200, display: "block" }} />
                    <Form.Text muted>Only accept .jpeg, .jpg, .png, .gif</Form.Text>
                    <Form.Control type="file" style={{ width: 300, textAlign: "center", display: "block", margin: "4px 0" }} onChange={(e) => setFile(e.target.files[0])} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ color: "white" }}>Name</Form.Label>
                    <Form.Control type="text" placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ color: "white" }}>External link</Form.Label>
                    <Form.Control type="text" placeholder="https://yoursite.io/item/123" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} />
                    <Form.Text muted>
                        LTP NFT Marketplace will include a link to this URL on this item’s detail page, so that users can click to learn more about it. You are welcome to link to your own web page with more details.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                    <Form.Label style={{ color: "white" }}>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Provide a detailed description of your item" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <Form.Text muted>
                        The description will be included on the item’s detail page underneath its image. Markdown syntax is supported.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                    <Form.Label style={{ color: "white" }}>Price (ETH)</Form.Label>
                    <Form.Control type="text" placeholder="Enter price in ETH" value={price} onChange={(e) => setPrice(e.target.value)} />
                </Form.Group>
                <Button variant="outline-light" type="submit">Create</Button>
            </Form>
        </Container>
    );
}

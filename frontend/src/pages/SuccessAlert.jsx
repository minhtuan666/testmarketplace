import React from 'react';
import { Modal, Image } from 'react-bootstrap';

export default function SuccessAlert({ show, onHide }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Body className="text-center">
                <Image src="/mnt/data/image.png" fluid />
                <h4>You created NFT!</h4>
                <p>You just created an NFT.</p>
            </Modal.Body>
        </Modal>
    );
}

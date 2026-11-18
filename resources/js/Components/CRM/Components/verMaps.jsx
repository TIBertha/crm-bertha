import React, { useState } from 'react';
import { Modal, ModalBody, ModalTitle } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';

export default function VerMaps({ flag, name, img }) {
    const [show, setShow] = useState(false);

    const title = `Mapa metropolitano de ${name}`;

    return (
        <>
            <button
                type="button"
                className="btn btn-sm btn-flag-mix"
                onClick={() => setShow(true)}
                title={title}
                aria-label={title}
            >
                <span
                    className={`flag-icon flag-icon-${flag} flag-icon-squared flag-style`}
                    style={{
                        width: '15px',
                        height: '15px',
                        backgroundSize: '15px 15px',
                    }}
                    aria-hidden="true"
                />
            </button>

            <Modal
                show={show}
                onHide={() => setShow(false)}
                dialogClassName={`mapas-modal mapas-modal-${flag}`}
                centered
            >
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle className="fs-6">
                        {title}
                    </ModalTitle>
                </ModalHeader>

                <ModalBody className="mapas-modal-body">
                    <img
                        src={img}
                        className="mapas-modal-image"
                        alt={title}
                    />
                </ModalBody>
            </Modal>
        </>
    );
}

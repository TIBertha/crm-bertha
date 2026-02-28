import React, { useEffect, useState } from "react";
import ModalHeader from "react-bootstrap/ModalHeader";
import { Modal, ModalBody, ModalTitle } from "react-bootstrap";
import { getDisplayHeight } from "../../Functions/General.jsx";

export default function VerImgModal({ image, titleModal }) {
    const [show, setShow] = useState(false);
    let modalTitle = "Ver " + titleModal;

    function closeModal() {
        setShow(false);
    }

    function openModal() {
        setShow(true);
    }

    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    let displayHeight = getDisplayHeight();

    return (
        <>
            <a className={"text-secondary"} role="button" onClick={openModal}>
                <img
                    src={image}
                    className="img-adjunto img-ver-modal"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={modalTitle}
                />
            </a>
            <Modal size="xl" show={show} onHide={closeModal} centered={true}>
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6>
                            <i className={"fas fa-file-image me-2"}></i>
                            {modalTitle}
                        </h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-10">
                    <div
                        className={"div-modal-ver-cartilla text-center"}
                        style={{ height: displayHeight * 0.75 + "px" }}
                    >
                        <img
                            src={image}
                            className={"iframe-modal-ver-cartilla h-100"}
                        />
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
}

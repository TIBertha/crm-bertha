import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Modal, ModalBody, ModalTitle, ModalHeader } from "react-bootstrap";

export default function SessionMenu({ url, profilename, profilepic }) {
    const [show, setShow] = useState(false);
    const [deviceData, setDeviceData] = useState("");
    const [countryIPAddress, setCountryIPAddress] = useState("");

    useEffect(() => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://ipinfo.io/json", true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(this.responseText);
                setDeviceData(response);
                setCountryIPAddress(response.country);
            }
        };
    }, []);

    return (
        <>
            <a
                role="button"
                onClick={(e) => setShow(true)}
                className={"btn btn-sm session-menu-button"}
            >
                <img src={profilepic} />
            </a>
            <Modal
                size={"sm"}
                show={show}
                onHide={(e) => setShow(false)}
                centered={true}
                dialogClassName={"custom-modal"}
                backdrop="static"
            >
                <ModalBody className="py-20 text-center">
                    <div className="modal-profile">
                        <i
                            class="close-button fa-solid fa-xmark"
                            onClick={(e) => setShow(false)}
                        ></i>
                        <img src={profilepic} />
                        <div className="name mt-3">
                            Hola, <strong>{profilename}!</strong>
                        </div>
                        <div className="onLine">
                            <span
                                className={
                                    "flag-icon flag-icon-" +
                                    countryIPAddress.toLowerCase() +
                                    " flag-icon-squared flag-style"
                                }
                            ></span>
                            <span className="badge rounded-pill ms-2">
                                EN LINEA
                            </span>
                        </div>
                        <div className="ipAddress">
                            <span className="badge rounded-pill">
                                {deviceData.ip}
                            </span>
                            <div className="alertmessage">
                                Así es, podemos ver tu IP, tu ID, clics y
                                acciones que haces. Al afiliarte a Bertha
                                aceptaste esas condiciones. Pórtate bien!
                            </div>
                        </div>

                        <div className="options">
                            <a className="btn bertha-purple-button" href={url + '/logout'}>
                                Cerrar Sesión
                            </a>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}

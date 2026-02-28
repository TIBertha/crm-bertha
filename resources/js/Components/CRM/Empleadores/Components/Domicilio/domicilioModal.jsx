import React, { useState } from 'react';
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import DomicilioModalForm from "./domicilioModalForm.jsx";

export default function DomicilioModal({ show, close, dataEdit, add, edit }) {
    return (
        <Modal
            size="md"
            scrollable={false}
            show={show}
            onHide={close}
            centered
            backdrop="static"
            keyboard={false}
        >
            <ModalHeader className="bertha-content-aviso" closeButton>
                <ModalTitle>
                    <h6>{(dataEdit ? 'Editar' : 'Agregar') + ' Domicilio'}</h6>
                </ModalTitle>
            </ModalHeader>

            <form>
                <ModalBody>
                    <div className="layout-form-search-side">
                        <DomicilioModalForm
                            dataEdit={dataEdit}
                            add={add}
                            edit={edit}
                            close={close}
                        />
                    </div>
                </ModalBody>
            </form>
        </Modal>
    );
}

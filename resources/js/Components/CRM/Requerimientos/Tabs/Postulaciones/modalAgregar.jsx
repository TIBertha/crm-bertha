import React from 'react';
import ModalHeader from "react-bootstrap/ModalHeader";
import {Modal, ModalBody} from "react-bootstrap";
import PostulacionesListAdd from "./postulacionesListAdd.jsx";

export default function ModalAgregar({show, close, resultadosPostulantes, addPostulante, searchPostulanteAdd, onChangeSearch}) {

    return (

        <div>

            <Modal size="md" scrollable={false} backdrop="static" keyboard={false} show={show} onHide={ (e) => close() } centered={true}>

                <ModalHeader className="bertha-content-aviso" closeButton>
                    <span className="title-search-side">Agregar postulante</span>
                </ModalHeader>

                <ModalBody>

                    <div className="layout-form-search-side">

                        <div className="form-group has-search w-100">
                            <span className="form-control-feedback"></span>
                            <input type="search" className="form-control" placeholder="Ingresar nombre del postulante" name="searchPostulanteAdd" value={searchPostulanteAdd} onChange={ (e) => onChangeSearch(e, true) }/>
                        </div>

                        <div className="modal-postulante-add-zone">

                            {resultadosPostulantes.length > 0 ?
                                <ul className="list-postulaciones list-group list-unstyled">
                                    {resultadosPostulantes.map((data, key) =>
                                        <PostulacionesListAdd key={key} data={data} addPostulante={addPostulante}/>
                                    )}
                                </ul>

                                :

                                <div className="col-12 form-group">
                                    <div className="alert alert-warning" role="alert">
                                        Realiza la busqueda de tu postulante.
                                    </div>
                                </div>
                            }

                        </div>

                    </div>

                </ModalBody>

            </Modal>

        </div>

    );

}

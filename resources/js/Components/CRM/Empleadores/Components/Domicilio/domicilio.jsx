import React, {useState} from "react";
import DomicilioModal from './DomicilioModal';

export default function Domicilio({ domicilios, add, edit, delete: deleteItem }) {
    const [dataEdit, setDataEdit] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (e, data = '') => {
        setIsModalOpen(true);
        setDataEdit(data);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="row mt-30">
            <div className="col-sm">

                <DomicilioModal
                    show={isModalOpen}
                    close={closeModal}
                    dataEdit={dataEdit}
                    add={add}
                    edit={edit}
                />

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="wrapper wrapper-content">
                                <div className="ibox-content">

                                    {domicilios.map((dom, key) => {
                                        const link = dom.linkOpcional
                                            ? dom.linkOpcional
                                            : `https://www.google.com/maps/search/?api=1&query=${dom.direccion}%2C${dom.nombredistrito}`;

                                        return (
                                            <div key={key} className="domicilio-card">
                                                <div className="row">

                                                    <div className="col-auto">
                                                        <div className="icon">
                                                            <i className="fas fa-address-book"></i>
                                                        </div>
                                                    </div>

                                                    <div className="col">
                                                        <div className="item-title">DIRECCIÓN {key + 1}</div>
                                                        <div className="item-direc font-weight-500">{dom.direccion}</div>
                                                        <div className="item-refer">{dom.nombredistrito || '--'}</div>
                                                        <div className="item-refer">{`REF: ${dom.referencia || '--'}`}</div>

                                                        <div className="item-actions">
                                                            <i className="fas fa-edit" onClick={(e) => openModal(e, dom)}></i>

                                                            <a
                                                                href={link}
                                                                className="link-map ms-3"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <i className="fas fa-map-marked-alt"></i>
                                                            </a>

                                                            {dom.delete && (
                                                                <i
                                                                    className="fas fa-trash-alt ms-3"
                                                                    onClick={() => deleteItem(key, dom.id)}
                                                                ></i>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="mb-4">
                            <div className="add-item" onClick={(e) => openModal(e)}>
                                <i className="fas fa-plus"></i> Adicionar nuevo
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

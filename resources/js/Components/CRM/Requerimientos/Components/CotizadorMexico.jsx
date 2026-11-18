
import React, { useState } from 'react';
import { Modal, ModalBody, ModalTitle } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';
import { NumericFormat } from 'react-number-format';
import { isResponsive } from '../../../Functions/General.jsx';
import NewCopyButton from '../../Components/newCopyButton.jsx';
import { getSpeechCotizadorMexico } from '../../../Functions/SpeechCotizadorMexico.jsx';

export default function CotizadorMexico({}) {
    const [show, setShow] = useState(false);
    const [modalidad, setModalidad] = useState('1');
    const [actividad, setActividad] = useState('1');
    const [sueldo, setSueldo] = useState('');
    const [frecuencia, setFrecuencia] = useState('');

    const responsive = isResponsive();
    const porDias = Number(modalidad) === 3;

    const speech = getSpeechCotizadorMexico(
        actividad,
        modalidad,
        sueldo,
        frecuencia,
    );

    const closeModal = () => {
        setShow(false);
        setModalidad('1');
        setActividad('1');
        setSueldo('');
        setFrecuencia('');
    };

    const cambiarModalidad = e => {
        setModalidad(e.target.value);
        setSueldo('');
        setFrecuencia('');
    };

    return (
        <>
            <button
                type="button"
                className={
                    'btn bertha-green-button text-white ' +
                    (responsive ? 'btn-lg w-100' : 'btn-sm')
                }
                title="CotizadorPeru de comisión — México"
                onClick={() => setShow(true)}
            >
                <span
                    className="flag-icon flag-icon-mx me-2"
                    aria-hidden="true"
                />

                <i
                    className="fas fa-comments-dollar"
                    aria-hidden="true"
                />

                {responsive && (
                    <span className="ms-2">CotizadorPeru México</span>
                )}
            </button>

            <Modal
                size="md"
                backdrop="static"
                keyboard={false}
                show={show}
                onHide={closeModal}
                centered
            >
                <ModalHeader className="border-0 pb-0" closeButton>
                    <ModalTitle>
                        <h6>
                            <span
                                className="flag-icon flag-icon-mx me-2"
                                aria-hidden="true"
                            />
                            CotizadorPeru de comisión — México
                        </h6>
                    </ModalTitle>
                </ModalHeader>

                <ModalBody className="py-3">
                    <section className="row justify-content-center">
                        <div className="form-group col-12">
                            <label className="col-form-label">
                                {porDias
                                    ? 'Sueldo por día (MXN $)'
                                    : 'Sueldo mensual (MXN $)'}
                            </label>

                            <NumericFormat
                                type="text"
                                value={porDias ? '500' : sueldo}
                                className="form-control"
                                placeholder="Ingrese el sueldo"
                                allowNegative={false}
                                thousandSeparator=","
                                decimalScale={2}
                                valueIsNumericString
                                onValueChange={values =>
                                    setSueldo(values.value)
                                }
                                readOnly={porDias}
                            />

                            {porDias && (
                                <small className="text-muted">
                                    Tarifa fija: $500 por día.
                                </small>
                            )}
                        </div>

                        <div className="form-group col-12">
                            <label className="col-form-label">
                                Actividad
                            </label>

                            <select
                                className="form-control"
                                value={actividad}
                                onChange={e => setActividad(e.target.value)}
                            >
                                <option value="1">TODO SERVICIO</option>
                                <option value="3">ENFERMERÍA</option>
                                <option value="6">NIÑERA</option>
                                <option value="10">
                                    CUIDADO ADULTO MAYOR
                                </option>
                            </select>
                        </div>

                        <div className="form-group col-12 mb-3">
                            <label className="col-form-label">
                                Modalidad
                            </label>

                            <select
                                className="form-control"
                                value={modalidad}
                                onChange={cambiarModalidad}
                            >
                                <option value="1">DE PLANTA</option>
                                <option value="2">ENTRADA POR SALIDA</option>
                                <option value="3">POR DÍAS</option>
                            </select>
                        </div>

                        {porDias && (
                            <div className="form-group col-12 mb-3">
                                <label className="col-form-label">
                                    Frecuencia
                                </label>

                                <select
                                    className="form-control"
                                    value={frecuencia}
                                    onChange={e =>
                                        setFrecuencia(e.target.value)
                                    }
                                >
                                    <option value="" disabled>
                                        Seleccione
                                    </option>

                                    <option value="1">
                                        1 VEZ A LA SEMANA
                                    </option>
                                    <option value="2">
                                        2 VECES A LA SEMANA
                                    </option>
                                    <option value="3">
                                        3 VECES A LA SEMANA
                                    </option>
                                    <option value="4">
                                        4 VECES A LA SEMANA
                                    </option>
                                </select>
                            </div>
                        )}

                        {speech && (
                            <div className="form-group col-12 mb-2">
                                <NewCopyButton
                                    copyText={speech}
                                    successMsj="Cotización copiada"
                                    btnText="Copiar cotización"
                                    btnColor="purple"
                                />
                            </div>
                        )}
                    </section>
                </ModalBody>
            </Modal>
        </>
    );
}

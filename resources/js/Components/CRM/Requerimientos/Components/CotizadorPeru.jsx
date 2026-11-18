import React, { useState } from 'react';
import { Modal, ModalBody, ModalTitle } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';
import { NumericFormat } from 'react-number-format';
import { isResponsive } from '../../../Functions/General.jsx';
import NewCopyButton from '../../Components/newCopyButton.jsx';
import { getSpeechCotizadorPeru } from '../../../Functions/SpeechCotizadorPeru.jsx';

export default function CotizadorPeru() {
    const [show, setShow] = useState(false);
    const [modalidad, setModalidad] = useState('1');
    const [actividad, setActividad] = useState('1');
    const [sueldo, setSueldo] = useState('');
    const [frecuencia, setFrecuencia] = useState('');

    const responsive = isResponsive();
    const porDias = Number(modalidad) === 3;

    const sueldoValido = Number(sueldo) > 0;
    const frecuenciaValida = !porDias
        || [1, 2, 3, 4].includes(Number(frecuencia));

    const puedeCotizar = sueldoValido
        && frecuenciaValida
        && [1, 3, 6, 10].includes(Number(actividad))
        && [1, 2, 3].includes(Number(modalidad));

    const generarSpeech = tipo => {
        if (!puedeCotizar) {
            return '';
        }

        return getSpeechCotizadorPeru(
            Number(actividad),
            Number(modalidad),
            sueldo,
            porDias ? Number(frecuencia) : '',
            '3',
            'pe',
            tipo
        );
    };

    const speechRegular = generarSpeech('type1');
    const speechDesignacion = generarSpeech('type2');

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
                title="Cotizador de comisión — Perú"
                aria-label="Abrir cotizador de comisión de Perú"
                onClick={() => setShow(true)}
            >
                <span
                    className="flag-icon flag-icon-pe me-2"
                    aria-hidden="true"
                />

                <i
                    className="fas fa-comments-dollar"
                    aria-hidden="true"
                />

                {responsive && (
                    <span className="ms-2">Cotizador Perú</span>
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
                                className="flag-icon flag-icon-pe me-2"
                                aria-hidden="true"
                            />
                            Cotizador de comisión — Perú
                        </h6>
                    </ModalTitle>
                </ModalHeader>

                <ModalBody className="py-3">
                    <section className="row justify-content-center">
                        <div className="form-group col-12">
                            <label
                                htmlFor="cotizador-pe-sueldo"
                                className="col-form-label"
                            >
                                {porDias
                                    ? 'Sueldo por día (S/)'
                                    : 'Sueldo mensual (S/)'}
                            </label>

                            <NumericFormat
                                id="cotizador-pe-sueldo"
                                type="text"
                                value={sueldo}
                                className="form-control"
                                placeholder={
                                    porDias
                                        ? 'Ingrese el sueldo por día'
                                        : 'Ingrese el sueldo mensual'
                                }
                                allowNegative={false}
                                thousandSeparator=","
                                decimalScale={2}
                                valueIsNumericString
                                onValueChange={values =>
                                    setSueldo(values.value)
                                }
                            />
                        </div>

                        <div className="form-group col-12">
                            <label
                                htmlFor="cotizador-pe-actividad"
                                className="col-form-label"
                            >
                                Actividad
                            </label>

                            <select
                                id="cotizador-pe-actividad"
                                className="form-control"
                                value={actividad}
                                onChange={e =>
                                    setActividad(e.target.value)
                                }
                            >
                                <option value="1">TODO SERVICIO</option>
                                <option value="3">ENFERMERÍA</option>
                                <option value="6">NANA</option>
                                <option value="10">
                                    CUIDADO ADULTO MAYOR
                                </option>
                            </select>
                        </div>

                        <div className="form-group col-12 mb-3">
                            <label
                                htmlFor="cotizador-pe-modalidad"
                                className="col-form-label"
                            >
                                Modalidad
                            </label>

                            <select
                                id="cotizador-pe-modalidad"
                                className="form-control"
                                value={modalidad}
                                onChange={cambiarModalidad}
                            >
                                <option value="1">CAMA ADENTRO</option>
                                <option value="2">CAMA AFUERA</option>
                                <option value="3">POR DÍAS</option>
                            </select>
                        </div>

                        {porDias && (
                            <div className="form-group col-12 mb-3">
                                <label
                                    htmlFor="cotizador-pe-frecuencia"
                                    className="col-form-label"
                                >
                                    Frecuencia
                                </label>

                                <select
                                    id="cotizador-pe-frecuencia"
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

                        {speechRegular && (
                            <div className="form-group col-12 mb-2">
                                <NewCopyButton
                                    copyText={speechRegular}
                                    successMsj="Cotización copiada"
                                    btnText="Regular"
                                    btnColor="purple"
                                />
                            </div>
                        )}

                        {speechDesignacion && (
                            <div className="form-group col-12 mb-2">
                                <NewCopyButton
                                    copyText={speechDesignacion}
                                    successMsj="Cotización copiada"
                                    btnText="Designación"
                                    btnColor="pink"
                                />
                            </div>
                        )}
                    </section>
                </ModalBody>
            </Modal>
        </>
    );
}

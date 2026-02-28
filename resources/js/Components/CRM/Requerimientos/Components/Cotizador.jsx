import React, {useEffect, useState} from 'react';
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import { NumericFormat, PatternFormat } from "react-number-format";
import {isResponsive} from "../../../Functions/General.jsx";
import NewCopyButton from "../../Components/newCopyButton.jsx";
import {getSpeechCotizador} from "../../../Functions/SpeechCotizador.jsx";

export default function Cotizador({url}) {

    const [show, setShow] = useState(false);
    const [country, setCountry] = useState('pe');
    const [modalidad, setModalidad] = useState(1);
    const [actividad, setActividad] = useState(1);
    const [garantia, setGarantia] = useState('3');
    const [sueldo, setSueldo] = useState('');
    const [frecuencia, setFrecuencia] = useState('');
    const [speech, setSpeech] = useState('');
    const [textoCopiar, setTextoCopiar] = useState('Copiar');
    let conf = {title: 'Cotizador de comisión', icon: 'fas fa-comments-dollar'};
    let responsive = isResponsive();

    function closeModal(){
        setShow(false);
        setSueldo('');
        setModalidad(null);
        setFrecuencia('');
        setGarantia('');
        setActividad(null);
    }

    function openModal(){
        setShow(true);
        setGarantia('3');
        setModalidad(1);
        setActividad(1);
    }

    function copyLink(e){
        setTextoCopiar('Copiado');
        getData();
        setTimeout(function () {
            setTextoCopiar('Copiar');
        }, 1500);
    }

    function handleChange(e, campo){
        if (campo == 'sueldo'){
            setSueldo(e.formattedValue);
        }else{
            let valor = e.target.value;
            if (campo == 'modalidad'){
                setModalidad(valor);
            }else if (campo == 'actividad'){
                setActividad(valor);
            }else if (campo == 'frecuencia'){
                setFrecuencia(valor);
            }else if (campo == 'garantia'){
                setGarantia(valor);
            }
        }
    }

    useEffect(() => {
        getData();
    }, [sueldo, modalidad, frecuencia, garantia, actividad, country]);

    function getData(){
        setSpeech(getSpeechCotizador(actividad, modalidad, sueldo, frecuencia, garantia, country));
    }

    let showButton = false;

    if (([1,2].includes(parseInt(modalidad))) && (sueldo) && !(frecuencia) && (actividad)){
        showButton = true;
    }else if (([3].includes(parseInt(modalidad))) && (sueldo) && (frecuencia) && (actividad)){
        showButton = true
    }

    let divisa = 'S/.';
    if (country == 'cl'){
        divisa = 'CLP$';
    }else if (country == 'mx'){
        divisa = 'MXN$';
    }



    return(
        <>
            <a className={responsive == true ? 'w-100' : ''} role="button" onClick={(e) => openModal()}>
                <div className={('btn bertha-green-button font-weight-bold font btn-') + (responsive == true ? 'lg w-100' : 'sm text-white')} data-toggle="tooltip" data-placement="bottom" title={conf.title}>
                    <i className={conf.icon + ' icon-question'}></i> {responsive == true && <span className='ms-2'>{conf.title}</span>}
                </div>
            </a>
            <Modal size="md" scrollable={false} backdrop="static" keyboard={false} show={show} onHide={(e) => closeModal()} centered={true}>
                <ModalHeader className="border-0 pb-0" closeButton>
                    <ModalTitle>
                        <h6><i className={conf.icon + ' me-2'}></i>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-3">

                    <div className={'my-3'}>
                        <div className={'row mx-0 switch-cotizador'}>
                            <div className={'col-6 py-1' + (country == 'pe' ? ' selected' : '') } onClick={() => setCountry('pe')}>
                                <span className={'flag-icon flag-icon-pe flag-icon-squared flag-style'}></span>
                                <span className={'ms-2'}>Perú</span>
                            </div>
                            <div className={'col-6 py-1' + (country == 'mx' ? ' selected' : '') } onClick={() => setCountry('mx')}>
                                <span className={'flag-icon flag-icon-mx flag-icon-squared flag-style'}></span>
                                <span className={'ms-2'}>México</span>
                            </div>
                        </div>
                    </div>

                    <section className="row justify-content-center">

                        <div className="form-group col-12">
                            <div className="row">
                                <label className="col-12  col-form-label align-self-center">{'Sueldo ('+ divisa +')'}</label>
                                <div className="col-12">
                                    <NumericFormat
                                        type="text"
                                        value={sueldo}
                                        className={'form-control'}
                                        placeholder={'Ingrese el sueldo'}
                                        maxLength={8}
                                        allowNegative={false}
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        isNumericString={true}
                                        fixedDecimalScale={false}
                                        onValueChange={(e) => handleChange(e, 'sueldo')}
                                        disabled={false}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group col-12">
                            <div className="row">
                                <label className="col-12  col-form-label align-self-center">Actividad</label>
                                <div className="col-12">
                                    <select className="form-control" id="actividad" name="actividad" value={actividad} onChange={(e) => handleChange(e, 'actividad')}>
                                        <option key="0" value="" disabled>Seleccione</option>
                                        {['pe', 'mx'].includes(country) &&
                                            <>
                                                <option key="1" value="1">{'TODO SERVICIO'}</option>
                                                <option key="2" value="3">{'ENFERMERÍA'}</option>
                                                <option key="3" value="6">{'NANA'}</option>
                                                <option key="4" value="10">{'CUIDADO ADULTO MAYOR'}</option>
                                            </>
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={'form-group col-12 ' + (([3].includes(parseInt(modalidad))) ? '' : 'mb-25')}>
                            <div className="row">
                                <label className="col-12  col-form-label align-self-center">Modalidad</label>
                                <div className="col-12">
                                    <select className="form-control" id="modalidad" name="modalidad" value={modalidad} onChange={(e) => handleChange(e, 'modalidad')}>
                                        <option key="0" value="" disabled>Seleccione</option>
                                        {['pe'].includes(country) &&
                                            <>
                                                <option key="1" value="1">{'CAMA ADENTRO'}</option>
                                                <option key="2" value="2">{'CAMA AFUERA'}</option>
                                                <option key="3" value="3">{'POR DÍAS'}</option>
                                            </>
                                        }
                                        {['mx'].includes(country) &&
                                            <>
                                                <option key="1" value="1">{'DE ENTRADA'}</option>
                                                <option key="2" value="2">{'ENTRADA POR SALIDA'}</option>
                                                <option key="3" value="3">{'POR DÍAS'}</option>
                                            </>
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>

                        { ([3].includes(parseInt(modalidad))) &&
                            <div className="form-group col-12 mb-25">
                                <div className="row">
                                    <label className="col-12  col-form-label align-self-center">Frecuencia</label>
                                    <div className="col-12">
                                        <select className="form-control" id="frecuencia" name="frecuencia" value={frecuencia} onChange={(e) => handleChange(e, 'frecuencia')}>
                                            <option key="0" value="" disabled>Seleccione</option>
                                            <option key="1" value="1">1 VEZ A LA SEMANA</option>
                                            <option key="2" value="2">2 VECES A LA SEMANA</option>
                                            <option key="3" value="3">3 VECES A LA SEMANA</option>
                                            <option key="4" value="4">4 VECES A LA SEMANA</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        }

                        { (showButton==true) &&
                            <div className="form-group col-12 mb-2">
                                <NewCopyButton copyText={speech} successMsj={'Speech copiado'} btnText={textoCopiar} btnColor={'purple'} />
                            </div>
                        }

                    </section>
                </ModalBody>
            </Modal>
        </>
    )

}

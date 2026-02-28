import React, {useState} from 'react';
import {Modal, ModalBody, ModalTitle} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import moment from "moment";
import {currencySoles} from "../../../Helpers/strings.js";
import {ajaxGetDataModalDetallesContratos} from "../../../Functions/Contratos.jsx";
import {isResponsive} from "../../../Functions/General.jsx";
import CardContratoDetalles from "./cardContratoDetalles.jsx";

export default function ModalContratosDetalles({idCont}) {

    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    let responsive = isResponsive();
    let conf = {title: ('Ver detalles del contrato N°' + idCont), icon: 'fas fa-info-circle'};

    function openModal(e) {
        setShow(true);
        setIsLoading(true);
        ajaxGetDataModalDetallesContratos(idCont).then(r => {
            if (r.code === 200){
                setData(r.data);
                setIsLoading(false);
            }else{
                setIsLoading(false);
            }
        }).catch(function (error) {

            setIsLoading(false);
        })
    }

    function viewLoading(){
        return(
            <section className={'w-100 text-center'}>
                <i className="fas fa-sync fa-spin" style={{fontSize: "35px"}}></i>
            </section>
        )
    }

    return (
        <>
            <a className="button-information-modal" role="button" onClick={(e) => openModal(e)}>
                <i className={conf.icon + ' mr-2'}></i>
                {responsive && <span className='ml-2'>{conf.title}</span>}
            </a>

            <Modal size="md" show={show} onHide={(e) => setShow(false)} centered={true}>
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6><i className={conf.icon + ' mr-2'}></i>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20">
                    {(isLoading == true) && viewLoading()}

                    {(isLoading == false) &&
                        <section className="row justify-content-center section-information-modal">

                            <div className="col-12 pb-4">
                                <div className="text-center h6 mb-4">Datos Requerimiento</div>

                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                    <div className="col-6 label">NUMERO</div>
                                    <div className="col-6">{data.requerimiento_id}</div>
                                </div>

                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                    <div className="col-6 label">MODALIDAD</div>
                                    <div className="col-6">{data.modalidad}</div>
                                </div>

                                {data.frecuencia_servicio &&
                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                        <div className="col-6 label">FRECUENCIA</div>
                                        <div className="col-6">{data.frecuencia_servicio}</div>
                                    </div>
                                }

                                {data.valor_dia_frecuencia &&
                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                        <div className="col-6 label">PAGO POR DÍA</div>
                                        <div className="col-6">{data.valor_dia_frecuencia}</div>
                                    </div>
                                }

                                {data.dias_frecuencia &&
                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                        <div className="col-6 label">DIAS LABORABLES</div>
                                        <div className="col-6">{data.dias_frecuencia}</div>
                                    </div>
                                }

                                { (data.sueldo && data.modalidad_id == 3) &&
                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                        <div className="col-6 label">SUELDO BASE</div>
                                        <div className="col-6">{data.sueldo}</div>
                                    </div>
                                }
                            </div>

                            <div className="col-12 pb-4">
                                <div className="text-center h6 mb-4 mt-5">Datos Empleador</div>

                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                    <div className="col-6 label">Nº DOCUMENTO</div>
                                    <div className="col-6">{data.empleador_num_doc ? data.empleador_num_doc : ' - '}</div>
                                </div>

                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                    <div className="col-6 label">TELEFONO</div>
                                    <div className="col-6">{data.empleador_tel ? data.empleador_tel : ' - '}</div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                    <div className="col-6 label">CORREO</div>
                                    <div className="col-6">{data.empleador_mail ? data.empleador_mail : ' - '}</div>
                                </div>
                            </div>

                            <div className="col-12 pb-4">

                                <div className="text-center h6 mb-4">Datos Contrato</div>

                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                    <div className="col-6 label">N° CONTRATO</div>
                                    <div className="col-6">{data.id}</div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                    <div className="col-6 label">GARANTIA</div>
                                    <div className="col-6">{data.garantia} {data.garantia > 1 ? 'MESES' : 'MES'}</div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                    <div className="col-6 label">INICIO GARANTIA</div>
                                    <div className="col-6">{data.fecha_inicio_garantia ? moment(data.fecha_inicio_garantia, "YYYY-MM-DD").format('DD/MM/YYYY') : ' - '}</div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                    <div className="col-6 label">FIN GARANTIA</div>
                                    <div className="col-6">{data.fecha_fin_garantia ? moment(data.fecha_fin_garantia, "YYYY-MM-DD").format('DD/MM/YYYY') : ' - '}</div>
                                </div>

                                { (data.forma_pago_id == 2) &&
                                    <>
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                            <div className="col-6 label">ADELANTO</div>
                                            <div className="col-6">{data.adelanto ? currencySoles(data.adelanto) : currencySoles(0)}</div>
                                        </div>

                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                            <div className="col-6 label">DEBE</div>
                                            <div className="col-6">{data.debe ? currencySoles(data.debe) : currencySoles(0)}</div>
                                        </div>

                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                            <div className="col-6 label">MODO ADELANTO</div>
                                            <div className="col-6">{data.modo_pago_adelanto ? data.modo_pago_adelanto : ' - '}</div>
                                        </div>

                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                            <div className="col-6 label">MODO DEBE</div>
                                            <div className="col-6">{data.modo_pago_debe ? data.modo_pago_debe : ' - '}</div>
                                        </div>

                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                            <div className="col-6 label">FECHA ADELANTO</div>
                                            <div className="col-6">{data.fecha_pago_adelanto ? moment(data.fecha_pago_adelanto, "YYYY-MM-DD").format('DD/MM/YYYY')  : ' - '}</div>
                                        </div>

                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 row">
                                            <div className="col-6 label">FECHA DEBE</div>
                                            <div className="col-6">{data.fecha_pago_debe ? moment(data.fecha_pago_debe, "YYYY-MM-DD").format('DD/MM/YYYY')  : ' - '}</div>
                                        </div>
                                    </>
                                }
                            </div>

                            {data.historial &&
                                <div className="col-12">
                                    <div className="h6 text-center mb-4">Historial</div>
                                    {JSON.parse(data.historial).map((item, key) =>
                                        <CardContratoDetalles data={item} actual={data.id == item.id ? true : false}/>
                                    )}
                                </div>
                            }
                        </section>
                    }
                </ModalBody>
            </Modal>
        </>
    );
}

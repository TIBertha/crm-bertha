import React from "react";
import Swal from "sweetalert2";
import NewCopyIcon from "../../Components/newCopyIcon.jsx";
import InputAreaImage from "../../Components/inputAreaImage.jsx";
import {toTitleCase} from "../../../Helpers/strings.js";
import LabelNombre from "../../Components/labelNombre.jsx";
import urlIcon from "../../../../../../public/img/link.svg";
import Tooltips from "../../Components/tooltips.jsx"

export default function Adjuntos ({data, handleChange, handleSingularUpload, handleSingularDelete, changeVigenciaDocumento, actionDeleteAdjunto}){
    let nombreVideoPostulante = (data.nombres &&  data.apellidos) ? (toTitleCase(data.nombres) + ' ' + data.apellidos.charAt(0) + '.') : '';
    let youtubeIconProps = {neutro: '#ff0080', hover: '#bb005e', tooltipTitle: 'Copiar nombre para video', successMessage: 'Nombre para video copiado'};

    function youtubeIcon() {
        return <NewCopyIcon icon={'fab fa-youtube'} additonalClass={'icon-action align-self-center'} colorNeutro={youtubeIconProps.neutro} colorOnCopy={youtubeIconProps.hover} copyText={nombreVideoPostulante} tooltipText={youtubeIconProps.tooltipTitle} successMsj={youtubeIconProps.successMessage} textSize={'16px'}/>
    }

    return (

        <section className="mt-45">

            <LabelNombre nombres={data.nombres} apellidos={data.apellidos} children={youtubeIcon()} contactname={data.contactname} flagemoji={data.flagemoji}/>

            <div className="row mx-0 pb-4">

                <div className={'form-group col-12'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label label-adjunto align-self-center text-center">Retrato<Tooltips estilo={'tooltip-tc'} placement={'bottom'} text={'Foto con polo de color blanco, cabello sujetado, con fondo color blanco. Sin maquillaje, sin lentes, sin aretes.'} /></label>
                        <div className="col-12 col-md-9 agregar-adjunto align-self-center">
                            <InputAreaImage image={data.foto} campoName={'foto'} loadingImage={data.loadingfoto} nombreImg={'foto'} handleUpload={handleSingularUpload} handleDelete={handleSingularDelete} />
                        </div>
                    </div>
                </div>

                <div className={'form-group col-12'}><hr className={'my-2'}/></div>

                <div className={'form-group col-12'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label label-adjunto align-self-center text-center">Documento de identidad (Parte delantera)</label>
                        <div className="col-12 col-md-9 agregar-adjunto align-self-center">
                            <InputAreaImage image={data.fotodnidelantera} campoName={'fotodnidelantera'} nombreImg={'documento - parte delantera'} loadingImage={data.loadingfotodnidelantera} handleUpload={handleSingularUpload} handleDelete={handleSingularDelete} />
                        </div>
                    </div>
                </div>

                <div className={'form-group col-12'}><hr className={'my-2'}/></div>

                { (data.fotodnidelantera) &&
                    <div className={'form-group col-12'}>
                        <div className={'row mx-0 justify-content-center'}>
                            <div className={'form-group col-9 col-md-auto m-0 switch-ingreso-trabajador'}>
                                <div className={'row'}>
                                    <label className="col-6 col-md-auto col-form-label align-self-center text-white">¿Su documento de identidad está vigente?</label>
                                    <div className="col-6 col-md-auto align-self-center">
                                        <div className="switch-side-area">
                                            <div className="row mx-0">
                                                <div className={'col-auto option-action font-weight-bold' + (data.documentoVigente == '1' ? ' checked-green' : '')} onClick={(e) => changeVigenciaDocumento(e,'1')} >{'SI'}</div>
                                                <div className={'col-auto option-action font-weight-bold' + (data.documentoVigente == '0' ? ' checked-red' : '')} onClick={(e) => changeVigenciaDocumento(e,'0')}>{'NO'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <div className={'form-group col-12'}><hr className={'my-2'}/></div>

                <div className={'form-group col-12'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label label-adjunto align-self-center text-center">Link Video Presentación (Youtube){(data.nombres &&  data.apellidos) && <NewCopyIcon icon={'fab fa-youtube'} additonalClass={'ms-2 icon-action link-tc'} colorNeutro={youtubeIconProps.neutro} colorOnCopy={youtubeIconProps.hover} copyText={nombreVideoPostulante} tooltipText={youtubeIconProps.tooltipTitle} successMsj={youtubeIconProps.successMessage} />}</label>
                        <div className="col-10 col-md-5 align-self-center my-auto">
                            <input type="text" className="form-control" id="videointroduccionyoutube" name="videointroduccionyoutube" value={data.videointroduccionyoutube} onChange={(e) => handleChange(e, 'videoyoutube')} placeholder="Ingrese el link del video" />
                        </div>
                        { (data.videointroduccionyoutube) &&
                            <div className="col-2 align-self-center my-auto">
                                <a className="success-charged" href={data.videointroduccionyoutube} target={"_blank"}><img src={urlIcon} /></a><i className="fas fa-check-circle text-green ms-2"></i>
                            </div>
                        }
                    </div>
                </div>

            </div>

        </section>

    );

}

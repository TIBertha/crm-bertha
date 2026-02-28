import React from 'react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import es from 'react-phone-input-2/lang/es.json';

export default function EmpleadorDatos({data, handleChange , view, saveState, cleanModal}) {
    return (
        <section className={'row mx-0 pb-4 pt-35'}>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">País donde realizara el pedido</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control"  name="paispedido" value={data.paispedido} onChange={(e) => handleChange(e, 'paispedido')} >
                            <option key="0" value="">Seleccione</option>
                            <option key="2" value="54">PERÚ</option>
                            <option key="3" value="49">MÉXICO</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12'}>
                <hr/>
                <div className="alert alert-secondary mt-30 mb-35" role="alert">
                    Debe completar todos los campos del contrato y tener un domicilio para cambiar el estatus de Prospecto a Vigente.
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Nombres</label>
                    <div className="col-md-9 align-self-center">
                        <input type="text" className="form-control" id="nombres" name="nombres" value={data.nombres} onChange={handleChange} placeholder="Ingrese los nombres" disabled={Boolean(data.show)}/>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Apellidos</label>
                    <div className="col-md-9 align-self-center">
                        <input type="text" className="form-control" name="apellidos" value={data.apellidos} onChange={handleChange} placeholder="Ingrese los apellidos" disabled={Boolean(data.show)}/>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Teléfono</label>
                    <div className="col-md-9 align-self-center">
                        <PhoneInput
                            localization={es}
                            country={"pe"}
                            value={data.telefono.indexOf(' ') >= 0 ? data.telefono.split(" ").join("") : data.telefono}
                            onChange={e => handleChange(e, 'codigoTelefonico', 'telefono')}
                            preferredCountries={['pe', 'us', 'cl', 'co', 've']}
                            inputClass='w-100 input-countrycode'
                            enableLongNumbers={true}
                        />
                    </div>
                </div>
            </div>

            {view === 'new' && (
                <div className="form-group col-12 col-md-5">
                    {(data.searchingNumber || data.estatusNumber) && (
                        <p className="mt-2">
                            {data.searchingNumber && <i className="fas fa-sync fa-spin"></i>}
                            {data.estatusNumber && <span>{data.estatusNumber}</span>}
                        </p>
                    )}
                </div>
            )}

            <div className={'form-group col-12'}>
                <hr/>
                <h5 className="hk-sec-title mb-4 mt-4">Llenar para el contrato</h5>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Tipo Documento</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control" name="tipodocumento" value={data.tipodocumento}  onChange={(e) => handleChange(e, 'tipodocumento')} disabled={Boolean(data.show)}>
                            <option key="0" value="">Seleccione</option>
                            {data.tiposdocumentos.map((td, index) => {
                                return <option key={index} value={td.id}>{(td.nombre)}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Numero Documento</label>
                    <div className="col-md-9 align-self-center">
                        <input type="text" className="form-control" name="documento" value={data.documento} onChange={e => handleChange(e, 'numeroDocumento', 'documento')} placeholder="Ingrese el numero de documento" disabled={Boolean(data.show)}/>
                    </div>
                </div>
            </div>

            {data.emptyDocumentoID && (
                <div className="form-group col-12 col-md-5">
                    {(data.searchingDocumentoID || data.estatusDocumentoID) && (
                        <p className="mt-2">
                            {data.searchingDocumentoID && <i className="fas fa-sync fa-spin"></i>}
                            {data.estatusDocumentoID && <span>{data.estatusDocumentoID}</span>}
                        </p>
                    )}
                </div>
            )}

            <div className={'form-group col-12'}>
                <h5 className="hk-sec-title mb-4 mt-4">Si el empleador reside fuera de <b>PERÚ</b>, llenar hasta aquí</h5>
                <hr/>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">RUC</label>
                    <div className="col-md-9 align-self-center">
                        <input type="text" className="form-control" name="rucempresa" value={data.rucempresa} onChange={handleChange} placeholder="Ingrese el número de ruc"/>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Observación (Opcional)</label>
                    <div className="col-md-9 align-self-center">
                        <textarea className="form-control" name="observaciones" value={data.observaciones} onChange={(e) => handleChange(e)} placeholder="Ingrese una observación" disabled={Boolean(data.show)}/>
                    </div>
                </div>
            </div>

        </section>
    );
}

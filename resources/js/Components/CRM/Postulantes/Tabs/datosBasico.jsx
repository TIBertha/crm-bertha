import React from "react";
import PhoneInput from "react-phone-input-2";
import CheckBoxModalidad from "../Components/checkBoxModalidad.jsx";
import Select from "react-select";
import es from 'react-phone-input-2/lang/es.json'

export default function DatosBasico({data, handleChange}){
    const phoneMap = {
        54: 'pe',
        11: 'cl',
        49: 'mx'
    };

    const countryPhone = phoneMap[data.paisprocedencia];

    return(
        <div className="row mt-45">
            <div className="col-sm">

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">País donde postula</label>
                    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                        <select className="form-control"  name="paispostulando" value={data.paispostulando} onChange={(e) => handleChange(e, 'paispostulando')} >
                            <option key="0" value="">Seleccione</option>
                            <option key="1" value="54">PERÚ</option>
                            <option key="2" value="49">MÉXICO</option>
                        </select>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Nombres</label>
                    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                        <input type="text" className="form-control" id="nombres" name="nombres" value={data.nombres} onChange={handleChange} placeholder="Ingrese los nombres" disabled={Boolean(data.show)} />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Apellidos</label>
                    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                        <input type="text" className="form-control" id="apellidos" name="apellidos" value={data.apellidos} onChange={handleChange} placeholder="Ingrese los apellidos" disabled={Boolean(data.show)} />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">País de Nacimiento</label>
                    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                        <select className="form-control"  name="paisprocedencia" value={data.paisprocedencia} onChange={(e) => handleChange(e, 'pais')} disabled={Boolean(data.show)} >
                            <option key="0" value="">Seleccione</option>
                            {data.paises.map((p, index) => {
                                return <option key={index} value={p.id} >{ (p.nombre) }</option>
                            })}
                        </select>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Teléfono</label>
                    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                        <PhoneInput
                            placeholder="Ingrese el teléfono"
                            localization={es}
                            country={countryPhone}
                            value={data.telefono.indexOf(' ') >= 0 ? data.telefono.split(" ").join("") : data.telefono}
                            onChange={e => handleChange(e, 'codigoTelefonico', 'telefono')}
                            preferredCountries={['pe', 'us', 'cl', 'co', 've']}
                            inputClass='w-100 input-countrycode'
                            enableLongNumbers={true}
                        />
                    </div>

                    {(data.searchingNumber || data.estatusNumber) && (
                        <div className="col-auto align-self-center">
                            <p className="mt-2">
                                {data.searchingNumber && <i className="fas fa-sync fa-spin"></i>}
                                {data.estatusNumber && <span>{data.estatusNumber}</span>}
                            </p>
                        </div>
                    )}

                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">WhatsApp</label>
                    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                        <PhoneInput
                            placeholder="Ingrese WhatsApp"
                            localization={es}
                            country={countryPhone}
                            value={data.telefonowhatsapp.indexOf(' ') >= 0 ? data.telefonowhatsapp.split(" ").join("") : data.telefonowhatsapp}
                            onChange={e => handleChange(e, 'codigoTelefonico', 'telefonowhatsapp')}
                            preferredCountries={['pe', 'us', 'cl', 'co', 've']}
                            inputClass='w-100 input-countrycode'
                            disabled={Boolean(data.show)}
                            enableLongNumbers={true}
                        />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Actividad</label>
                    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                        <Select
                            value={data.actividad}
                            isDisabled={Boolean(data.show)}
                            isMulti
                            isSearchable
                            onChange={(e) => handleChange(e, 'evento', 'actividad')}
                            options={data.actividades}
                            placeholder={'Seleccione'}
                            theme={theme => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                    ...theme.colors,
                                    primary: 'black',
                                },
                            })}
                        />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Modalidad</label>
                    <div className="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                        <ul className="tipos-modalidades">
                            {data.modalidad.map((m) => {
                                return (<CheckBoxModalidad handleChange={handleChange} pais={data.paispostulando} m={m} />)
                            })}
                        </ul>
                    </div>
                </div>

            </div>

            <hr/>

        </div>
    )

}

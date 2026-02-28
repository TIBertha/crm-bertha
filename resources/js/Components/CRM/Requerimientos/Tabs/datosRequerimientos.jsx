import React from "react";
import PhoneInput from "react-phone-input-2";
import AsyncSelect from "react-select/async";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";
import esp from 'react-phone-input-2/lang/es.json';
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";

import NewCopyButton from "../../Components/newCopyButton.jsx";
import InputFloat from "../../Components/inputFloat.jsx";
import AgregarNuevoEmpleador from "../Modals/agregarNuevoEmpleador.jsx";
import AgregarNuevoDomicilio from "../Modals/agregarNuevoDomicilio.jsx";
import Edades from "../Components/Edades/edades.jsx";
import RangoBusqueda from "../Components/Edades/rangoBusqueda.jsx";
import Horarios from "../Components/Horarios/horarios.jsx";
import VerEntrevistasRegistradas from "../Modals/verEntrevistasRegistradas.jsx";

export default function DatosRequerimientos({url, view, data, show, handleChange, addSeguimiento, removeSeguimiento, loadEmpleadoresOptions, openModalEmpleador, closeModalEmpleador, setNewEmpleador, saveNuevoEmpleador, openModalDomicilio, closeModalDomicilio, setNewDomicilio, saveNuevoDomicilio, loadDistritoOptions, handleDelete, handleAddition, handleDrag, handleChangeHorarios}){
    let inputsueldo = '';
    let observacionesWeb = data.observacionesWeb;
    let frecuencia = parseInt(data.frecuencia);
    let actividad = parseInt(data.actividad);
    let modalidad = parseInt(data.modalidad);

    let restanteFrecuencia = 0;

// Tablas de valores mínimos por país
    const sueldoMinimoMap = {
        54: { valor: 930,    string: '930' },
        11: { valor: 500000, string: '500,000' },
        49: { valor: 4200,   string: '4,200' },
    };

    const sueldoMinimoPDMap = {
        54: { valor: 70,    string: '70' },
        11: { valor: 30000, string: '30,000' },
        49: { valor: 360,   string: '360' },
    };

    let sueldoMinimo = { valor: 0, string: '0' };
    let sueldoMinimoPD = { valor: 0, string: '0' };

    if ([1, 2, 5].includes(modalidad)) {
        sueldoMinimo = sueldoMinimoMap[data.paispedido] || sueldoMinimo;

        if (data.sueldo && data.sueldo < sueldoMinimo.valor) {
            inputsueldo = 'sueldoMenorInput';
        }

    } else if (modalidad === 3) {
        sueldoMinimoPD = sueldoMinimoPDMap[data.paispedido] || sueldoMinimoPD;

        if (data.valordiafrecuencia && data.valordiafrecuencia < sueldoMinimoPD.valor) {
            inputsueldo = 'sueldoMenorInput';
        }
    }

    const restanteFrecuenciaMap = {
        54: frecuencia !== 1 ? 20 : 0,
        11: frecuencia !== 1 ? 7500 : 0,
        49: 100,
    };

    restanteFrecuencia = restanteFrecuenciaMap[data.paispedido] || 0;

    let sueldo1ermespordia = data.valordiafrecuencia - restanteFrecuencia;

    return(
        <section className={'row mx-0 pb-4 pt-35'}>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">País</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control"  name="paispedido" value={data.paispedido} onChange={(e) => handleChange(e, 'paispedido')} >
                            <option key="0" value="">Seleccione</option>
                            <option key="2" value={54}>PERÚ</option>
                            <option key="3" value={49}>MÉXICO</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Empleador</label>
                    <div className="col-md-9 align-self-center">
                        <section className="row mx-0">

                            <div className={'col ps-0 pe-1'}>
                                <AsyncSelect
                                    loadOptions={loadEmpleadoresOptions}
                                    noOptionsMessage={() => null}
                                    defaultOptions={false}
                                    onChange={(e) => handleChange(e, 'empleador', 'empleador')}
                                    value={data.empleador}
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

                            {view == 'new' &&
                                <div className='col-auto px-0'>
                                    <AgregarNuevoEmpleador
                                        view={data.viewModalEmpleador}
                                        show={data.openModalEmpleador}
                                        openModal={openModalEmpleador}
                                        closeModal={closeModalEmpleador}
                                        setNewEmpleador={setNewEmpleador}
                                        save={saveNuevoEmpleador}
                                        loadingModalEmpleador={data.loadingModalEmpleador}
                                        typeMsj={data.typeMsjCreateEmpleador}
                                        msj={data.msjCreateEmpleador}
                                    />
                                </div>
                            }

                            {data.empleador &&
                                <div className='col-auto pe-0 ps-1'>
                                    <NewCopyButton icon={'fas fa-link'} btnColor={'purple'} copyText={'CL ' + data.empleador.label} tooltipText={'Copiar nombre empleador'} successMsj={'Nombre empleador copiado'} />
                                </div>
                            }

                        </section>
                    </div>
                </div>
            </div>

            {(data.empleador) &&
                <div className={'form-group col-12 col-md-7'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label align-self-center">Teléfono</label>
                        <div className="col-md-9 align-self-center">
                            <section className="row mx-0">

                                <div className={data.empleador ? 'col ps-0 pe-1' : 'col-12 px-0'}>
                                    <PhoneInput
                                        placeholder="Ingrese el teléfono"
                                        localization={esp}
                                        country={"pe"}
                                        value={data.telefono.indexOf(' ') >= 0 ? data.telefono.split(" ").join("") : data.telefono}
                                        onChange={e => handleChange(e, 'codigoTelefonico', 'telefono')}
                                        preferredCountries={['pe', 'us', 'cl', 'co', 've']}
                                        inputClass='w-100 input-countrycode'
                                        enableLongNumbers={true}
                                    />
                                </div>

                                {data.empleador &&
                                    <div className='col-auto pe-0 ps-1'>
                                        <NewCopyButton icon={'fas fa-link'} btnColor={'purple'} copyText={data.telefono} tooltipText={'Copiar teléfono empleador'} successMsj={'Teléfono empleador copiado'} />
                                    </div>
                                }

                            </section>
                        </div>
                    </div>
                </div>
            }

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Tipo Contrato</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control" name="tipocontrato" value={data.tipocontrato} onChange={handleChange} disabled={true}>
                            <option key="0" value="">Seleccione</option>
                            {data.tiposcontratos.map((p, index) => {
                                return <option key={index} value={p.id} >{ (p.nombre) }</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Actividad</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control" id="actividad" name="actividad" value={data.actividad} onChange={(e) => handleChange(e, 'actividad')} >
                            <option key="0" value="">Seleccione</option>
                            {data.actividades.map((p, index) => {

                                let nombreAct = p.nombre;

                                if ([11].includes(data.paispedido)){
                                    nombreAct = p.nombre_ch;
                                }else if ([49].includes(data.paispedido)){
                                    nombreAct = p.nombre_mx
                                }
                                return(
                                    <option key={index} value={p.id} >{nombreAct}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Modalidad</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control" id="modalidad" name="modalidad" value={data.modalidad} onChange={(e) => handleChange(e, 'modalidad')} >
                            {data.modalidades.map((p, index) => {
                                let nombreMod = p.nombre;

                                if ([11].includes(data.paispedido)){
                                    nombreMod = p.nombre_ch;
                                }else if ([49].includes(data.paispedido)){
                                    nombreMod = p.nombre_mx
                                }
                                return(
                                    <option key={index} value={p.id} >{nombreMod}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Nacionalidad</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control" id="nacionalidad" name="nacionalidad" value={data.nacionalidad} onChange={handleChange} >
                            {/*<option key="0" value="" disabled selected hidden>Seleccione</option>*/}
                            <option key="0" value="" >Seleccione</option>
                            {data.nacionalidades.map((p, index) => {
                                let nombreNac = p.nombre;

                                if ([11].includes(data.paispedido)){
                                    nombreNac = p.nombre_ch;
                                }else if ([49].includes(data.paispedido)){
                                    nombreNac = p.nombre_mx
                                }
                                return(
                                    <option key={index} value={p.id}>{nombreNac}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <RangoBusqueda data={data} label={'Edades'} handleChange={handleChange}/>

            {([3].includes(modalidad)) &&
                <>
                    <div className={'form-group col-12 col-md-7'}>
                        <div className={'row'}>
                            <label className="col-12 col-md-3 col-form-label align-self-center">Frecuencia</label>
                            <div className="col-md-9 align-self-center">
                                <select className="form-control" id="frecuencia" name="frecuencia" value={data.frecuencia} onChange={(e) => handleChange(e, 'frecuencia')} >
                                    <option key="0" value={0}>Seleccione</option>
                                    {data.frecuencias.map((p, index) => {
                                        return <option key={index} value={parseInt(p.id)} >{ (p.nombre) }</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    { (frecuencia >= 1) &&
                        <>
                            <div className={'form-group col-12 col-md-7'}>
                                <div className={'row'}>
                                    <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Sueldo por día (' + data.divisa.valor + ')'}</label>
                                    <div className="col-md-9 align-self-center">
                                        <InputFloat
                                            additionalClass={(data.isValorDiaFrecuenciaValido ? '' : 'is-invalid')}
                                            value={data.valordiafrecuencia}
                                            onchange={handleChange}
                                            placeholder="Sueldo por día"
                                            name="valordiafrecuencia"
                                            tipo="calculo"
                                            disable={false} />

                                        { ([3].includes(modalidad)) &&
                                            <>
                                                {(data.valordiafrecuencia && data.valordiafrecuencia < sueldoMinimoPD.valor) &&
                                                    <div className="sueldo-menor">
                                                        {'El costo mínimo del día es ' + data.divisa.valor + ' ' + sueldoMinimoPD.string}
                                                    </div>
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>

                            {(data.valordiafrecuencia && data.valordiafrecuencia >= sueldoMinimoPD.valor) &&
                                <>
                                    <div className={'form-group col-12 col-md-7'}>
                                        <div className={'row'}>
                                            <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Sueldo por día primer mes (' + data.divisa.valor + ')'}</label>
                                            <div className="col-md-9 align-self-center">
                                                <InputFloat
                                                    value={sueldo1ermespordia}
                                                    placeholder="Sueldo por día primer mes"
                                                    name="sueldo1ermespordia"
                                                    tipo="float"
                                                    disable={true}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={'form-group col-12 col-md-7'}>
                                        <div className={'row'}>
                                            <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Sueldo primer mes (' + data.divisa.valor + ')'}</label>
                                            <div className="col-md-9 align-self-center">
                                                <InputFloat
                                                    additionalClass={inputsueldo}
                                                    value={sueldo1ermespordia * frecuencia * 4}
                                                    placeholder="Ingrese el sueldo"
                                                    name="sueldo1ermes"
                                                    tipo="float"
                                                    disable={true}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={'form-group col-12 col-md-7'}>
                                        <div className={'row'}>
                                            <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Sueldo segundo mes (' + data.divisa.valor + ')'}</label>
                                            <div className="col-md-9 align-self-center">
                                                <InputFloat
                                                    additionalClass={inputsueldo}
                                                    value={data.sueldomensual}
                                                    placeholder="Sueldo segundo mes"
                                                    name="sueldo2domes"
                                                    tipo="float"
                                                    disable={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    }
                </>
            }

            {(modalidad != 3) &&
                <>
                    <div className={'form-group col-12 col-md-7'}>
                        <div className={'row'}>
                            <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Sueldo (' + data.divisa.valor + ')'}</label>
                            <div className="col-md-9 align-self-center">
                                <InputFloat
                                    additionalClass={inputsueldo}
                                    value={data.sueldo}
                                    onchange={handleChange}
                                    placeholder="Ingrese el sueldo"
                                    name="sueldo"
                                    tipo="calculo"
                                    disable={false}
                                />

                                { ([1,2,5].includes(modalidad)) &&
                                    <>
                                        {(data.sueldo && data.sueldo < sueldoMinimo.valor) &&
                                            <div className="sueldo-menor">
                                                {'El sueldo mínimo es ' + data.divisa.valor + ' ' + sueldoMinimo.string}
                                            </div>
                                        }
                                    </>
                                }

                            </div>
                        </div>
                    </div>

                    { (data.sueldo >= 930) &&
                        <div className={'form-group col-12 col-md-7'}>
                            <div className={'row'}>
                                <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Sueldo 1er mes (' + data.divisa.valor + ')'}</label>
                                <div className="col-md-9 align-self-center">
                                    <InputFloat
                                        value={data.sueldoPrimerMes}
                                        placeholder="Ingrese el sueldo"
                                        name="sueldoPrimerMes"
                                        tipo="float"
                                        disable={true}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                </>
            }

            {((view == 'edit') && (data.inputDomicilio)) ?
                <div className={'form-group col-12 col-md-7'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label align-self-center">Domicilio(web)</label>
                        <div className="col-md-9 align-self-center">
                            <div className={'row mx-0'}>
                                <div className={'col ps-0 pe-1'}>
                                    <input type="text" className="form-control" id="inputDomicilio" name="inputDomicilio" value={data.inputDomicilio} onChange={handleChange} placeholder="Domicilio" disabled={true} />
                                </div>
                                <div className='col-auto pe-0 ps-1'>
                                    <NewCopyButton
                                        icon={'fas fa-link'}
                                        additionalClass={'alignButtonReq icon-question'}
                                        copyText={data.inputDomicilio}
                                        successMsj={'Link copiado exitosamente'}
                                        btnColor={'purple'}
                                        tooltipText={'Copiar domicilio'}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                : ''}

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Domicilio</label>
                    <div className="col-md-9 align-self-center">
                        <section className="row mx-0">
                            <div className={data.empleador ? 'col ps-0 pe-1' : 'col-12 px-0'}>
                                <select className="form-control" name="domicilio" value={data.domicilio} onChange={(e) => handleChange(e, 'domicilio')} >
                                    <option key="0" value="">Seleccione</option>
                                    {data.domicilios.map((p, index) => {
                                        return <option key={index} value={p.id}>{(p.direccion)}</option>
                                    })}
                                </select>
                            </div>
                            { (data.empleador) &&
                                <div className='col-auto px-0'>
                                    <AgregarNuevoDomicilio
                                        view={data.viewModalDomicilio}
                                        show={data.openModalDomicilio}
                                        paisPedido={data.paispedido}
                                        openModal={openModalDomicilio}
                                        closeModal={closeModalDomicilio}
                                        setNewDomicilio={setNewDomicilio}
                                        save={saveNuevoDomicilio}
                                        loadingModalDomicilio={data.loadingModalDomicilio}
                                        typeMsj={data.typeMsjCreateDomicilio}
                                        msj={data.msjCreateDomicilio}
                                    />
                                </div>
                            }
                            { (data.domicilio && data.linkDomicilio) &&
                                <div className='col-auto pe-0 ps-1'>
                                    <a className={'btn bertha-purple-button font-weight-bold font h-100 w-100  btn-sm text-white finger-action'} href={'https://'+data.linkDomicilio} target={'_blank'}>
                                        <i className={'fas fa-link alignButtonReq icon-question'}></i>
                                    </a>
                                </div>
                            }
                        </section>
                    </div>
                </div>
            </div>

            {data.referenciaDomicilio &&
                <div className={'form-group col-12 col-md-7'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label align-self-center">Referencia</label>
                        <div className="col-md-9 align-self-center">
                            <section className="row mx-0">
                                <div className={'col ps-0 pe-1'}>
                                    <textarea style={{ height: "70px"}} className="form-control-textarea" id={'referenciaDomicilio'} name="referenciaDomicilio" rows="2" value={data.referenciaDomicilio} onChange={handleChange} placeholder="Ingrese referencia" disabled={true}/>
                                </div>
                                <div className='col-auto pe-0 ps-1 align-self-center'>
                                    <NewCopyButton icon={'fas fa-link'} btnColor={'purple'} copyText={data.referenciaDomicilio} tooltipText={'Copiar referencia'} successMsj={'Referencia copiada'} />
                                </div>

                            </section>
                        </div>
                    </div>
                </div>
            }

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Distrito</label>
                    <div className="col-md-9 align-self-center">
                        <AsyncSelect
                            loadOptions={loadDistritoOptions}
                            isClearable
                            noOptionsMessage={() => null}
                            defaultOptions={false}
                            onChange={(e) => handleChange(e, 'time', 'distrito')}
                            value={data.distrito}
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
            </div>

            { ([1, 4, 5, 9].includes(actividad)) &&
                <div className={'form-group col-12 col-md-7'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label align-self-center">Tipo de vivienda</label>
                        <div className="col-md-9 align-self-center">
                            <select className="form-control" id="tipovivienda" name="tipovivienda" value={data.tipovivienda} onChange={(e) => handleChange(e, 'tipovivienda')} >
                                <option key="0" value="">Seleccione</option>
                                {data.tipoviviendas.map((p, index) => {
                                    return <option key={index} value={p.id} >{ (p.nombre) }</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            }

            { ([1, 4, 5, 9, 13, 14].includes(actividad)) &&
                <div className={'form-group col-12 col-md-7'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label align-self-center">N° Pisos</label>
                        <div className="col-md-9 align-self-center">
                            <select className="form-control"  name="numpisos" value={data.numpisos} onChange={handleChange} >
                                <option key="0" value="">Seleccione</option>

                                {([2].includes(data.tipovivienda)) ?
                                    <>
                                        <option key="1" value="1">Flat (1 piso)</option>
                                        <option key="2" value="2">Dúplex (2 pisos)</option>
                                        <option key="3" value="3">Triplex (3 pisos)</option>
                                    </>
                                    :
                                    <>
                                        {data.cantidadesPisos.map((number, index) => {
                                            return <option key={index} value={number} >{ (number) }</option>
                                        })}
                                    </>
                                }
                            </select>
                        </div>
                    </div>
                </div>
            }

            { ([1, 2, 3, 5, 8, 9, 10, 13, 14].includes(actividad)) &&
                <>
                    <div className={'form-group col-12 col-md-7'}>
                        <div className={'row'}>
                            <label className="col-12 col-md-3 col-form-label align-self-center">N° Adultos</label>
                            <div className="col-md-9 align-self-center">
                                <select className="form-control"  name="numadultos" value={data.numadultos} onChange={handleChange} disabled={show == true ? true : false} >
                                    <option key="0" value="">Seleccione</option>
                                    {data.cantidades.map((number, index) => {
                                        return <option key={index} value={number} >{ (number) }</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    { ([3,4,6,7,10,13,14].includes(actividad)) &&
                        <Edades campo={data.edadadulto} name={'edadadulto'} labelEdad={'Edad Adulto'} onDelete={handleDelete} onAddition={handleAddition} onDrag={handleDrag} />
                    }

                    <div className={'form-group col-12 col-md-7'}>
                        <div className={'estructuraDireccion'}>
                            <div>Si tiene menos de 14 años considéralo como niño, sino como adulto</div>
                        </div>
                    </div>
                </>
            }

            { ([3,10].includes(actividad)) &&
                <div className={'form-group col-12 col-md-7'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label align-self-center">Diagnóstico</label>
                        <div className="col-md-9 align-self-center">
                            <textarea className="form-control" name="diagnostico" value={data.diagnostico} onChange={(e) => handleChange(e, 'diagnostico')} placeholder="Ingrese diagnostico" />
                        </div>
                    </div>
                </div>
            }

            { ([1,2,4,5,6,9,13,14].includes(actividad)) &&
                <Edades url={url} campo={data.edadninos} name={'edadninos'} labelEdad={'Edad Niños'} onDelete={handleDelete} onAddition={handleAddition} onDrag={handleDrag} />
            }

            { ([4,7,8,13,14].includes(actividad)) &&
                <Edades url={url} campo={data.edadbebes} name={'edadbebes'} labelEdad={'Edad Bebes'} onDelete={handleDelete} onAddition={handleAddition} onDrag={handleDrag} />
            }

            { ([1,5,9,13,14].includes(actividad)) &&
                <div className={'form-group col-12 col-md-7'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label align-self-center">N° Mascotas</label>
                        <div className="col-md-9 align-self-center">
                            <select className="form-control"  name="nummascotas" value={data.nummascotas} onChange={handleChange} disabled={show == true ? true : false}>
                                <option key="0" value="">Seleccione</option>
                                {data.cantidades.map((number, index) => {
                                    return <option key={index} value={number} >{ (number) }</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            }

            { (parseInt(data.cuarentena) != 7) &&
                <Horarios data={data} onChangeHorario={handleChangeHorarios} onChange={handleChange} view={view} />
            }

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Tipo Beneficio</label>
                    <div className="col-md-9 align-self-center">
                        <select
                            className="form-control"
                            name="tipoBeneficio"
                            value={data.tipoBeneficio}
                            onChange={handleChange}
                            disabled={([5].includes(modalidad)) ? true : false}
                        >
                            <option key="0" value="">Seleccione</option>
                            {data.tiposBeneficios.map((p, index) => {
                                return <option key={index} value={p.id} >{ (p.nombre) }</option>
                            })}
                            <option value={4} >SIN BENEFICIOS</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha Entrevista</label>
                    <div className="col-md-9 align-self-center">
                        <div className="row mx-0">
                            <div className={'col ' + ((data.fechaentrevista) ? 'ps-0 pe-1' : 'px-0')}>
                                <DatePicker
                                    selected={data.fechaentrevista ? new Date(data.fechaentrevista) : null}
                                    onChange={(e) => handleChange(e, 'time', 'fechaentrevista')}
                                    showMonthDropdown
                                    showYearDropdown
                                    dateFormat="dd/MM/yyyy"
                                    scrollableYearDropdown
                                    locale={es}
                                    minDate={new Date()}
                                    dropdownMode="select"
                                    className="form-control"
                                    name="fechaentrevista"
                                    placeholderText="dd/mm/aaaa"
                                    autoComplete="off"
                                />
                            </div>
                            {(data.fechaentrevista) &&
                                <div className='col-auto px-0'>
                                    <VerEntrevistasRegistradas fecha={data.fechaentrevista} idSelected={view == 'new' ? null : data.id} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Hora Entrevista</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.horaentrevista ? new Date(data.horaentrevista) : null}
                            onChange={(e) => handleChange(e, 'time', 'horaentrevista')}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            className="form-control"
                            name="horaentrevista"
                            placeholderText="hh:mm am/pm"
                            dateFormat="h:mm aa"
                            timeCaption="Hora"
                            minTime={setHours(setMinutes(new Date(), 0), 7)}
                            maxTime={setHours(setMinutes(new Date(), 29), 20)}
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha Inicio Labores</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.fechainiciolabores ? new Date(data.fechainiciolabores) : null}
                            onChange={(e) => handleChange(e, 'time', 'fechainiciolabores')}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            scrollableYearDropdown
                            locale={es}
                            dropdownMode="select"
                            className="form-control"
                            name="fechainiciolabores"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">
                        <p className={'mb-0'}>Observaciones</p>
                        <p className={'green-little-word-obs'}><span>(Esta información </span><strong className={'mx-1'}>NO</strong><span>saldrá en la web)</span></p>
                    </label>
                    <div className="col-md-9 align-self-center">
                        <textarea style={{ height: "168px"}} className="form-control-textarea" name="observaciones" rows="6" value={data.observaciones} onChange={(e) => handleChange(e, 'observaciones')} placeholder="Observaciones" disabled={show == true ? true : false} />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">
                        <p className={'mb-0'}>Observaciones</p>
                        <p className={'red-little-word-obs'}><span>(Esta información </span><strong className={'mx-1'}>SI</strong><span>saldrá en la web)</span></p>
                    </label>
                    <div className="col-md-9 align-self-center">
                        <textarea style={{ height: "168px"}} className="form-control-textarea red-border-obs" name="observacionesWeb" rows="6" value={observacionesWeb} onChange={(e) => handleChange(e, 'observacionesWeb')} placeholder="Observaciones" maxLength="200" />
                        <p className={'text-end'}>
                            Carácteres:
                            <span className={'font-weight-bold'}>{observacionesWeb.length}</span>
                            /200
                        </p>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 my-1'}>
                <hr className={'mt-3 mb-4'}/>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Tipo Comisión</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control"  name="tipoComision" value={data.tipoComision} onChange={(e) => handleChange(e, 'tipoComision')} disabled={(parseInt(data.tipocontrato) == 1) ? false : false}>
                            <option key="0" value="">Seleccione</option>
                            <option key="1" value="1">Comisión 1 C/Entrevista</option>
                            <option key="2" value="2">Comisión 2 C/Entrevista</option>
                            <option key="3" value="3">Comisión 3 S/Entrevista</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">{'Monto comisión (' + data.divisa.valor + ')'}</label>
                    <div className="col-md-9 align-self-center">
                        <InputFloat
                            value={data.montoComision}
                            placeholder="Ingrese el monto comision"
                            name="montoComision"
                            tipo="float"
                            disable={true}
                        />

                    </div>
                </div>
            </div>

            <div className={'form-group col-12 my-1'}>
                <hr className={'mt-3 mb-4'}/>
            </div>

            <div className={'form-group col-12'}><h5 className="hk-sec-title my-4">Adelanto</h5></div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center" >Monto Adelanto</label>
                    <div className="col-md-9 align-self-center">
                        <InputFloat
                            value={data.montoAdelanto}
                            placeholder="Ingrese el monto adelanto"
                            onchange={handleChange}
                            name="montoAdelanto"
                            tipo="calculo"
                            disable={false}
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha Pago Adelanto</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.fechaPagoAdelanto}
                            onChange={(e) => handleChange(e, 'time', 'fechaPagoAdelanto')}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            scrollableYearDropdown
                            locale={es}
                            dropdownMode="select"
                            className="form-control"
                            name="fechaPagoAdelanto"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 my-1'}>
                <hr className={'mt-3 mb-4'}/>
            </div>

            <div className={'form-group col-12'}><h5 className="hk-sec-title my-4">Seguimiento</h5></div>

            <div className={'form-group col-12'}>
                <section className="row mx-0 pb-4 pt-35">

                    {data.seguimientos.map((seg, idx) => (
                        <div className={'form-group col-12 col-md-7'}>
                            <div key={idx} className="row">
                                <div className="col-md-3 form-group">
                                    <label htmlFor="firstName">Fecha</label>
                                    <input className="form-control" name="fecha" placeholder="" value={seg.fecha} onChange={(e) => this.handleChange(e, 'seguimiento', idx)} type="text" disabled={true}/>
                                </div>

                                <div className="col-md-8 form-group">
                                    <label htmlFor="lastName">Detalle</label>
                                    <input className="form-control" name="detalle" value={seg.detalle} onChange={(e) => handleChange(e, 'seguimiento', idx)} placeholder="Ingrese detalle" type="text"/>
                                </div>

                                <div className="col-md-1 form-group d-flex align-items-end">
                        <span onClick={(e) => removeSeguimiento(idx)}>
                            <i className="fas fa-times icon-remove-adjunto"></i>
                        </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className={'form-group col-12 col-md-7'}>
                        <div className={'my-3 text-center'}>
                            <div className="add-item" onClick={addSeguimiento} >
                                <i className="fas fa-plus"></i> Adicionar nuevo
                            </div>
                        </div>
                    </div>

                </section>
            </div>

        </section>
    )

}

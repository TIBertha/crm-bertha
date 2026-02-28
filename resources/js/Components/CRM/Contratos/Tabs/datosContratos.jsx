import React from 'react';
import es from "date-fns/locale/es";
import DatePicker from "react-datepicker";
import Select from "react-select";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import InputFloat from "../../Components/inputFloat.jsx";
import VerDetallesRequerimiento from "../Modals/verDetallesRequerimiento.jsx";

export default function DatosContratos({view, data,handleChange}) {

    let enableInput = data.contrato ? true : false;

    return(
        <section className="row mx-0 pb-4 pt-35">

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha contrato</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.creado}
                            onChange={(e) => handleChange(e, 'time', 'creado')}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            scrollableYearDropdown
                            locale={es}
                            dropdownMode="select"
                            className="form-control"
                            name="creado"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Empleador</label>
                    <div className="col-md-9 align-self-center">
                        <Select
                            value={data.empleador}
                            isMulti={false}
                            isDisabled={enableInput}
                            isSearchable
                            onChange={(e) => handleChange(e, 'empleador', 'empleador')}
                            options={data.empleadores}
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

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Requerimientos</label>
                    <div className="col-md-9 align-self-center">
                        <div className="row mx-0">

                            <div className={(data.requerimiento && data.requerimientoDetalles) ? 'col-11 ps-0 pe-1' : 'col-12 px-0'}>
                                <select className="form-control" name="requerimiento" value={data.requerimiento} onChange={(e) => handleChange(e, 'requerimiento')} disabled={enableInput}>
                                    <option key="0" value="">Seleccione</option>
                                    {data.requerimientos.map((req, index) => {
                                        return <option key={index} value={req.id}>{(req.nombre)}</option>
                                    })}
                                </select>
                            </div>

                            {(data.requerimiento && data.requerimientoDetalles) &&
                                <div className="col-1 px-0 align-modal-button">
                                    <VerDetallesRequerimiento data={data.requerimientoDetalles}/>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Actividad</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control" name="actividad" value={data.actividad} onChange={(e) => handleChange(e, 'actividad')} disabled={enableInput}>
                            <option key="0" value="">Seleccione</option>
                            {data.actividades.map((act, index) => {
                                return <option key={index} value={act.id}>{(act.nombre)}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            {([3].includes(parseInt(data.modalidad))) &&
                <>
                    <div className={'form-group col-12 col-md-7'}>
                        <div className={'row'}>
                            <label className="col-12 col-md-3 col-form-label align-self-center">Frecuencia</label>
                            <div className="col-md-9 align-self-center">
                                <select className="form-control" name="frecuencia" value={data.frecuencia} onChange={(e) => handleChange} disabled={true}>
                                    {data.frecuencias.map((frec, index) => {
                                        return <option key={index} value={frec.id}>{(frec.nombre)}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={'form-group col-12 col-md-7'}>
                        <div className={'row'}>
                            <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Pago por día (' + data.divisa.valor + ')'}</label>
                            <div className="col-md-9 align-self-center">
                                <InputFloat value={data.valordiafrecuencia} placeholder="Pago por día" name="valordiafrecuencia" tipo="float" disable={true} />
                            </div>
                        </div>
                    </div>

                    <div className={'form-group col-12 col-md-7'}>
                        <div className={'row'}>
                            <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Sueldo mensual (' + data.divisa.valor + ')'}</label>
                            <div className="col-md-9 align-self-center">
                                <InputFloat value={data.sueldomensual} placeholder="Sueldo mensual" name="sueldomensual" tipo="float" disable={true} />
                            </div>
                        </div>
                    </div>

                    <div className={'form-group col-12 col-md-7'}>
                        <div className={'row'}>
                            <label className="col-12 col-md-3 col-form-label align-self-center">Días de asistencia</label>
                            <div className="col-md-9 align-self-center">
                                <Select
                                    value={data.diaslaborablesfrecuencia}
                                    isMulti={true}
                                    onChange={(e) => handleChange(e, 'time', 'diasfrecuencia')}
                                    options={data.dias}
                                    placeholder={'Seleccione'}
                                    noOptionsMessage={() => 'Ya no puede seleccionar más días'}
                                    isDisabled={true}
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
                </>
            }

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Domicilio</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control" name="domicilio" value={data.domicilio} onChange={handleChange} disabled={enableInput}>
                            <option key="0" value="">Seleccione</option>
                            {data.domicilios.map((dom, index) => {
                                return <option key={index} value={dom.id}>{(dom.direccion)}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Postulante</label>
                    <div className="col-md-9 align-self-center">
                        <Select
                            value={data.postulante}
                            isMulti={true}
                            isDisabled={enableInput}
                            isSearchable
                            onChange={(e) => handleChange(e, 'select', 'postulante')}
                            options={data.trabajadores}
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

            {(parseInt(data.modalidad) == 3 && data.postulante && data.postulante != [] && data.diaslaborpostulante && view == 'new')  &&
                <div className={'form-group col-12 col-md-7'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label align-self-center">Días que ya labora</label>
                        <div className="col-md-9 align-self-center">
                            <Select
                                value={data.diaslaborpostulante}
                                isMulti={true}
                                onChange={(e) => handleChange(e, 'time', 'diaslaborpostulante')}
                                options={data.dias}
                                placeholder={'Seleccione'}
                                noOptionsMessage={() => 'Ya no puede seleccionar más días'}
                                isDisabled={true}
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
            }

            <div className={'form-group col-12'}><h5 className="hk-sec-title my-4">Datos del contrato</h5></div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Tipo de contrato</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control" name="tipocontrato" value={data.tipocontrato} onChange={(e) => handleChange(e, 'calculo', 'tipocontrato')} disabled={enableInput}>
                            <option key="0" value="" disabled>Seleccione</option>
                            {data.tiposcontratos.map((tCont, index) => {
                                return <option key={index} value={tCont.id}>{(tCont.nombre)}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Garantía (Meses)</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control" name="garantia" value={data.garantia} onChange={(e) => handleChange(e, 'garantia', 'garantia')} disabled={enableInput}>
                            {data.garantias.map((garantia, index) => {
                                return <option key={index} value={garantia} >{(garantia)}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha inicio de garantía</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.fechainiciogarantia}
                            selectsStart
                            onChange={(e) => handleChange(e, 'time', 'fechainiciogarantia')}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            scrollableYearDropdown
                            locale={es}
                            minDate={new Date()}
                            dropdownMode="select"
                            className="form-control"
                            name="fechainiciogarantia"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                            disabled={data.contrato ? true : false}
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha fin de gerantía</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.fechafingarantia}
                            selectsStart
                            onChange={(e) => handleChange(e, 'time', 'fechafingarantia')}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            scrollableYearDropdown
                            locale={es}
                            minDate={new Date()}
                            dropdownMode="select"
                            className="form-control"
                            name="fechafingarantia"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                            disabled={true}
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha inicio de labores</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.fechainiciolabores}
                            onChange={(e) => handleChange(e, 'time', 'fechainiciolabores')}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            scrollableYearDropdown
                            locale={es}
                            //minDate={new Date()}
                            dropdownMode="select"
                            className="form-control"
                            name="fechainiciolabores"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                            //disabled={enableInput}
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Hora inicio de labores</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.horainiciolabores}
                            onChange={(e) => handleChange(e, 'time', 'horainiciolabores')}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            className="form-control"
                            name="horainiciolabores"
                            placeholderText="hh:mm am/pm"
                            dateFormat="h:mm aa"
                            timeCaption="Hora"
                            minTime={setHours(setMinutes(new Date(), 0), 5)}
                            maxTime={setHours(setMinutes(new Date(), 29), 23)}
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

            {([1,2].includes(parseInt(data.modalidad))) &&
                <div className={'form-group col-12 col-md-7'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Sueldo pactado (' + data.divisa.valor + ')'}</label>
                        <div className="col-md-9 align-self-center">
                            <InputFloat value={data.sueldo} onchange={handleChange} placeholder="Ingrese el sueldo pactado" name="sueldo" tipo="calculo" disable={enableInput} />
                        </div>
                    </div>
                </div>
            }

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Total pago (' + data.divisa.valor + ')'}</label>
                    <div className="col-md-9 align-self-center">
                        <InputFloat value={data.totalpago} onchange={handleChange} placeholder="Pago total" name="totalpago" tipo="float" disable={true} />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Total (' + data.divisa.valor + ')'}</label>
                    <div className="col-md-9 align-self-center">
                        <InputFloat value={data.descuentoejecutivo} onchange={handleChange} placeholder="Descuento aplicado por el ejecutivo" name="descuentoejecutivo" tipo="diferencia" disable={false} />
                    </div>
                </div>
            </div>

            {( (data.descuentoejecutivo != data.totalpago) && (parseInt(data.tipocontrato) == 3) ) &&
                <div className={'form-group col-12 col-md-7'}>
                    <div className={'row'}>
                        <label className="col-12 col-md-3 col-form-label align-self-center" data-toggle="tooltip" data-placement="bottom" title={data.divisa.tooltip}>{'Monto aumentado (' + data.divisa.valor + ')'}</label>
                        <div className="col-md-9 align-self-center">
                            <InputFloat value={data.montodescontado} onchange={handleChange} placeholder="Monto que se descuenta" name="montodescontado" tipo="float" disable={true} />
                        </div>
                    </div>
                </div>
            }

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha de pago</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.fechapago}
                            selectsStart
                            onChange={(e) => handleChange(e, 'time', 'fechapago')}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            scrollableYearDropdown
                            locale={es}
                            minDate={new Date()}
                            dropdownMode="select"
                            className="form-control"
                            name="fechapago"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                            disabled={enableInput}
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12'}><h5 className="hk-sec-title my-4">Postulantes de reemplazo</h5></div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Reemplazo (B)</label>
                    <div className="col-md-9 align-self-center">
                        <Select
                            value={data.postulanteB}
                            isMulti={false}
                            //isDisabled={enableInput}
                            isSearchable
                            onChange={(e) => handleChange(e, 'select', 'postulanteB')}
                            options={data.trabajadoresB}
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

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Inicio labores</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.fechainiciolaboresb}
                            onChange={(e) => handleChange(e, 'time', 'fechainiciolaboresb')}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            scrollableYearDropdown
                            locale={es}
                            minDate={new Date()}
                            dropdownMode="select"
                            className="form-control"
                            name="fechainiciolaboresb"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12'}>
                <hr/>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Reemplazo (C)</label>
                    <div className="col-md-9 align-self-center">
                        <Select
                            value={data.postulanteC}
                            isMulti={false}
                            //isDisabled={enableInput}
                            isSearchable
                            onChange={(e) => handleChange(e, 'select', 'postulanteC')}
                            options={data.trabajadoresC}
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

            <div className={'form-group col-12 col-md-7'}>
                <div className={'row'}>
                    <label className="col-12 col-md-3 col-form-label align-self-center">Inicio labores</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.fechainiciolaboresc}
                            onChange={(e) => handleChange(e, 'time', 'fechainiciolaboresc')}
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            scrollableYearDropdown
                            locale={es}
                            minDate={new Date()}
                            dropdownMode="select"
                            className="form-control"
                            name="fechainiciolaboresb"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

        </section>
    )
}

import React from "react";
import DatePicker from "react-datepicker";
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

import InputAreaImage from "../../Components/inputAreaImage.jsx";
import IndividualCheckbox from "../../Components/individualCheckbox.jsx";
import Tooltips from "../../Components/tooltips.jsx";

export default function DatosTestimonialesTrabajador({data, handleChange, handleSingularUpload, handleSingularDelete, view}) {
    return(
        <section className={'row mx-0 pb-4 pt-35'}>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha Publicación</label>
                    <div className="col-md-9 align-self-center">
                        <DatePicker
                            selected={data.fecha}
                            selectsStart
                            onChange={(e) => handleChange(e, 'time', 'fecha')}
                            dateFormat="dd/MM/yyyy"
                            locale={es}
                            dropdownMode="select"
                            className="form-control"
                            name="fecha"
                            placeholderText="dd/mm/aaaa"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Trabajador</label>
                    <div className="col-md-9 align-self-center">
                        <Select
                            value={data.trabajador}
                            isMulti={false}
                            isDisabled={view == 'edit' ? true :false}
                            isSearchable
                            onChange={(e) => handleChange(e, 'select', 'trabajador')}
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

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center"><span className='me-2'>Imagen</span><Tooltips estilo={'tooltip-tc'} placement={'bottom'} text={'La imagen debe tener las siguientes medidas: 350 de ancho y 200 de alto.'} /></label>
                    <div className="col-md-9 align-self-center">
                        <InputAreaImage image={data.imagenTestimonial} campoName={'imagenTestimonial'} loadingImage={data.isLoadingImage} nombreImg={'imagenTestimonial'} handleUpload={handleSingularUpload} handleDelete={handleSingularDelete} />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Visibilidad</label>
                    <div className="col-md-9 align-self-center">
                        <IndividualCheckbox label={'Perú'} handleChange={handleChange} tipo={'visibilidad'} campo={'dispPe'} inputValue={data.dispPe}/>

                        <IndividualCheckbox label={'México'} handleChange={handleChange} tipo={'visibilidad'} campo={'dispMx'} inputValue={data.dispMx}/>
                    </div>
                </div>
            </div>
        </section>
    )
}

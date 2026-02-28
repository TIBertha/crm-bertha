import React from "react";
import DatePicker from "react-datepicker";
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import AsyncSelect from "react-select/async";

import InputAreaImage from "../../Components/inputAreaImage.jsx";
import IndividualCheckbox from "../../Components/individualCheckbox.jsx";
import Tooltips from "../../Components/tooltips.jsx";

export default function DatosTestimonialesEmpleador({data, handleChange, handleSingularUpload, handleSingularDelete, view, loadEmpleadoresOptions}) {
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
                    <label className="col-12 col-md-3 col-form-label align-self-center">Empleador</label>
                    <div className="col-md-9 align-self-center">
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
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Nombre del cliente</label>
                    <div className="col-md-9 align-self-center">
                        <input type="text" className="form-control" id="nombrecliente" name="nombrecliente" value={data.nombrecliente} onChange={(e) => handleChange(e, 'texto')} placeholder="Ingrese el nombre del cliente" />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Frase</label>
                    <div className="col-md-9 align-self-center">
                        <textarea className="form-control" name="testimonial" rows="2" value={data.testimonial} onChange={(e) => handleChange(e, 'testimonio')} placeholder="Testimonial" />
                        <span className="form-text text-muted">
                        {data.testimonial ? data.testimonial.length : 0} / {data.limit} caracteres máximo.
                    </span>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12'}>
                <hr/>
                <h5 className="hk-sec-title mb-4 mt-4">Video Testimonial</h5>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center"><span className='me-2'>Video</span><Tooltips estilo={'tooltip-tc'} placement={'bottom'} text={'Insertar el link del video subido en YouTube.'} /></label>
                    <div className="col-md-9 align-self-center">
                        <input type="text" className="form-control" id="youtube" name="youtube" value={data.youtube} onChange={handleChange} placeholder="Ingrese el enlace del video" />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center"><span className='me-2'>Poster</span><Tooltips estilo={'tooltip-tc'} placement={'bottom'} text={'La imagen debe tener las siguientes medidas: 350 de ancho y 200 de alto.'} /></label>
                    <div className="col-md-9 align-self-center">
                        <InputAreaImage image={data.poster} campoName={'poster'} loadingImage={data.isLoadingPoster} nombreImg={'poster'} handleUpload={handleSingularUpload} handleDelete={handleSingularDelete} />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12'}>
                <hr/>
                <h5 className="hk-sec-title mb-4 mt-4">Imagen Testimonial</h5>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center"><span className='me-2'>Imagen</span><Tooltips estilo={'tooltip-tc'} placement={'bottom'} text={'La imagen debe tener las siguientes medidas: 350 de ancho y 200 de alto.'} /></label>
                    <div className="col-md-9 align-self-center">
                        <InputAreaImage image={data.imagenTestimonialEmpleador} campoName={'imagenTestimonialEmpleador'} loadingImage={data.isLoadingImagenTestimonial} nombreImg={'imagenTestimonialEmpleador'} handleUpload={handleSingularUpload} handleDelete={handleSingularDelete} />
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

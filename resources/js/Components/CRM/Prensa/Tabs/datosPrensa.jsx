import React from "react";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";
import {WithContext as ReactTags} from "react-tag-input";

import Tooltips from "../../Components/tooltips.jsx";
import InputAreaImage from "../../Components/inputAreaImage.jsx";

const KeyCodes = {
    comma: 188,
    enter: 10,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function DatosPrensa({view, data, show, handleChange, handleEditorChange, handleSingularUpload, handleSingularDelete, handleDelete, handleAddition, handleDrag, handleTagClick}) {

    return(
        <section className={'row mx-0 pb-4 pt-35'}>
            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Titulo</label>
                    <div className="col-md-9 align-self-center">
                        <input type="text" className="form-control" id="titulo" name="titulo" value={data.titulo} onChange={handleChange} placeholder="Ingrese el titulo" />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Medio</label>
                    <div className="col-md-9 align-self-center">
                        <select className="form-control" name="medio" value={data.medio} onChange={handleChange}>
                            <option key="0" value="">Seleccione</option>
                            {data.medios.map((p, index) => {
                                return <option key={index} value={p.id}>{(p.nombre)}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fecha</label>
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
                    <label className="col-12 col-md-3 col-form-label align-self-center">Fuente</label>
                    <div className="col-md-9 align-self-center">
                        <textarea className="form-control" name="fuente" value={data.fuente} onChange={(e) => handleChange(e, 'fuente')} placeholder="Fuente del Artículo" />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center"><span className='mr-2'>Etiquetas</span><Tooltips estilo={'tooltip-tc'} placement={'bottom'} text={'Estas etiquetas servirán para posicionar el artículo en Google.'} /></label>
                    <div className="col-md-9 align-self-center">
                        <ReactTags
                            tags={data.tags}
                            inline
                            delimiters={delimiters}
                            placeholder="Nueva etiqueta..."
                            handleDelete={handleDelete}
                            handleAddition={handleAddition}
                            handleDrag={handleDrag}
                            handleTagClick={handleTagClick}
                            classNames={{
                                remove: 'reactTag-remove',
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className={'form-group col-12'}>
                <hr/>
                <h5 className="hk-sec-title mb-4 mt-4">Adjuntos</h5>
            </div>

            <div className={'form-group col-12 col-md-7'}>
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Imagén del Artículo (1920x1080)</label>
                    <div className="col-md-9 align-self-center">
                        <InputAreaImage image={data.imagen} campoName={'imagen'} loadingImage={data.isLoadingImagen} nombreImg={'imagen'} handleUpload={handleSingularUpload} handleDelete={handleSingularDelete} />
                    </div>
                </div>
            </div>
        </section>
    )
}

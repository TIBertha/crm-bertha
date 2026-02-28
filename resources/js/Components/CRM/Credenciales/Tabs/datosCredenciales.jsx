import React from 'react';

export default function DatosCredenciales({data, handleChange}) {
    return(
        <section className="row mx-0 pb-4 pt-35">

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Plataforma</label>
                    <div className="col-md-9 align-self-center">
                        <input type="text" className="form-control" id="nombrePlataforma" name="nombrePlataforma" value={data.nombrePlataforma} onChange={handleChange} placeholder="Ingrese el nombre de la plataforma" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Usuario</label>
                    <div className="col-md-9 align-self-center">
                        <input type="text" className="form-control" id="usuario" name="usuario" value={data.usuario} onChange={handleChange} placeholder="Ingrese el usuario" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Contraseña</label>
                    <div className="col-md-9 align-self-center">
                        <input type="text" className="form-control" id="contra" name="contra" value={data.contra} onChange={handleChange} placeholder="Ingrese la contraseña" />
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Link</label>
                    <div className="col-md-9 align-self-center">
                        <div className={'row mx-0'}>
                            <input type="text" className={'form-control col' + (data.linkPlataforma ? '' : '-12')} id="linkPlataforma" name="linkPlataforma" value={data.linkPlataforma} onChange={handleChange} placeholder="Ingrese el link de acceso" />
                            {data.linkPlataforma &&
                                <div className={'col-auto pr-0'}>
                                    <a className={'btn btn-sm btn-green-webexperta font-weight-bold text-white h-100'} href={data.linkPlataforma} target={'_blank'}>
                                        <i className={'fas fa-link alignButtonReq icon-question'}></i>
                                    </a>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-group col-12 col-md-7">
                <div className="row">
                    <label className="col-12 col-md-3 col-form-label align-self-center">Nivel de Acceso</label>
                    <div className="col-md-9 align-self-center">
                        <div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="nivelCredencial" id={1} value={1} checked={data.nivelCredencial == '1' ? true : false} onChange={(e) => handleChange(e, 'nivelCredencial')} />
                                <label className="form-check-label" htmlFor={1} >Nivel 1 (Todos los Usuarios)</label>
                            </div>
                        </div>

                        <div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="nivelCredencial" id={2} value={2} checked={data.nivelCredencial == '2' ? true : false} onChange={(e) => handleChange(e, 'nivelCredencial')} />
                                <label className="form-check-label" htmlFor={2} >Nivel 2 (Restringida)</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}

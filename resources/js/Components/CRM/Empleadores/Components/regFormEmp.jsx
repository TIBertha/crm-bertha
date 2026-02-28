import React from "react";
import {IMaskInput} from "react-imask";

export default function RegFormEmp({handleChange, save,  close, nombres, apellidos, telefono}) {
    const isDisabled = !(nombres && apellidos && telefono);

    return(
        <section className="formularioClientePedido">

            <div className='row mx-0 justify-content-center'>

                <div className="form-group col-12">
                    <div className="row">
                        <label className="col-12  col-form-label align-self-center">Nombres</label>
                        <div className="col-12 ">
                            <input type="text" className="form-control" id="nombresQR" name="nombresQR" value={nombres} placeholder="Ingrese nombres" onChange={handleChange}/>
                        </div>
                    </div>
                </div>

                <div className="form-group col-12">
                    <div className="row">
                        <label className="col-12  col-form-label align-self-center">Apellidos</label>
                        <div className="col-12 ">
                            <input type="text" className="form-control" id="apellidosQR" name="apellidosQR" value={apellidos} placeholder="Ingrese apellidos" onChange={handleChange}/>
                        </div>
                    </div>
                </div>

                <div className="form-group col-12">
                    <div className="row">
                        <label className="col-12  col-form-label align-self-center">Telefono</label>
                        <div className="col-12 ">
                            <IMaskInput
                                type="tel"
                                className="form-control"
                                placeholder="Ingrese el teléfono"
                                value={telefono}
                                onChange={handleChange}/>
                        </div>
                    </div>
                </div>

                <div className="form-group col-auto">
                    <div className='row justify-content-center mx-0 mt-3'>

                        <div className='col-auto'>
                            <button type="button" className="btn bertha-purple-button font-weight-500" onClick={(e) => close(e, false)}>
                                Volver
                            </button>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn bertha-green-button font-weight-500" onClick={(e) => save(e)} disabled={isDisabled}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    )
}

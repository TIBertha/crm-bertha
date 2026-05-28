import React from 'react';
import "react-datepicker/dist/react-datepicker.css";

export default function RequerimientosSearch({fastsearch, change}) {
    return (

        <div className="search-balance">

            <form className="form-inline">

                <label className="sr-only" htmlFor="inlineFormInputName2"></label>
                <select className="form-control form-control-sm mb-2 me-sm-2"  name="fastsearch" value={fastsearch} onChange={(e) => change(e)} >
                    <option key="0" value="">Seleccione Busqueda Rapida</option>
                    <option key="1" value="H" >ENTREVISTAS HOY</option>
                    <option key="2" value="T" >TODAS LAS ENTREVISTAS</option>
                </select>

            </form>

        </div>

    )
}

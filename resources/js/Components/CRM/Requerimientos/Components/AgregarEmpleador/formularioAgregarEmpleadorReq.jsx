import React, {useState} from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import es from 'react-phone-input-2/lang/es.json';
import {ajaxVerificarNumero} from "../../../../Functions/Usuarios.jsx";
import {forceInputUppercase} from "../../../../Helpers/strings.js";

const generateInitialData = () => {

    return { nombres: '', apellidos: '', telefono: '' };

};

export default function FormularioAgregarEmpleadorReq({setNewEmpleador, save}) {

    const [empleador, setEmpleador] = useState(generateInitialData());
    const [isSearching, setIsSearching] = useState(false);
    const [existDuplicity, setExistDuplicity] = useState(false);
    const [estatusNumber, setEstatusNumber] = useState('');
    const [iconEstatusNumber, setIconEstatusNumber] = useState('');

    const setValues = (target) => {
        setEmpleador({...empleador, ...target});
        setNewEmpleador({...empleador, ...target});
    };

    function searchUsuario(e){
        let numero = e;
        setIsSearching(numero.length > 0 ? true : false);
        ajaxVerificarNumero(numero, 'phone').then(r => {
            setIsSearching(false);
            setEstatusNumber(numero.length > 0 ? r.estatusNumber : '');
            setIconEstatusNumber(numero.length > 0 ? r.iconEstatusNumber : '');
            setExistDuplicity(numero.length > 0 ? r.existDuplicityNumber : 0);
        }).catch(function (error){
            if (error.response.status == 422){
                setIsSearching(false);
            }
        });
    }

    return(
        <div>


            <div className="form-group">
                <label className="col-form-label col-form-label-sm">Nombres</label>
                <input type="text" className="form-control" name="nombres" value={empleador.nombres} placeholder="Ingrese nombres" onChange={(e) => {setValues({nombres: e.target.value.toUpperCase()}); forceInputUppercase(e);}}/>
            </div>

            <div className="form-group">
                <label className="col-form-label col-form-label-sm">Apellidos</label>
                <input type="text" className="form-control" name="apellidos" value={empleador.apellidos} placeholder="Ingrese apellidos" onChange={(e) => {setValues({apellidos: e.target.value.toUpperCase()}); forceInputUppercase(e);}}/>
            </div>

            <div className="form-group">
                <label className="col-form-label col-form-label-sm">Teléfono</label>
                <div className="col-12 px-0">
                    <div className="row mx-0">

                        <PhoneInput
                            placeholder="Ingrese el teléfono"
                            localization={es}
                            country={"pe"}
                            value={empleador.telefono.indexOf(' ') >= 0 ? empleador.telefono.split(" ").join("") : empleador.telefono}
                            //onChange={(e) => {setValues({telefono: e}); searchUsuario(e);}}
                            onChange={(e) => {setValues({telefono:e}); searchUsuario(e)}}
                            preferredCountries={['pe', 'us', 'cl', 'co', 've']}
                            inputClass={'w-100 input-countrycode ' + ((empleador.telefono.length > 0) ? ' modified-border ' : '')}
                            containerClass='col px-0'
                            enableLongNumbers={true}
                        />

                        {(empleador.telefono.length > 0) &&
                            <div className={'col-auto verificador-telefono' + ((isSearching) ? ' gray-bg-ver' : '') +  ((parseInt(existDuplicity) == 1) ? ' red-bg-ver' : '') + ((parseInt(existDuplicity) == 2) ? ' green-bg-ver' : '')} >
                                <div className='btn px-0'>
                                    {isSearching ?
                                        <i className="fas fa-sync fa-spin"></i>
                                        :
                                        <i className={iconEstatusNumber + ' '}></i>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {((parseInt(existDuplicity) == 1) && (empleador.telefono.length >= 5)) &&
                <div className="form-group">
                    <div className={'alert alert-' + ((parseInt(existDuplicity) == 1) ? 'danger' : '') + ((parseInt(existDuplicity) == 2) ? 'success' : '') + ' alert-dismissible fade show'} role="alert">
                        <b>{estatusNumber}</b>
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            }

            {((parseInt(existDuplicity) == 2) && (empleador.telefono.length >= 5)) &&
                <div className="form-group col-12 mb-0 text-center" onClick={(e) => save(e)}>
                    <a className="btn bertha-purple-button" >
                        Guardar empleador
                    </a>
                </div>
            }

        </div>
    );

}

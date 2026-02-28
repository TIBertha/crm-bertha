import React, {useEffect, useState} from 'react';
import Swal from "sweetalert2";
import global from "../../../../Helpers/constantes.js";
import {
    ajaxPostulacionesSelectWhatsapp,
    ajaxActionAddPostulante, ajaxListaPostulantesAdd, ajaxGetPostulaciones,
    ajaxPostulacionesRemover, ajaxPostulacioneAscender
} from "../../../../Functions/Requerimientos.jsx";
import {showAlert} from "../../../../Helpers/alerts.js";
import {speechPostuladosPC} from "../../../../Helpers/strings.js";
import CardPostulante from "../../../Components/cardPostulante.jsx";
import ModalAgregar from "./modalAgregar.jsx";
import PostulantesAntiguasMostradas from "../../Modals/PostulantesAntiguasMostradas";
import NewCopyButton from "../../../Components/newCopyButton.jsx";

export default function Postulaciones({data, requerimientoid, empleador}) {
    const [filtro, setFiltro] = useState('1');
    const [postulaciones, setPostulaciones] = useState([]);
    const [totalPostulaciones, setTotalPostulaciones] = useState('');
    const [isLoadingPostulaciones, setIsLoadingPostulaciones] = useState(false);
    const [postulacionesFiltered, setPostulacionesFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [searchPostulanteAdd, setSearchPostulanteAdd] = useState('');
    const [showModalAgregar, setShowModalAgregar] = useState(false);
    const [resultadosPostulantes, setResultadosPostulantes] = useState([]);
    const [postuladosPC, setPostuladosPC] = useState([]);

    const getListaPostulaciones = (requerimientoid, filtro) => {

        setIsLoadingPostulaciones(true);
        ajaxGetPostulaciones(requerimientoid, filtro).then(r => {
            if (r.code === 200){
                setPostulaciones(r.postulaciones);
                setTotalPostulaciones(r.totalPostulaciones);
                setPostuladosPC(r.postuladosPC);
                setIsLoadingPostulaciones(false);
            }
        }).catch(function (error){

            setIsLoadingPostulaciones(false);
            showAlert('error', 'Ha ocurrido un error, contacte al administrador.');

        });

    };

    const forceInputUppercase = (e) => {
        let start = e.target.selectionStart;
        let end = e.target.selectionEnd;
        e.target.value = e.target.value.toUpperCase();
        e.target.setSelectionRange(start, end);
    };

    const onChangeSearch = (e, modal) => {

        if(modal){

            let search = e.target.value.toUpperCase();

            setSearchPostulanteAdd(search);

            ajaxListaPostulantesAdd(requerimientoid, search).then(result => {
                setResultadosPostulantes(result.postulantes);

            }).catch(function (error){

                showAlert('error', 'Ha ocurrido un error, contacte al administrador.');

            });

        }else{
            setSearch(e.target.value.toUpperCase());
        }

        forceInputUppercase(e);
    };

    const handleCloseModalAgregar = () => {
        setShowModalAgregar(false);
        setSearchPostulanteAdd('');
        setResultadosPostulantes([]);
    };

    const handleShowModalAgregar = () => {
        setShowModalAgregar(true);
        setSearchPostulanteAdd('');
        setResultadosPostulantes([]);
    };

    const changeFiltro = (e) => {

        let valorFiltro = e.target.value;
        setFiltro(valorFiltro);
        setSearch('');
        getListaPostulaciones(requerimientoid, valorFiltro);

    };

    const addPostulante = (trabajadorid) =>{

        handleCloseModalAgregar();

        ajaxActionAddPostulante(requerimientoid, trabajadorid).then(result => {

            getListaPostulaciones(requerimientoid, filtro);

        }).catch(function (error){

            showAlert('error', 'Ha ocurrido un error, contacte al administrador.');

        });

    };


    const btnAgregar = () => {
        handleShowModalAgregar();
    };

    const removePostulante = (requerimientopostulacionid) => {

        Swal.fire({
            text: "¿Estás seguro que deseas descartar el trabajador?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {

            if (result.value) {

                ajaxPostulacionesRemover(requerimientopostulacionid).then(r => {

                    getListaPostulaciones(requerimientoid, filtro);

                }).catch(function (error){

                    showAlert('error', 'Ha ocurrido un error, contacte al administrador.');

                });

            }

        });

    };

    const selectWp = (requerimientopostulacionid) => {

        ajaxPostulacionesSelectWhatsapp(requerimientopostulacionid).then(r => {

            getListaPostulaciones(requerimientoid, filtro);

        }).catch(function (error){

            showAlert('error', 'Ha ocurrido un error, contacte al administrador.');

        });

    };

    const ascenderPostulante = (requerimientopostulacionid) => {

        Swal.fire({
            text: "¿Estás seguro que deseas agregar a la lista de mostrados el trabajador?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {

            if (result.value) {

                ajaxPostulacioneAscender(requerimientopostulacionid).then(result => {

                    getListaPostulaciones(requerimientoid, filtro);

                }).catch(function (error){

                    showAlert('error', 'Ha ocurrido un error, contacte al administrador.');

                });

            }

        });

    };

    useEffect(() => {

        getListaPostulaciones(requerimientoid, filtro);

    }, []);

    useEffect(() => {

        const results = postulaciones.filter(p =>
            p.trabajador.includes(search)
        );

        setPostulacionesFiltered(results);

    }, [search, postulaciones]);


    return (

        <div className="pb-4 pt-35">

            <div className="alert alert-secondary mt-35 mb-40" role="alert">
                {(totalPostulaciones > 0) ?
                    <>
                        {totalPostulaciones}
                        <> Trabajadores postulando al requerimiento de: </>
                        <strong>{empleador.label}</strong>

                        {(data.domicilio && data.linkDomicilio) &&
                            <>
                                <a className={'text-purple ms-2'} href={'https://www.' + data.linkDomicilio} target={'_blank'} data-toggle="tooltip" data-placement="top" title={'Ver dirección de empleador ' + empleador.label}>
                                    <i className="fas fa-map-marked-alt icon-16"></i>
                                </a>

                                <a className={'icon-moovit ms-2'} href={'https://moovitapp.com/lima-1102/poi/es'} target={'_blank'} data-toggle="tooltip" data-placement="top" title={'Abrir Moovit'}>
                                    <i className="fas fa-map-marker icon-16"></i>
                                </a>
                            </>
                        }
                    </>
                    :
                    'No hay trabajadores postulados'
                }
            </div>

            {(data.postulacionesPrevias != 0) &&
                <div className="alert alert-secondary mt-35 mb-40" role="alert">
                    <div className={'pb-3'}>
                        {data.postulacionesPrevias}
                        <> Trabajadores han sido <strong>mostradas</strong> en requerimientos pasados a </>
                        <strong>{empleador.label}</strong>
                    </div>
                    <PostulantesAntiguasMostradas idEmpleador={data.empleador.value} idRequerimiento={data.id} />
                </div>
            }

            <section className="content inbox">

                <ModalAgregar show={showModalAgregar} close={handleCloseModalAgregar} resultadosPostulantes={resultadosPostulantes} searchPostulanteAdd={searchPostulanteAdd} onChangeSearch={onChangeSearch} addPostulante={addPostulante}/>

                <div className="row clearfix mb-4">

                    <div className="col-12 col-sm-12 col-md-6 mb-4 mb-md-0">

                        <div className="row">

                            <div className="col-md-4 col-lg-auto">
                                <button className="btn bertha-pink-button font-weight-500 btn-block" type="button" onClick={ () => btnAgregar() }>Agregar</button>
                            </div>

                            {postuladosPC.length >= 1 &&
                                <div className="col-md-4 col-lg-auto">
                                    <NewCopyButton
                                        copyText={speechPostuladosPC(postuladosPC, data.empleadornombres, data.actividadNombre, data.actividad, data.supervisor)}
                                        btnText={'Speech'}
                                        tooltipText={'Copiar speech'}
                                        successMsj={'Speech copiado'}
                                        btnColor={'yellow'}
                                    />
                                </div>
                            }

                        </div>

                    </div>

                    <div className="col-12 col-sm-12 col-md-4 d-flex justify-content-md-end mb-2 mb-md-0">

                        <div className="form-group has-search w-100 w-md-60">
                            <span className="form-control-feedback"></span>
                            <input type="search" className="form-control" placeholder="Ingresar nombre postulante" name="search" value={search} onChange={ (e) => onChangeSearch(e) }/>
                        </div>

                    </div>

                    <div className="col-12 col-sm-12 col-md-2 d-flex justify-content-md-end">

                        <select className="custom-select w-100" name="filtro" value={filtro} onChange={ (e) => changeFiltro(e)}>
                            <option key="1" value='1'>POSTULADOS</option>
                            <option key="2" value='0'>DESCARTADOS</option>
                            <option key="3" value='2'>MOSTRADOS</option>
                        </select>

                    </div>

                </div>


                {postulacionesFiltered.length > 0 ?
                    <div className="row clearfix">
                        {postulacionesFiltered.map((data, key) =>
                            <CardPostulante data={data} modelCard={3} filtro={filtro} removePostulante={removePostulante} ascenderPostulante={ascenderPostulante} selectWp={selectWp} />
                        )}
                    </div>
                    :
                    <div className="alert alert-secondary mb-40" role="alert">
                        <i className="fas fa-info-circle me-2"></i> No existen postulantes.
                    </div>
                }


            </section>

        </div>

    );

}


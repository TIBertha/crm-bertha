import React, { Component } from "react";
import Swal from "sweetalert2";
import {useNavigate, useParams} from "react-router-dom";

import LoadingScreen from "../Components/loadingScreen.jsx";
import Flyer from "../Components/flyer.jsx";
import IndexButton from "../Components/indexButton.jsx";
import ButtonAccess from "../Layouts/SubComponents/buttonAccess.jsx";
import NoDataLabel from "../Components/noDatalabel.jsx";

import {
    getEmpleadores,
    getDataInicial,
    ajaxQuickEmpleadoresNew,
    ajaxEmpleadoresActive,
    ajaxEmpleadoresEliminar,
    ajaxEmpleadoresGetLinkFromRequerimiento,
    ajaxEmpleadoresGenerateLinkFromRequerimiento,
    ajaxEmpleadoresRemoveLinkFromRequerimiento,
    ajaxEmpleadoresBuscar
} from '../../Functions/Empleadores.jsx';
import ModalGenerateFormRequerimiento from "./Components/modalGenerateFormRequerimiento.jsx";

import EmpleadoresSearchSideBar from "./empleadoresSearchSideBar.jsx";
import EmpleadoresTable from "./EmpleadoresTable.jsx";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class EmpleadoresIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            empleadores: [],
            totalempleadores: [],
            empleador: '',
            telefono: '',
            documento: '',
            fechaactdesde: '',
            fechaacthasta: '',
            estado: '',
            estados: [],
            responsable: '',
            responsables: [],
            activo: '',
            busqueda: 0,
            textoresultados: '',
            modalGenerateLinkFormRequerimiento: false,
            viewModalFormRequerimiento: '1',
            linkFormRequerimiento: '',
            page:'',
            empTemp: '',
            exist: false,
            isLoading: true,
            isBusqueda: false,

            /*MODAL QUICKREGISTER EMPLEADOR*/
            modalQuickReg: false,
            nombresQR: '',
            apellidosQR: '',
            telefonoQR: '',
            tokenQR: '',
            rMsjQR: '',
            isLoadingModalQR: false,
            successModalQR: false,
            sideBar: false,
        };

        this.openSideBar = this.openSideBar.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.buscar = this.buscar.bind(this);
        this.limpiar = this.limpiar.bind(this);
        this.active = this.active.bind(this);
        this.eliminar = this.eliminar.bind(this);
        this.linkFormRequerimiento = this.linkFormRequerimiento.bind(this);
        this.refreshEmpleadores = this.refreshEmpleadores.bind(this);
        this.openModalLinkFormRequerimiento = this.openModalLinkFormRequerimiento.bind(this);
        this.closeModalLinkFormRequerimiento = this.closeModalLinkFormRequerimiento.bind(this);
        this.changeViewModal = this.changeViewModal.bind(this);
        this.generateLinkFormRequerimiento = this.generateLinkFormRequerimiento.bind(this);
        this.deleteLinkFormRequerimiento = this.deleteLinkFormRequerimiento.bind(this);
        this.changePagination = this.changePagination.bind(this);
        this.paginationSearch = this.paginationSearch.bind(this);

        this.openModalQuickRegister = this.openModalQuickRegister.bind(this);
        this.closeModalQuickRegister = this.closeModalQuickRegister.bind(this);
        this.saveQuickRegister = this.saveQuickRegister.bind(this);
    }

    openSideBar(e, condition) {
        this.setState({sideBar: condition});
    }

    setBusqueda(condition){
        this.setState({isBusqueda: condition});
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    setModificado(condition){
        this.setState({modificado: condition});
    }

    setLoadingModalQR(condition){
        this.setState({isLoadingModalQR: condition});
    }

    saveQuickRegister(e){

        this.setLoadingModalQR(true);

        ajaxQuickEmpleadoresNew(this.state).then(r => {
            if(r.code === 200){
                this.setState({
                    isLoadingModalQR: false,
                    tokenQR: r.token,
                    rMsjQR: r.msj,
                    successModalQR: true,
                });
            }else if(r.code === 500){
                this.setState({
                    isLoadingModalQR: false,
                    rMsjQR: r.msj,
                    successModalQR: true,
                });
            }
        }).catch( function (error) {
            if (error.response.status == 422){
                this.setState({
                    isLoadingModalQR: false,
                    rMsjQR: r.msj,
                    successModalQR: true,
                });
            }
        });
    }

    openModalQuickRegister(e){
        this.setState({
            modalQuickReg: true,
        });
        this.setLoadingQR();
    }

    closeModalQuickRegister(e, refresh){
        this.setState({
            modalQuickReg: false,
            isLoadingModalQR: false,
            successModalQR: false,
        });

        this.cleandDataQR();

        if (refresh == true){
            this.refreshEmpleadores();
        }
    }

    cleandDataQR(){
        this.setState({
            nombresQR: '',
            apellidosQR: '',
            telefonoQR: '',
            tokenQR: '',
            rMsjQR: '',
        });
    }

    setLoadingQR(){
        this.setState({
            isLoadingModalQR: true,
        });
        setTimeout(() =>{
            this.setState({
                isLoadingModalQR: false,
            });
        }, 1000);
    }

    openModalLinkFormRequerimiento(e){
        this.setState({
            modalGenerateLinkFormRequerimiento: true,
            exist: false,
            viewModalFormRequerimiento: '1',
        });
    }

    closeModalLinkFormRequerimiento(e){
        this.setState({
            modalGenerateLinkFormRequerimiento: false,
            empTemp: '',
        });
    }

    changeViewModal(e){
        this.setState({
            viewModalFormRequerimiento: '2',
        });
    }

    active(e, id, estado){

        e.preventDefault();

        Swal.fire({
            text: ( '¿Está seguro que desea ' + (estado ? 'in' : '') + 'activar el estado?'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxEmpleadoresActive(id).then(r => {
                    if(r.code === 200){
                        this.refreshEmpleadores();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/empleadores', navigate);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                });
            }
        });

    }

    eliminar(e, id){

        e.preventDefault();

        Swal.fire({
            text: '¿Está seguro que deseas eliminar al empleador?',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxEmpleadoresEliminar(id).then(r => {
                    if(r.code === 200){
                        showAlertConfirmRedirect('exito', r.msj, '/empleadores');
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                });
            }
        });

    }

    linkFormRequerimiento(e, id){
        ajaxEmpleadoresGetLinkFromRequerimiento(id).then(r => {
            if(r.code === 200){
                this.setState({
                    linkFormRequerimiento: r.link,
                    empTemp: id
                });
                this.openModalLinkFormRequerimiento();
            }
        });
    }

    generateLinkFormRequerimiento(){

        let {empTemp} = this.state;

        ajaxEmpleadoresGenerateLinkFromRequerimiento(empTemp).then(r => {
            if(r.code === 200){
                this.setState({
                    linkFormRequerimiento: r.link,
                    exist: true
                });
                this.refreshEmpleadores();
            }else{
                showAlert('error', r.msj);
            }
        });
    }

    deleteLinkFormRequerimiento(){

        let {empTemp} = this.state;

        ajaxEmpleadoresRemoveLinkFromRequerimiento(empTemp).then(r => {
            if(r.code === 200){
                this.setState({
                    linkFormRequerimiento: ''
                });
                this.closeModalLinkFormRequerimiento();
                this.refreshEmpleadores();
            }else{
                showAlert('error', r.msj);
            }
        });
    }

    limpiar(){
        this.setState({
            activo: '',
            empleador: '',
            telefono: '',
            documento: '',
            estado: '',
            fechaactdesde: '',
            fechaacthasta: '',
            responsable:'',
            isBusqueda: false,
        });
        this.refreshEmpleadores();
    }

    handleChange(e, tipo = '', campo = '') {

        if(tipo == 'time'){
            this.setState({
                [campo]: e
            });

        }else if(tipo == 'keypress'){

            if(e.charCode === 13){

                this.buscar();
            }

        }else if(tipo == 'telefono'){
            this.setState({
                [e]: e
            });

        }else{

            const input = e.target;
            const start = input.selectionStart;
            const end = input.selectionEnd;

            this.setState({
                [e.target.name]: e.target.value.toUpperCase()
            }, () =>  (start == undefined && end == undefined) ? '' : input.setSelectionRange(start, end) );
        }
    }

    getDataInicial(){

        getDataInicial().then(r => {

            this.setState({estados: r.estados});
        })
    }

    refreshEmpleadores(){
        this.setLoading(true);

        getEmpleadores(0).then(r => {
            this.setLoading(false);
            this.setState({
                empleadores: r.empleadores,
                totalempleadores: r.total,
                textoresultados: r.textoresultados,
            });
        })
    }

    changePagination(page){

        let pagina = parseInt(page.selected) + 1;
        let offset = (pagina - 1) * 10 ;
        this.setState({page: pagina});

        getEmpleadores(offset).then(r => {

            this.setState({
                empleadores: r.empleadores,
                totalempleadores: r.total,
                textoresultados: r.textoresultados
            });
        })

    }

    buscar(e){

        e.preventDefault();

        this.setModificado(1);
        this.setLoading(true);
        this.setBusqueda(true);

        ajaxEmpleadoresBuscar(this.state, 0).then(r => {
            if(r.code === 200){
                if(r.empleadores){
                    this.setState({
                        empleadores: r.empleadores,
                        totalempleadores: r.total,
                        textoresultados: r.textoresultados,
                        page: r.page,
                    });
                    this.setLoading(false);
                }else{
                    this.setLoading(false);
                }
                this.closeSearchSide();
            }else if(r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        }).catch( function (error) {
            if (error.response.status == 422){
                this.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    paginationSearch(page){

        let pagina = parseInt(page.selected) + 1;
        let offset = (pagina - 1) * 10 ;

        ajaxEmpleadoresBuscar(this.state, offset).then(r => {
            if(r.code === 200){
                if(r.empleadores){
                    this.setState({
                        empleadores: r.empleadores,
                        textoresultados: r.textoresultados,
                        totalempleadores: r.total,
                        page: pagina,
                    });
                    this.setLoading(false);
                }else{
                    this.setLoading(false);
                }
            }else if(r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        }).catch( function (error) {
            if (error.response.status == 422){
                this.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    componentDidMount(){

        let{busqueda} = this.state;

        this.getDataInicial();

        if (busqueda == 0){
            this.refreshEmpleadores();
        }

    }

    render() {

        let {url, sideBar, viewModalFormRequerimiento, textoresultados, exist, linkFormRequerimiento, modalGenerateLinkFormRequerimiento, isLoading, empleadores, totalempleadores, page, isBusqueda} = this.state;

        let {modalQuickReg, nombresQR, apellidosQR, telefonoQR, tokenQR, rMsjQR, isLoadingModalQR, successModalQR} = this.state;

        let links = {
            ElDNI: 'https://dniperu.com/buscar-dni-nombres-apellidos/',
            SIS: 'http://app.sis.gob.pe/SisConsultaEnLinea/Consulta/frmConsultaEnLinea.aspx',
            RUN: 'https://consulta.servel.cl'
        };

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <section>

                <ModalGenerateFormRequerimiento
                    changeViewModal={this.changeViewModal}
                    view={viewModalFormRequerimiento}
                    show={modalGenerateLinkFormRequerimiento}
                    close={this.closeModalLinkFormRequerimiento}
                    generate={this.generateLinkFormRequerimiento}
                    delete={this.deleteLinkFormRequerimiento}
                    linkFormRequerimiento={linkFormRequerimiento}
                    exist={exist}
                />

                <EmpleadoresSearchSideBar
                    data={this.state}
                    sideBar={sideBar}
                    handleOpenSideBar={this.openSideBar}
                    handleChange={this.handleChange}
                    buscar={this.buscar}
                    limpiar={this.limpiar}
                />

                <div className="row mx-0 pt-4">
                    <IndexButton
                        type={"search"}
                        handleOpenSideBar={this.openSideBar}
                    />

                    <IndexButton
                        type={"create"}
                        route={"/empleadores/new"}
                    />

                    <div className="col-12 col-md-auto px-1 my-2 my-md-0">
                        <ButtonAccess
                            url={links.ElDNI}
                            buttonColor={"green"}
                            icon={"far fa-id-card"}
                            title={"Buscar por DNI peruano"}
                        />
                    </div>

                    <div className="col-12 col-md-auto px-1 my-2 my-md-0">
                        <ButtonAccess
                            url={links.RUN}
                            buttonColor={"skblue"}
                            icon={"fas fa-chalkboard-teacher"}
                            title={"Busca por RUN chileno"}
                        />
                    </div>
                </div>

                <section className="fichas">
                    <div className="container-fluid pb-5 mt-4">

                        <div className="d-flex row mb-4 mx-0">
                            <Flyer
                                content={totalempleadores + " empleadores listados"}
                            ></Flyer>
                        </div>

                        <>
                            { empleadores.length ?
                                <div className="d-flex flex-wrap">
                                    <EmpleadoresTable
                                        url={url}
                                        handleRefresh={this.refreshEmpleadores}
                                        empleadores={empleadores}
                                        active={this.active}
                                        eliminar={this.eliminar}
                                        linkFormRequerimiento={this.linkFormRequerimiento}
                                        total={totalempleadores}
                                        page={page}
                                        changePagination={this.changePagination}
                                        busqueda={isBusqueda}
                                        paginationSearch={this.paginationSearch}
                                    />
                                </div>
                                : (
                                    <NoDataLabel msj={textoresultados} />
                                )}
                        </>

                    </div>
                </section>

            </section>
        )
    }
}

export default withRouter(EmpleadoresIndex);

import React, { Component } from "react";
import Swal from "sweetalert2";
import LoadingScreen from "../Components/loadingScreen.jsx";
import Flyer from "../Components/flyer.jsx";
import IndexButton from "../Components/indexButton.jsx";
import NoDataLabel from "../Components/noDatalabel.jsx";
import global from '../../Helpers/constantes.js';
import {ajaxUploadFile} from "../../Functions/General.jsx";
import {showAlert, showAlertConfirmRedirectReactRouter} from '../../Helpers/alerts.js';
import {
    ajaxContratosBuscar,
    ajaxContratosFinalizar,
    ajaxContratosReenviarMailComprobante,
    ajaxContratosReenviarMailTrabajador,
    ajaxSetVerifIngresoContrato,
    ajaxRefreshContratos,
    ajaxContratosGetDataInicial
} from "../../Functions/Contratos.jsx";
import ContratosSearchSideBar from "./contratosSearchSideBar.jsx";
import ContratosTable from "./contratosTable.jsx";
import ModalDownloadDocs from "./Components/modalDownloadDocs.jsx";
import {useNavigate, useParams} from "react-router-dom";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class ContratosIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            sideBar: false,

            contratos: [],
            usuariointerno: '',
            totalcontratos: [],
            page: '',
            pageOfItems: [],
            codigo: '',
            empleador: '',
            telefonoEmpleador:'',
            trabajador: '',
            telefonoTrabajador:'',
            fechainiciogarantia: '',
            fechacreado: '',
            fechacreadodesde: '',
            fechacreadohasta: '',
            fechainiciolabores: '',
            fecha: '',
            requerimiento: '',
            actividad: '',
            comprobante: '',
            vigente: '',
            actividades: [],
            tiposcontratos: [],
            responsables: [],
            formaspagos: [],
            tipocontrato: '',
            responsable: '',
            tipopago: '',
            montototal: '',
            textoresultados: '',

            comprobanteExterno: '',
            isUploadingComprobanteExterno: false,
            showModalComprobanteExterno: false,
            isLoading: true,
            busqueda: false,
            access: false,
        };

        this.openSideBar = this.openSideBar.bind(this);

        this.onChangePage = this.onChangePage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.buscar = this.buscar.bind(this);
        this.limpiar = this.limpiar.bind(this);
        this.finalizar = this.finalizar.bind(this);
        this.reenviarMailContratoComprobante = this.reenviarMailContratoComprobante.bind(this);
        this.reenviarMailTrabajador = this.reenviarMailTrabajador.bind(this);
        this.changePaginations = this.changePaginations.bind(this);
        this.paginationSearch = this.paginationSearch.bind(this);
    }

    openSideBar(e, condition) {
        this.setState({sideBar: condition});
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    setBusqueda(condition){
        this.setState({busqueda: condition});
    }

    limpiar(){

        this.setState({
            codigo: '',
            empleador: '',
            telefonoEmpleador:'',
            trabajador: '',
            telefonoTrabajador:'',
            fechainiciogarantia: '',
            fechacreado: '',
            fechacreadodesde: '',
            fechacreadohasta: '',
            fechainiciolabores: '',
            fecha: '',
            requerimiento: '',
            actividad: '',
            vigente: '',
            tipocontrato: '',
            responsable: '',
            usuariointerno: '',
            tipopago: '',
            montototal: '',
        });
        this.setBusqueda(false);

        this.refreshContratos();

    }

    finalizar(e, id){

        e.preventDefault();

        Swal.fire({
            text: "¿Está seguro que desea culminar el contrato?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxContratosFinalizar(id).then(r => {
                    if(r.code === 200){
                        this.refreshContratos();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/contratos', navigate);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                }).catch(function (error) {

                });
            }
        });
    }

    reenviarMailContratoComprobante(e, id){

        e.preventDefault();

        Swal.fire({
            text: "¿Está seguro que deseas reenviar un correo con los adjuntos al empleador?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxContratosReenviarMailComprobante(id).then(r => {
                    if(r.code === 200){
                        showAlert('exito', r.msj);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                }).catch(function (error) {

                });
            }
        });

    }

    setVerifIngreso(e,id,condition){
        const text = condition === 1 ? 'ASISTIÓ' : 'NO ASISTIÓ';

        ajaxSetVerifIngresoContrato(id, condition).then(r => {
            if(r.code === 200){
                showAlert('exito', r.msj);
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        })

    }

    reenviarMailTrabajador(e, id){

        e.preventDefault();

        Swal.fire({
            text: "¿Está seguro que deseas reenviar un correo con los adjuntos al trabajador?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxContratosReenviarMailTrabajador(id).then(r => {
                    if(r.code === 200){
                        showAlert('exito', r.msj);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                }).catch(function (error) {

                });
            }
        });

    }

    onChangePage(pageOfItems) {
        this.setState({ pageOfItems: pageOfItems });
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

        }else if(tipo == 'comprobanteExterno'){

            let reader = new FileReader();

            reader.readAsDataURL(e.target.files[0]);

            reader.onload = (e) => {
                this.actionUploadFile(reader.result, campo, 'comprobanteExterno');
            };

        }else{
            const input = e.target;
            const start = input.selectionStart;
            const end = input.selectionEnd;

            this.setState({
                [e.target.name]: e.target.value.toUpperCase()
            }, () =>  (start == undefined && end == undefined) ? '' : input.setSelectionRange(start, end) );
        }
    }

    actionUploadFile(file, campo, tipoarchivo = null){

        let key = 'loading'+ campo;

        this.setState({ [key]: true, isUploadingComprobanteExterno: true });

        ajaxUploadFile(file, campo, tipoarchivo).then(r => {
            if(r.code === 200){
                this.setState({
                    [key]: false,
                    [campo]: r.result,
                    isUploadingComprobanteExterno: false
                });
            }else if(r.code === 500){
                this.setState({
                    [key]: false,
                    [campo]: '',
                    isUploadingComprobanteExterno: false
                });
                showAlert('error', r.msj);
            }
        }).catch(function (error) {

        });
    }

    getDataInicial(){

        ajaxContratosGetDataInicial().then(r => {
            this.setState({
                actividades: r.actividades,
                tiposcontratos: r.tiposcontratos,
                responsables:r.responsables,
                formaspagos: r.formaspagos,
                access: r.accessCom,
            });
        })
    }

    refreshContratos(){
        this.setLoading(true);
        ajaxRefreshContratos(0).then(r => {
            this.setState({
                page: r.page,
                contratos: r.contratos,
                totalcontratos: r.total,
                textoresultados: r.textoresultados,
            });
            this.setLoading(false);
        })
    }

    changePaginations(page){
        let pagina = parseInt(page.selected) + 1;
        let offset = (pagina - 1) * 10 ;

        ajaxRefreshContratos(offset).then(r => {
            this.setState({contratos: []});
            this.setState({
                page: pagina,
                contratos: r.contratos,
                totalcontratos: r.total,
                textoresultados: r.textoresultados,
            });
        })
    }

    paginationSearch(page){
        let pagina = parseInt(page.selected) + 1;
        let offset = (pagina - 1) * 10 ;

        ajaxContratosBuscar(this.state, offset).then(r => {
            if(r.code === 200){
                if(r.contratos){
                    this.setState({contratos: []});
                    this.setState({
                        contratos: r.contratos,
                        totalcontratos: r.total,
                        textoresultados: r.textoresultados,
                        page: pagina
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

    buscar(e){

        this.setLoading(true);
        this.setBusqueda(true);
        let offset = 0;

        ajaxContratosBuscar(this.state, offset).then(r => {
            if(r.code === 200){
                if(r.contratos){
                    this.setState({
                        contratos: r.contratos,
                        totalcontratos: r.total,
                        textoresultados: r.textoresultados,
                        page: r.page
                    });
                    this.setLoading(false);
                }else{
                    this.setLoading(false);
                }
                this.openSideBar(e,false);
            }else if(r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        }).catch( function (error) {
            if (error.response.status === 422){
                this.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    componentDidMount(){
        this.getDataInicial();
        this.refreshContratos();
    }

    render() {
        let {url, sideBar, busqueda, access, contratos, textoresultados, totalcontratos, page, isLoading, comprobanteExterno, isUploadingComprobanteExterno, showModalComprobanteExterno} = this.state;

        let links = {
            ElDNI: 'https://dniperu.com/buscar-dni-nombres-apellidos/',
            SIS: 'http://app.sis.gob.pe/SisConsultaEnLinea/Consulta/frmConsultaEnLinea.aspx',
            RUN: 'https://consulta.servel.cl'
        };

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <section>

                <ContratosSearchSideBar
                    sideBar={sideBar}
                    data={this.state}
                    handleChange={this.handleChange}
                    buscar={this.buscar}
                    limpiar={this.limpiar}
                    handleOpenSideBar={this.openSideBar}
                />

                <div className="row mx-0 pt-4">
                    <IndexButton
                        type={"search"}
                        handleOpenSideBar={this.openSideBar}
                    />

                    <IndexButton
                        type={"create"}
                        route={"/contratos/new"}
                    />

                    <div className="col-12 col-md-auto px-1 my-2 my-md-0">
                        <ModalDownloadDocs url={url}/>
                    </div>
                </div>

                <section className="fichas">
                    <div className="container-fluid pb-5 mt-4">
                        <div className="d-flex row mb-4 mx-0">
                            <Flyer content={totalcontratos + " contratos listados"} ></Flyer>
                        </div>
                    </div>

                    <>
                        {contratos.length ?
                            <ContratosTable
                                access={access}
                                url={url}
                                busqueda={busqueda}
                                contratos={contratos}
                                total={totalcontratos}
                                page={page}
                                isUploadingComprobanteExterno={isUploadingComprobanteExterno}
                                comprobanteExterno={comprobanteExterno}
                                showModalComprobanteExterno={showModalComprobanteExterno}
                                changePagination={this.changePaginations}
                                paginationSearch={this.paginationSearch}
                                finalizar={this.finalizar}
                                reenviarMail={this.reenviarMailContratoComprobante}
                                reenviarMailTrabajador={this.reenviarMailTrabajador}
                                transformFile={this.transformFile}
                                handleChange={this.handleChange}
                                handleUpload={this.handleUpload}
                                setShowModalComprobanteExterno={this.setShowModalComprobanteExterno}
                                setVerifIngreso={this.setVerifIngreso}
                            />
                            :
                            <NoDataLabel msj={textoresultados}/>
                        }
                    </>
                </section>

            </section>
        )
    }
}

export default withRouter(ContratosIndex);

import React, { Component } from "react";
import {useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import {Tab, Tabs} from "react-bootstrap";
import "react-phone-input-2/lib/style.css";
import TitleLabel from "../Components/titleLabel.jsx";

import {setDefaults} from "react-geocode";
import {
    ajaxGetDepartamentosByNacionalidad,
    ajaxSearchDistrito,
    ajaxSearchUser,
    ajaxVerificarNumero, formButtons, ajaxSaveEstado
} from "../../Functions/General.jsx";
import {ajaxEmpleadoresGetData, ajaxEmpleadoresNew} from "../../Functions/Empleadores.jsx";
import {modalCancelar, showAlertConfirmRedirectReactRouter, showAlert} from "../../Helpers/alerts.js";

import EmpleadorDatos from "./Tabs/EmpleadorDatos.jsx";
import Domicilio from "./Components/Domicilio/domicilio.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";

setDefaults({
    key: 'AIzaSyAbVhSaeUIp2VGe22KvQDqBqLjJ3Ucl9s8', // Your API key here.
    language: "es", // Default language for responses.
    region: "pe", // Default region for responses.
});

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class EmpleadoresNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            show: false,
            paispedido: 54,
            tipopersona: '',
            nombres: '',
            apellidos: '',
            correo: '',
            telefono: '',
            searchingNumber: false,
            estatusNumber: '',
            searchingDocumentoID: false,
            estatusDocumentoID: '',
            tipodocumento: 1,
            documento:'',
            emptyDocumentoID: true,
            nombreempresa: '',
            rucempresa:'',
            estadocivil: '',
            fechanacimiento: '',
            paisnacimiento: '',
            departamentonacimiento: '',
            lugarnacimiento: '',
            observaciones: '',
            responsable: '',
            responsables: [],
            tipospersonas: [],
            tiposdocumentos: [],
            estadosciviles:[],
            paises: [],
            departamentos: [],
            domicilios: [],
            search: '',
            usuarioid: '',
            isLoading: false,
            isLoadingSearch: false,
            resultUpload: {isCreated: false, msj: null, type: null, isLoading: false},
        };

        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addDomicilio = this.addDomicilio.bind(this);
        this.editDomicilio = this.editDomicilio.bind(this);
        this.removeDomicilio = this.removeDomicilio.bind(this);
        this.cleanSearch = this.cleanSearch.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.loadDistritoOptions = this.loadDistritoOptions.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.getDepartamentosByNacionalidad = this.getDepartamentosByNacionalidad.bind(this);
        this.saveState = this.saveState.bind(this);
        this.cleanModal = this.cleanModal.bind(this);
    }

    saveState(e, paisId, newEstado){
        ajaxSaveEstado(paisId, newEstado).then(r => {
            if (r.code === 200){
                this.setState({
                    departamentonacimiento: r.estadoId,
                    lugarnacimiento: r.estadoNombre,
                    departamentos: r.estados,
                    resultUpload: {isCreated: true, type: 'fas fa-check-circle', msj: 'Estado creado exitosamente', isLoading: false},
                });
            }else{
                this.setState({
                    resultUpload: {isCreated: false, msj: 'No se creo el estado', type: 'fas fa-times-circle', isLoading: false},
                });
            }
        }).catch(function (error) {
            this.setState({
                resultUpload: {isCreated: false, msj: 'No se creo el estado', type: 'fas fa-times-circle', isLoading: false},
            });
        });
    }

    cleanModal(){
        this.setState({
            resultUpload: {isCreated: false, msj: null, type: null, isLoading: false},
        });
    }

    setLoadingSearch(condition){
        this.setState({isLoadingSearch: condition});
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/empleadores', navigate);
    }

    addDomicilio(data){
        this.setState({
            domicilios: this.state.domicilios.concat(data)
        });
    };

    editDomicilio(data){

        const domicilios = this.state.domicilios;

        const index = domicilios.findIndex(dom => dom.id === data.id);

        domicilios[index] = data;

        this.setState({
            domicilios: domicilios
        });
    };

    removeDomicilio(id){
        this.setState({
            domicilios: this.state.domicilios.filter((s, sidx) => id !== sidx)
        });
    };

    handleChange(e, tipo = '', campo = '', campo2 = '') {

        if(tipo == 'time'){
            this.setState({
                [campo]: e.target.value
            });
        }else if (tipo == 'codigoTelefonico'){

            this.setState({
                [campo] : e
            }, this.verificarDuplicado(e, 'phone'));
        }else if (tipo == 'numeroDocumento'){
            this.setState({
                [campo] : e.target.value
            }, this.verificarDuplicado(e.target.value, 'ID'));
        }else if(tipo == 'tipodocumento') {

            this.setState({
                tipodocumento: e.target.value
            }, this.setPais(e.target.value));

        }else if(tipo == 'numerocelular') {

            this.setState({
                telefono: e.target.value
            });

        }else if(tipo == 'pais') {

            this.setState({
                paisnacimiento: e.target.value,
            }, this.getDepartamentosByNacionalidad(e.target.value));

        }else if(tipo == 'departamento') {

            this.setState({
                departamentonacimiento: e.target.value
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

    getDepartamentosByNacionalidad(paisNacimiento){
        ajaxGetDepartamentosByNacionalidad(paisNacimiento).then(r => {
            if(r.code === 200){
                this.setState({departamentos: r.departamentos});
            }
        }).then( function (error) {

        });
    }

    cleanSearch(){

        this.setState({
            tipopersona: '',
            nombres: '',
            paispedido: 54,
            apellidos: '',
            correo: '',
            telefono: '',
            tipodocumento: 1,
            documento:'',
            nombreempresa: '',
            rucempresa:'',
            estadocivil: 1,
            fechanacimiento: '',
            paisnacimiento: 54,
            departamentonacimiento: 15,
            lugarnacimiento: '',
            observaciones: '',
            domicilios: [{ id: '', distrito: '', direccion: '', latitud: '', longitud: '', activo: 1 }],
            search: '',
            usuarioid: '',
            isLoading: false,
        });

        this.setLoadingSearch(false);

    }

    searchUser(e){

        e.preventDefault();

        this.setLoadingSearch(true);
        let self = this;

        ajaxSearchUser(this.state.search).then(r => {
            if(r.code === 200){
                this.setLoadingSearch(false);

                if(r.empleador){
                    showAlert('error', 'El usuario ya tiene perfil de empleador');
                }else{
                    this.setState({
                        usuarioid: r.usuario.id,
                        nombres: r.usuario.nombres,
                        apellidos: r.usuario.apellidos,
                        correo: r.usuario.correo,
                        telefono: r.usuario.telefono,
                        tipodocumento: r.usuario.tipodocumento_id,
                        documento: r.usuario.numero_documento,
                        estadocivil: r.usuario.estadocivil_id,
                        fechanacimiento: r.usuario.fecha_nacimiento ? moment(r.usuario.fecha_nacimiento,"YYYY-MM-DD").toDate() : '',
                        paisnacimiento: r.usuario.paisnacimiento_id,
                        departamentonacimiento: r.usuario.departamentonacimiento_id,
                        lugarnacimiento: r.usuario.lugar_nacimiento
                    });
                }
            }else if(r.code === 500){
                this.setLoadingSearch(false);
                showAlert('error', r.msj);
            }
        }).then( function (error) {
            if (error.response.status === 422){
                self.setLoadingSearch(false);
                showAlert('error', error.response.data);
            }
        });
    }

    save(e){

        e.preventDefault();
        this.setLoading(true);

        ajaxEmpleadoresNew(this.state).then(r => {
            this.setLoading(false);
            if(r.code === 200){
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/empleadores', navigate);
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch( function (error) {
            if (error.response.status == 422){
                this.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    verificarDuplicado(numero, tipo){

        if (tipo == 'phone'){
            this.setState({
                searchingNumber: numero.length > 0 ? true : false,
                estatusNumber: '',
            });
        }else if(tipo == 'ID'){
            this.setState({
                searchingDocumentoID: numero.length > 0 ? true : false,
                estatusDocumentoID: '',
            });
        }

        ajaxVerificarNumero(numero, tipo).then(r => {
            if (tipo == 'phone'){
                this.setState({
                    searchingNumber: false,
                    estatusNumber: numero.length > 0 ? r.estatusNumber : '',
                });
            }else if(tipo == 'ID'){
                this.setState({
                    searchingDocumentoID: false,
                    estatusDocumentoID: numero.length > 0 ? r.estatusDocumentoID : '',
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    setPais(tipodocumento){
        this.setState({paisnacimiento: (tipodocumento == 1 ? 54 : '')});
    }

    getData(){

        this.setLoading(true);

        ajaxEmpleadoresGetData().then(r => {
            if(r.code === 200){
                this.setState({
                    tiposdocumentos: r.tiposdocumentos,
                    estadosciviles: r.estadosciviles,
                    paises: r.paises,
                    departamentos: r.departamentos,
                });
                this.setLoading(false);
            }else if(r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        })
    }

    loadDistritoOptions(search, callback){

        if (!search) {
            callback([]);
        } else {

            setTimeout(() => {
                ajaxSearchDistrito(search, null).then(r => {
                    callback(r.data);
                }).catch((error) => {
                    console.log(error);
                });
            });
        }
    }

    componentDidMount(){
        this.getData();
    }

    render() {

        let {show, keyTab, isLoading, domicilios} = this.state;
        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <>
                <TitleLabel content={'Agregar nuevo empleador'} />

                <section className="bertha-form">
                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">
                            <Tab eventKey="tab1" title="Datos">
                                <EmpleadorDatos
                                    data={this.state}
                                    handleChange={this.handleChange}
                                    cleanModal={this.cleanModal}
                                    saveState={this.saveState}
                                    view={'new'}
                                />
                            </Tab>

                            <Tab eventKey="tab2" title="Domicilios">
                                <Domicilio domicilios={domicilios} add={this.addDomicilio} edit={this.editDomicilio} delete={this.removeDomicilio} />
                            </Tab>

                        </Tabs>

                        <>{formButtons(isLoading, 'new', (this.cancelar), null, null)}</>
                    </form>
                </section>

            </>
        )
    }

}

export default withRouter(EmpleadoresNew);

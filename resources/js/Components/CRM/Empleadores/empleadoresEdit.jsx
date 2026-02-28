import React, { Component } from "react";
import {useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import {Tab, Tabs} from "react-bootstrap";
import "react-phone-input-2/lib/style.css";
import TitleLabel from "../Components/titleLabel.jsx";
import EmpleadorDatos from "./Tabs/EmpleadorDatos.jsx";
import {setDefaults, fromAddress} from "react-geocode";
import {
    ajaxGetDepartamentosByNacionalidad,
    ajaxSearchDistrito,
    ajaxVerificarNumero, formButtons, ajaxSaveEstado
} from "../../Functions/General.jsx";
import {
    ajaxEmpleadoresEdit,
    ajaxEmpleadoresGet,
    ajaxEmpleadoresGetData,
} from "../../Functions/Empleadores.jsx";
import Domicilio from "./Components/Domicilio/domicilio.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";
import {modalCancelar, showAlertConfirmRedirectReactRouter, showAlert} from "../../Helpers/alerts.js";

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

class EmpleadoresEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            show: props.show,
            id: props.params.id,
            paispedido: '',
            tipopersona: '',
            nombres: '',
            apellidos: '',
            correo: '',
            telefono: '',
            tipodocumento: '',
            documento:'',
            emptyDocumentoID: false,
            nombreempresa: '',
            rucempresa:'',
            estadocivil: '',
            fechanacimiento: '',
            paisnacimiento:'',
            departamentonacimiento: '',
            lugarnacimiento: '',
            observaciones: '',
            foto: '',
            responsable: '',
            responsables: [],
            tipospersonas: [],
            tiposdocumentos: [],
            estadosciviles:[],
            paises: [],
            departamentos: [],
            domicilios: [],
            isLoading: false,
            resultUpload: {isCreated: false, msj: null, type: null, isLoading: false},
        };
        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addDomicilio = this.addDomicilio.bind(this);
        this.editDomicilio = this.editDomicilio.bind(this);
        this.removeDomicilio = this.removeDomicilio.bind(this);
        this.buscarLatLng = this.buscarLatLng.bind(this);
        this.loadDistritoOptions = this.loadDistritoOptions.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.getDepartamentosByNacionalidad = this.getDepartamentosByNacionalidad.bind(this);
        this.saveState = this.saveState.bind(this);
        this.cleanModal = this.cleanModal.bind(this);
    }
    setLoading(condition){
        this.setState({
            isLoading: condition
        });
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

    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/empleadores', navigate)
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

    removeDomicilio(id, idDom){
        this.setState({
            domicilios: this.state.domicilios.filter((s, sidx) => id !== sidx)
        });
    };

    handleChange(e, tipo = '', campo = '', campo2='') {

        //,

        if(tipo === 'time'){

            this.setState({
                [campo]: e.target.value
            });

        }else if (tipo === 'codigoTelefonico'){
            this.setState({
                [campo] : e
            });
        }else if (tipo === 'numeroDocumento'){
            this.setState({
                [campo] : e.target.value
            }, (this.state.emptyDocumentoID === true ? this.verificarDuplicado(e.target.value, 'ID') : null));
        }else if(tipo === 'tipodocumento') {
            const value = e.target.value;
            this.setState(
                { tipodocumento: value },
                () => this.setPais(value)
            );
        }else if(tipo === 'pais') {
            this.setState(
                { paisnacimiento: e.target.value, },
                () => this.getDepartamentosByNacionalidad(e.target.value)
            );
        }else if(tipo === 'departamento') {

            this.setState({
                departamentonacimiento: e.target.value
            });

        }else{
            const input = e.target;
            const start = input.selectionStart;
            const end = input.selectionEnd;

            this.setState({
                [e.target.name]: e.target.value.toUpperCase()
            }, () =>  (start === undefined && end === undefined) ? '' : input.setSelectionRange(start, end) );
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

    verificarDuplicado(numero, tipo){

        if (tipo === 'phone'){
            this.setState({
                searchingNumber: numero.length > 0,
                estatusNumber: '',
            });
        }else if(tipo === 'ID'){
            this.setState({
                searchingDocumentoID: numero.length > 0,
                estatusDocumentoID: '',
            });
        }

        ajaxVerificarNumero(numero, tipo).then(r => {
            if (tipo === 'phone'){
                this.setState({
                    searchingNumber: false,
                    estatusNumber: numero.length > 0 ? r.estatusNumber : null,
                });
            }else if(tipo === 'ID'){
                this.setState({
                    searchingDocumentoID: false,
                    estatusDocumentoID: numero.length > 0 ? r.estatusDocumentoID : null,
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    buscarLatLng(distrito, direccion, key){

        if(distrito && direccion){

            let dis = distrito.label.split(" - ", 3);

            let search = direccion + ', ' + dis[0];

            fromAddress(search).then(
                r => {

                    let {domicilios} = this.state;

                    let copyDom = domicilios.slice();

                    const { lat, lng } = r.results[0].geometry.location;

                    copyDom[key].latitud = lat;
                    copyDom[key].longitud = lng;

                    this.setState({ domicilios: copyDom});

                },
                error => {
                    showAlert('error', 'No existe data para la dirección ingresada. Intente especificar mejor la busqueda');
                    console.error(error);
                }
            );

        }else{
            showAlert('error', 'Complete el distrito y direccion para buscar y validar domicilio');
        }

    }

    save(e){

        e.preventDefault();

        this.setLoading(true);
        let self = this;

        ajaxEmpleadoresEdit(this.state).then(r => {
            if(r.code === 200){
                this.setLoading(false);
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/empleadores', navigate);
            }else if(r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        }).then( function (error) {
            if (error.response.status === 422){
                self.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    setPais(tipodocumento){
        this.setState({paisnacimiento: (tipodocumento === 1 ? 54 : '')})
    }

    getData(){

        ajaxEmpleadoresGetData().then(r => {
            if(r.code === 200){
                this.setState({
                    tiposdocumentos: r.tiposdocumentos,
                    estadosciviles: r.estadosciviles,
                    paises: r.paises,
                });
            }else if(r.code === 500){
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

        this.setLoading(true);

        this.getData();

        ajaxEmpleadoresGet(this.state.id).then(r => {
            if(r.code === 200){
                this.setState({
                    nombres: r.data.nombres,
                    apellidos: r.data.apellidos,
                    paispedido: r.data.pais_pedido_id,
                    correo: r.data.correo,
                    telefono: r.data.telefono,
                    tipodocumento: r.data.tipodocumento_id,
                    documento: r.data.numero_documento,
                    emptyDocumentoID: r.data.numero_documento ? false : true,
                    nombreempresa: r.data.nombreempresa,
                    rucempresa: r.data.rucempresa,
                    estadocivil: r.data.estadocivil_id,
                    fechanacimiento: r.data.fecha_nacimiento ? (r.data.fecha_nacimiento) : '',
                    paisnacimiento: r.data.paisnacimiento_id ? (r.data.paisnacimiento_id).toString() : '',
                    departamentonacimiento: r.data.departamentonacimiento_id,
                    departamentos: r.departamentos,
                    lugarnacimiento: r.data.lugar_nacimiento,
                    observaciones: r.data.observaciones,
                    domicilios: r.domicilios,
                });
                this.setLoading(false);
            }else if(r.code === 500){
                this.setLoading(false);
            }
        })
    }


    render() {

        let {show, isLoading, domicilios} = this.state;
        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return (

            <>
                <TitleLabel content={(Boolean(show) ? 'Ver' : 'Editar') + ' empleador'}/>

                <section className="bertha-form">
                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey="tab1" className="tabs-pink nav-white-style">

                            <Tab eventKey="tab1" title="Datos">
                                <EmpleadorDatos
                                    data={this.state}
                                    handleChange={this.handleChange}
                                    cleanModal={this.cleanModal}
                                    saveState={this.saveState}
                                    show={show}
                                    view={'edit'}
                                />
                            </Tab>

                            <Tab eventKey="tab2" title="Domicilios">
                                <Domicilio domicilios={domicilios} add={this.addDomicilio} edit={this.editDomicilio} delete={this.removeDomicilio} />
                            </Tab>

                        </Tabs>

                        <>{formButtons(isLoading, 'edit', null, '/empleadores', null)}</>

                    </form>
                </section>

            </>

        );
    }

}

export default withRouter(EmpleadoresEdit);

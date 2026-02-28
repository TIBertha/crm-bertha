import React, { Component } from 'react';
import {Tab, Tabs} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import {useParams, useNavigate } from "react-router-dom";

import {formButtons} from "../../Functions/General.jsx";

import TitleLabel from "../Components/titleLabel.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";

import {
    modalCancelar,
    showAlert,
    showAlertConfirmRedirectReactRouter
} from "../../Helpers/alerts.js";
import {ajaxReclamosGetData, ajaxReclamosEdit, ajaxReclamosGet} from "../../Functions/Reclamos.jsx";

import DatosReclamos from './Tabs/datosReclamos.jsx';

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class ReclamosEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            id: props.params.id,
            show: props.show,
            nombres: '',
            apellidos: '',
            dni: '',
            domicilio: '',
            correo: '',
            telefono: '',
            nombreapoderado: '',
            tipobien: '',
            tiporeclamo: '',
            fechaincidente: '',
            lugarincidente: '',
            detalle: '',
            pedido: '',
            tiposbienes: [],
            tiposreclamos: [],
            isLoading: false,
            keyTab: 'tab1',
            //Respuesta a Reclamo
            respuesta: '',
            respuestaFecha: '',
            respuestaAdjuntos: [],
            fechaEnvioRespuesta: '',
            diasRestantes: '',
        };

        this.save = this.save.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/reclamos', navigate);
    }

    handleChange(e, tipo = '') {
        if(tipo == 'fi'){
            this.setState({
                fechaincidente: e
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

    save(e){

        e.preventDefault();

        this.setLoading(true);
        let self = this;

        ajaxReclamosEdit(this.state).then(r => {
            this.setLoading(false);
            if(r.code === 200){
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/reclamos', navigate);
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch( function (error) {
            if (error.response.status == 422){
                self.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    getData(){
        this.setLoading(true);

        ajaxReclamosGetData().then(r => {
            if(r.code === 200){
                this.setState({
                    tiposbienes: r.tiposbienes,
                    tiposreclamos: r.tiposreclamos,
                });
                this.setLoading(false);
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        });
    }

    componentDidMount() {

        this.getData();

        let {id} = this.state;

        this.setLoading(true);

        ajaxReclamosGet(id).then(r => {
            if(r.code === 200){
                this.setState({
                    nombres: r.data.nombres,
                    apellidos: r.data.apellidos,
                    dni: r.data.dni,
                    domicilio: r.data.direccion,
                    correo: r.data.correo,
                    telefono: r.data.telefono,
                    nombreapoderado: r.data.nombre_apoderado,
                    tipobien: r.data.tipobien_id,
                    tiporeclamo: r.data.tiporeclamo_id,
                    fechaincidente: moment(r.data.fecha_incidente, "YYYY-MM-DD HH:mm:ss").toDate(),
                    lugarincidente: r.data.lugar_incidente,
                    detalle: r.data.detalle,
                    pedido: r.data.pedido,
                    respuesta: r.data.respuesta ? r.data.respuesta : '',
                    respuestaAdjuntos: r.respuestaAdjuntos ? r.respuestaAdjuntos : [],
                    fechaEnvioRespuesta: r.fechaEnvioRespuesta ? r.fechaEnvioRespuesta : '',
                    diasRestantes: r.diasRestantes ? r.diasRestantes : '',
                });
                this.setLoading(false);
            }else if(r.code === 500){
                console.log(r.msj);
            }
        });
    }

    render() {

        let {isLoading, keyTab, show, fechaEnvioRespuesta, diasRestantes} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        let estiloAlertaDiasRestantes = 'alert-primary';

        if ((diasRestantes >= 18) && (diasRestantes <= 30)){
            estiloAlertaDiasRestantes = 'alert-success';
        }else if ((diasRestantes >= 10) && (diasRestantes <= 17)){
            estiloAlertaDiasRestantes = 'alert-warning';
        }else if ((diasRestantes >= 0) && (diasRestantes <= 9)){
            estiloAlertaDiasRestantes = 'alert-danger';
        }

        return (
            <>
                <TitleLabel content={'Editar reclamo'} />

                <section className="bertha-form">

                    {fechaEnvioRespuesta ?
                        <div className="alert alert-success mt-10 mb-10" role="alert">
                            {'Se envio el correo de respuesta en la fecha: ' + fechaEnvioRespuesta}
                        </div>
                        :
                        <>
                            {((diasRestantes <= 30) && (diasRestantes >= 0)) ?
                                <div className={'alert ' + estiloAlertaDiasRestantes + ' mt-10 mb-10'} role="alert">
                                    {'Quedán ' + diasRestantes + (diasRestantes != 1 ? ' días' : ' día') + ' para responder.'}
                                </div>
                                :
                                <div className="alert alert-secondary mt-10 mb-10" role="alert">
                                    Ya acabo el limite de días. No se envió ningún correo.
                                </div>
                            }
                        </>
                    }

                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">
                            <Tab eventKey="tab1" title="Datos">
                                <DatosReclamos
                                    data={this.state}
                                    handleChange={this.handleChange}
                                />
                            </Tab>
                        </Tabs>

                        <>{formButtons(isLoading, 'edit', null, '/reclamos', null)}</>

                    </form>
                </section>
            </>
        )
    }
}

export default withRouter(ReclamosEdit);

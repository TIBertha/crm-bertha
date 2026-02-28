import React, { Component } from 'react';
import {useParams, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import {Tab, Tabs} from "react-bootstrap";
import moment from "moment";

import {formButtons} from "../../Functions/General.jsx";

import TitleLabel from "../Components/titleLabel.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";

import {showAlert, showAlertConfirmRedirectReactRouter} from "../../Helpers/alerts.js";
import {ajaxUploadFile} from "../../Functions/General.jsx";
import {
    ajaxAdministradoresEdit,
    ajaxAdministradoresGet,
    ajaxAdministradoresGetData
} from "../../Functions/Administrador.jsx";

import DatosAdmin from "./Tabs/datosAdmin.jsx";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}


class AdminEdit extends Component{
    constructor(props) {
        super(props);

        this.state = {
            url: props.url,
            id: props.params.id,
            foto: '',
            nombres: '',
            apellidos: '',
            fechaNacimiento: '',
            paisNacimiento: '',
            paises: [],
            nacionalidad: '',
            nacionalidades: [],
            tipoDocumento: '',
            tiposDocumento: [],
            numeroDocumento: '',
            correo: '',
            telefono: '',
            domicilio: '',
            ubicacion: '',
            ubicaciones: [],
            cargo: '',
            cargos: [],
            distrito_id: '',
            sueldo: '',
            isLoading: false,
            keyTab: 'tab1',
        };

        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.actionUploadFile = this.actionUploadFile.bind(this);
    }

    setLoading(condition){
        this.setState({
            isLoading: condition
        });
    }

    actionUploadFile(file, campo, tipoarchivo = null, llave = null){

        let key = 'loading'+ campo;

        this.setState({ [key]: true });

        ajaxUploadFile(file,campo,tipoarchivo).then(r => {
            if (r.code === 200){
                this.setState({
                    [key]: false,
                    [campo]: r.result
                });
            }else if(r.code === 500){
                this.setState({
                    [key]: false
                });
                showAlert('error', r.msj)
            }
        }).catch( function (error) {

        });
    }

    handleChange(e, tipo = '', campo = '', campo2 = '', llave = '') {

        if (tipo == 'time'){
            this.setState({
                [campo]: e
            })
        }else if(tipo == 'imagen'){
            let file = e.target.files[0];
            let tipoFile = file.type;

            let options = {
                maxSizeMB: 4,
                maxWidthOrHeight: 800,
                useWebWorker: true
            };

            imageCompression(file, options).then( function(compressedFile){

                let reader = new FileReader();

                reader.readAsDataURL(compressedFile);

                reader.onload = (e) => {
                    this.actionUploadFile(reader.result, campo, null, llave);
                };

            });

        }else if (tipo == 'foto'){
            if(e.target.files.length > 0) {

                let reader = new FileReader();

                reader.onload = (e) => {
                    this.setState({
                        foto: e.target.result
                    })
                };

                reader.readAsDataURL(e.target.files[0]);
            }
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
        let self = this;
        this.setLoading(true);

        let {id} = this.state;

        ajaxAdministradoresEdit(id, this.state).then(r => {
            this.setLoading(false);
            if (r.code === 200) {
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/usu-int', navigate);
            }
        }).catch((error) => {
            this.setLoading(false);
            if (error.response?.status === 422) {
                showAlert('error', error.response.data);
            } else if (error.response?.status === 500) {
                showAlert('error', 'Ocurrió un error interno en el servidor');
            } else {
                showAlert('error', 'Error inesperado');
            }
        });

    }

    getData(){

        ajaxAdministradoresGetData().then(r => {
            if(r.code === 200){
                this.setState({
                    cargos: r.cargos,
                    estadosCiviles: r.estadosCiviles,
                    tiposDocumento: r.tiposDocumento,
                    paises: r.paises,
                    nacionalidades: r.nacionalidades,
                    ubicaciones: r.ubicaciones,
                });
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch( function (error) {

        });
    }

    componentDidMount() {

        this.getData();

        let {id} = this.state;

        this.setLoading(true);

        ajaxAdministradoresGet(id).then(r => {
            if(r.code === 200){
                this.setState({
                    nombres: r.usuario.nombres,
                    apellidos: r.usuario.apellidos,
                    fechaNacimiento: r.usuario.fecha_nacimiento ? moment(r.usuario.fecha_nacimiento,"YYYY-MM-DD").toDate() : '',
                    correo: r.usuario.correo,
                    telefono: r.usuario.telefono,
                    cargo: r.usuario.cargo_id,
                    foto: r.usuario.foto,
                    paisNacimiento: r.usuario.paisnacimiento_id,
                    nacionalidad: r.usuario.nacionalidad_id,
                    tipoDocumento: r.usuario.tipodocumento_id,
                    numeroDocumento : r.usuario.numero_documento,
                    domicilio: r.usuario.domicilio,
                    ubicacion: r.usuario.distrito_id,
                    sueldo: r.usuario.sueldo,
                    isLoading: false
                });
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch( function (error) {

        });

    }

    render() {

        let {keyTab, isLoading} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return (
            <>
                <TitleLabel content={'Editar usuario interno'} />

                <section className="bertha-form">
                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">
                            <Tab eventKey="tab1" title="Datos">
                                <DatosAdmin handleChange={this.handleChange} view={'edit'} data={this.state} />
                            </Tab>
                        </Tabs>

                        <>{formButtons(isLoading, 'edit', null, '/usu-int', null)}</>

                    </form>
                </section>
            </>
        );

    }
}

export default withRouter(AdminEdit);

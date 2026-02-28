import React, { Component } from 'react';
import {useParams, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import {Tab, Tabs} from "react-bootstrap";

import {formButtons} from "../../Functions/General.jsx";

import TitleLabel from "../Components/titleLabel.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";

import {modalCancelar, showAlert, showAlertConfirmRedirectReactRouter} from "../../Helpers/alerts.js";
import {ajaxUploadFile} from "../../Functions/General.jsx";
import {ajaxAdministradoresGetData, ajaxAdministradoresNew} from "../../Functions/Administrador.jsx";

import DatosAdmin from "./Tabs/datosAdmin.jsx";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class AdminNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
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
            cargo: 6,
            cargos: [],
            sueldo: '',
            isLoading: false,
            keyTab: 'tab1',
        };

        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.actionUploadFile = this.actionUploadFile.bind(this);
        this.cancelar = this.cancelar.bind(this);
    }

    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/usu-int', navigate)
    }

    actionUploadFile(file, campo, tipoarchivo = null, llave = null){

        let key = 'loading'+ campo;

        this.setState({ [key]: true });

        ajaxUploadFile(file,campo, tipoarchivo).then(r => {
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

        }else if(tipo == 'foto'){

            let imageFile = e.target.files[0];

            let options = {
                maxSizeMB: 8,
                maxWidthOrHeight: 2000,
                useWebWorker: true
            };

            imageCompression(imageFile, options).then(function (compressedFile) {

                    let reader = new FileReader();

                    reader.readAsDataURL(compressedFile);

                    reader.onload = (e) => {
                        this.setState({
                            [campo]: reader.result
                        })
                    };

                })
                .catch(function (error) {
                    console.log(error.message);
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

        ajaxAdministradoresNew(this.state).then(r => {

            this.setLoading(false);
            if(r.code === 200){
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/usu-int', navigate);
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch(function (error) {
            if (error.response.status == 422){
                this.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    getData(){

        this.setLoading(true);

        ajaxAdministradoresGetData().then(r => {
            if(r.code === 200){
                this.setState({
                    cargos: r.cargos,
                    tiposDocumento: r.tiposDocumento,
                    paises: r.paises,
                    nacionalidades: r.nacionalidades,
                    ubicaciones: r.ubicaciones,
                    isLoading: false
                });
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch( function (error) {

        });
    }

    componentDidMount(){
        this.getData();
    }

    render() {

        let {keyTab, isLoading} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return (
            <>
                <TitleLabel content={'Agregar nuevo usuario interno'} />

                <section className="bertha-form">
                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">
                            <Tab eventKey="tab1" title="Datos">
                                <DatosAdmin handleChange={this.handleChange} view={'new'} data={this.state} />
                            </Tab>
                        </Tabs>

                        <>{formButtons(isLoading, 'new', (this.cancelar), null, null)}</>

                    </form>
                </section>
            </>
        );

    }
}

export default withRouter(AdminNew);

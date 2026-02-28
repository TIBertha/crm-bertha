import React, { Component } from 'react';
import {useParams, useNavigate } from "react-router-dom";
import {filesize} from "filesize";
import moment from "moment";
import axios from "axios";
import {Tab, Tabs} from "react-bootstrap";
import imageCompression from "browser-image-compression";

import {formButtons} from "../../Functions/General.jsx";

import TitleLabel from "../Components/titleLabel.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";

import {modalCancelar, showAlert, showAlertConfirmRedirectReactRouter} from "../../Helpers/alerts.js";
import {getExtensionFromString} from "../../Helpers/strings.js";
import {
    ajaxTestimonialesTrabajadorEdit,
    ajaxTestimonialesTrabajadorGet,
    ajaxTestimonialesTrabajadorGetData,
} from "../../Functions/Testimoniales.jsx";

import DatosTestimonialesTrabajador from "./Tabs/datosTestimonialesTrabajador.jsx";
import { v4 as uuidv4 } from 'uuid';

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class TestimonialesTrabajadorEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.params.id,
            fecha: '',
            trabajadores: [],
            trabajador: '',
            imagenTestimonial: '',
            dispPe: false,
            dispMx: false,
            isLoading: false,
            isLoadingImage: false,

            keyTab: 'tab1',
        };

        this.save = this.save.bind(this);
        this.handleSingularUpload = this.handleSingularUpload.bind(this);
        this.handleSingularDelete = this.handleSingularDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.cancelar = this.cancelar.bind(this);
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/testimoniales-trabajador', navigate)
    }

    handleChange(e, tipo = '', campo = '', istrue = true) {

        if(tipo == 'time'){

            this.setState({
                [campo]: e
            });

        }else if (tipo == 'visibilidad'){
            if (campo == 'dispPe'){
                this.setState({
                    dispPe : istrue
                });
            }else if(campo == 'dispMx'){
                this.setState({
                    dispMx : istrue
                });
            }
        }else if(tipo == 'imagenTestimonial'){
            let imageFile = e.target.files[0];

            let options = {
                maxSizeMB: 1,
                useWebWorker: true
            };

            imageCompression(imageFile, options)
                .then(function (compressedFile) {

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

        }else if(tipo == 'select'){
            this.setState({
                trabajador: e
            })
        }else{

            this.setState({[e.target.name]: e.target.value});

        }

    }

    save(e){

        e.preventDefault();
        this.setLoading(true);
        let self = this;

        let {id}  = this.state;

        ajaxTestimonialesTrabajadorEdit(id, this.state).then(r => {
            this.setLoading(false);
            if(r.code === 200){
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/testimoniales-trabajador', navigate);
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch(function (error) {
            if (error.response.status == 422){
                self.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    handleSingularDelete(e, campo){
        this.setState({
            [campo]: ''
        });
    }

    handleSingularUpload(files, type){
        let token = (new Date()).getTime();
        let data = [];

        this.setState({isLoadingImage: true});
        data = Object.assign({}, this.state.imagenTestimonial);

        const uploadedFiles = files.map(file => ({
            file,
            id: uuidv4(),
            name: token,
            extension: getExtensionFromString(file.name),
            size: filesize(file.size),
            fecha: moment().format('DD/MM/YYYY'),
            progress: 0,
            uploaded: false,
            error: false,
            url: null
        }));

        uploadedFiles.forEach((e) => this.processSingularUpload(e, data, type));
    }

    processSingularUpload(uploadedFile, data, type){

        const datos = new FormData();

        datos.append("file", uploadedFile.file, uploadedFile.name);
        datos.append("fileid", uploadedFile.id);
        datos.append("filesize", uploadedFile.size);
        datos.append("filename", uploadedFile.name);
        datos.append("extension", uploadedFile.extension);
        datos.append("fecha", uploadedFile.fecha);
        datos.append("type", type);

        axios.post("/ajax-testimoniales-adjunto", datos, {})
            .then(res => {

                let r = res.data;

                if(r.code === 200){
                    this.setState({
                        imagenTestimonial: r.adjunto.url,
                        isLoadingImage: false
                    });
                }else if(r.code === 500){
                    showAlert('error', r.msj);
                }
            }).catch(() => {
            showAlert('error', 'Ocurrio un problema al adjuntar archivo. Consulte al administrador');
        });

    }

    getData(){
        this.setLoading(true);

        ajaxTestimonialesTrabajadorGetData().then(r=> {
            if(r.code === 200){
                this.setState({
                    trabajadores: r.trabajadores,
                });
                this.setLoading(false);
            }else if(r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        })
    }

    componentDidMount() {

        let {id} = this.state;

        this.setLoading(true);

        ajaxTestimonialesTrabajadorGet(id).then(r => {
            if(r.code === 200){
                this.setState({
                    fecha: r.fecha ? moment(r.fecha,"YYYY-MM-DD").toDate() : '',
                    trabajador: r.trabajador_id,
                    imagenTestimonial: r.imagen,
                    dispPe: Boolean(r.dispPe),
                    dispMx: Boolean(r.dispMx),
                    trabajadores: r.trabajadores,
                });
                this.setLoading(false);
            }else if(r.code === 500){
                console.log(r.msj);
                this.setLoading(false);
            }
        });
    }

    render() {

        let {isLoading, keyTab} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return (
            <>
                <TitleLabel content={'Editar testimonial[trabajador]'}/>

                <section className="bertha-form">
                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">
                            <Tab eventKey="tab1" title="Datos">
                                <DatosTestimonialesTrabajador
                                    data={this.state}
                                    handleChange={this.handleChange}
                                    handleSingularUpload={this.handleSingularUpload}
                                    handleSingularDelete={this.handleSingularDelete}
                                    view={'edit'}
                                />
                            </Tab>
                        </Tabs>

                        <>{formButtons(isLoading, 'edit', null, '/testimoniales-trabajador', null)}</>

                    </form>
                </section>

            </>
        )

    }
}

export default withRouter(TestimonialesTrabajadorEdit);

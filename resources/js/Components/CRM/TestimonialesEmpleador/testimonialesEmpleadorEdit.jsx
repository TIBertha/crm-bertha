import React, { Component } from 'react';
import {useParams, useNavigate } from "react-router-dom";
import {filesize} from "filesize";
import moment from "moment";
import axios from "axios";
import {Tab, Tabs} from "react-bootstrap";

import {formButtons} from "../../Functions/General.jsx";

import TitleLabel from "../Components/titleLabel.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";

import {modalCancelar, showAlert, showAlertConfirmRedirectReactRouter} from "../../Helpers/alerts.js";
import {getExtensionFromString} from "../../Helpers/strings.js";
import {
    ajaxTestimonialesEmpleadorEdit,
    ajaxTestimonialesEmpleadorGet,
    ajaxTestimonialesEmpleadorGetData,
    ajaxSearchEmpleadores,
} from "../../Functions/Testimoniales.jsx";

import DatosTestimonialesEmpleador from "./Tabs/datosTestimonialesEmpleador.jsx";

import { v4 as uuidv4 } from 'uuid';

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class TestimonialesEmpleadorEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.params.id,
            fecha: '',
            empleador: '',
            empleadores: [],
            nombrecliente: '',
            testimonial: '',
            youtube: '',
            poster: '',
            imagenTestimonialEmpleador: '',
            dispPe: true,
            dispMx: true,
            isLoadingPoster: false,
            isLoadingImagenTestimonial: false,
            limit: 66,
            isLoading: false,

            keyTab: 'tab1',
        };

        this.save = this.save.bind(this);
        this.handleSingularUpload = this.handleSingularUpload.bind(this);
        this.handleSingularDelete = this.handleSingularDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.loadEmpleadoresOptions = this.loadEmpleadoresOptions.bind(this);
        this.cancelar = this.cancelar.bind(this);
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/testimoniales-empleador', navigate)
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
        }else if(tipo == 'texto'){

            const input = e.target;
            const start = input.selectionStart;
            const end = input.selectionEnd;

            this.setState({
                [e.target.name]: e.target.value
            }, () => input.setSelectionRange(start, end));

        }else if(tipo == 'testimonio'){

            let {limit} = this.state;

            const frase = e.target.value.length;
            const input = e.target;
            const start = input.selectionStart;
            const end = input.selectionEnd;

            if(frase <= limit){

                this.setState({
                    [e.target.name]: e.target.value
                }, () => input.setSelectionRange(start, end));

            }

        }else if(tipo == 'empleador'){
            this.setState({
                empleador: e
            })
        }else{

            this.setState({[e.target.name]: e.target.value});

        }

    }

    handleSingularDelete(e, campo){
        this.setState({
            [campo]: ''
        });
    }

    handleSingularUpload(files, type){
        let token = (new Date()).getTime();
        let data = [];

        if(type == 'poster'){
            this.setState({
                isLoadingPoster: true,
                imagenTestimonialEmpleador: '',
            });
            data = Object.assign({}, this.state.poster);
        }else if(type == 'imagenTestimonialEmpleador'){
            this.setState({
                isLoadingImagenTestimonial: true,
                youtube: '',
                poster: '',
            });
            data = Object.assign({}, this.state.imagenTestimonial);
        }

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
                        [type]: r.adjunto.url,
                    });

                    if(type == 'poster'){
                        this.setState({
                            isLoadingPoster: false,
                        });
                    }else if(type == 'imagenTestimonialEmpleador'){
                        this.setState({
                            isLoadingImagenTestimonial: false,
                        });
                    }
                }else if(r.code === 500){
                    showAlert('error', r.msj);
                }
            }).catch(() => {
            showAlert('error', 'Ocurrio un problema al adjuntar archivo. Consulte al administrador');
        });

    }

    save(e){

        e.preventDefault();
        this.setLoading(true);
        let self = this;

        let {id}  = this.state;

        ajaxTestimonialesEmpleadorEdit(id, this.state).then(r => {
            this.setLoading(false);
            if(r.code === 200){
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/testimoniales-empleador', navigate);
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

    getData(){
        this.setLoading(true);

        ajaxTestimonialesEmpleadorGetData().then(r=> {
            if(r.code === 200){
                this.setState({
                    empleadores: r.empleadores,
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

        ajaxTestimonialesEmpleadorGet(id).then(r => {
            if(r.code === 200){
                this.setState({
                    fecha: r.fecha ? moment(r.fecha,"YYYY-MM-DD").toDate() : '',
                    nombrecliente: r.testimonial.nombre_cliente,
                    empleador: r.empleador_id,
                    testimonial: r.testimonial.testimonial,
                    youtube: r.testimonial.video_youtube,
                    poster: r.testimonial.poster,
                    dispPe: r.dispPe,
                    dispMx: r.dispMx,
                    imagenTestimonialEmpleador: r.testimonial.imagen_testimonial,
                });
                this.setLoading(false);
            }else if(r.code === 500){
                console.log(r.msj);
            }
        });
    }

    loadEmpleadoresOptions(search, callback){

        if (!search) {
            callback([]);
        } else {

            setTimeout(() => {

                ajaxSearchEmpleadores(search).then(r => {
                    callback(r.data);
                }).catch(function (error) {
                    console.log(error);
                });

            });
        }
    }

    render() {

        let {isLoading, keyTab} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return (
            <>
                <TitleLabel content={'Editar testimonial[empleador]'}/>

                <section className="bertha-form">
                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">
                            <Tab eventKey="tab1" title="Datos">
                                <DatosTestimonialesEmpleador
                                    data={this.state}
                                    handleChange={this.handleChange}
                                    handleSingularUpload={this.handleSingularUpload}
                                    handleSingularDelete={this.handleSingularDelete}
                                    loadEmpleadoresOptions={this.loadEmpleadoresOptions}
                                    view={'edit'}
                                />
                            </Tab>
                        </Tabs>

                        <>{formButtons(isLoading, 'edit', null, '/testimoniales-empleador', null)}</>

                    </form>
                </section>
            </>
        )
    }
}

export default withRouter(TestimonialesEmpleadorEdit);

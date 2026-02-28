import React, { Component } from 'react';
import {useParams, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import {Tab, Tabs} from "react-bootstrap";
import {filesize} from "filesize";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import {formButtons} from "../../Functions/General.jsx";

import TitleLabel from "../Components/titleLabel.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";

import {
    modalCancelar,
    showAlert,
    showAlertConfirmRedirectReactRouter
} from "../../Helpers/alerts.js";
import {ajaxPrensaGetData, ajaxPrensaGet, ajaxPrensaEdit} from "../../Functions/Prensa.jsx"
import {getExtensionFromString} from "../../Helpers/strings.js"

import DatosPrensa from "./Tabs/datosPrensa.jsx";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class PrensaEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: props.url,
            id: props.params.id,
            tags: [],
            fecha: '',
            fuente: '',
            titulo: '',
            contenido: '',
            imagen: '',
            medio: '',
            medios: [],
            editorState: '',
            isLoadingImagen: false,
            isLoading: false,

            keyTab: 'tab1',
        };
        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleTagClick = this.handleTagClick.bind(this);
        this.cancelar = this.cancelar.bind(this);

        this.handleSingularUpload = this.handleSingularUpload.bind(this);
        this.handleSingularDelete = this.handleSingularDelete.bind(this);
    }
    handleSingularUpload(files, type){

        let token = (new Date()).getTime();
        let data = [];

        this.setState({isLoadingImagen: true});
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
                        imagen: r.adjunto.url,
                        isLoadingImagen: false
                    });
                }else if(r.code === 500){
                    showAlert('error', r.msj);
                }
            }).catch(() => {
            showAlert('error', 'Ocurrio un problema al adjuntar archivo. Consulte al administrador');
        });

    }

    handleSingularDelete(e, campo){
        this.setState({
            [campo]: ''
        });
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    cancelar(){

        const { navigate } = this.props;
        modalCancelar('/prensa', navigate)

    }

    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: newTags });
    }

    handleTagClick(index) {
        console.log('The tag at index ' + index + ' was clicked');
    }

    handleEditorChange(editorState){

        this.setState({editorState})

    }

    handleChange(e, tipo = '', campo = '') {

        if(tipo == 'retrato'){
            let imageFile = e.target.files[0];

            let options = {
                maxSizeMB: 8,
                maxWidthOrHeight: 2000,
                useWebWorker: true
            };

            imageCompression(imageFile, options)
                .then(function (compressedFile) {

                    let reader = new FileReader();

                    reader.readAsDataURL(compressedFile);

                    reader.onload = (ex) => {
                        this.setState({
                            [campo]: reader.result
                        })
                    };

                })
                .catch(function (error) {
                    console.log(error.message);
                });

        }else if(tipo == 'time'){

            this.setState({
                [campo]: e
            });

        }else{

            this.setState({
                [e.target.name]: e.target.value
            });

        }
    }

    save(e){

        e.preventDefault();
        this.setLoading(true);
        let self = this;

        ajaxPrensaEdit(this.state).then(r => {
            this.setLoading(false);
            if(r.code === 200){
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/prensa', navigate);
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

    componentDidMount() {

        let {id} = this.state;

        this.setLoading(true);

        ajaxPrensaGet(id).then(r => {
            if(r.code === 200){
                this.setState({
                    tags: r.blog.tags ? JSON.parse(r.blog.tags) : [],
                    fecha: r.blog.fecha ? moment(r.blog.fecha,"YYYY-MM-DD").toDate() : '',
                    fuente: r.blog.fuente,
                    titulo: r.blog.titulo,
                    imagen: r.blog.imagen,
                    medio: r.blog.medio_id,
                    medios: r.medios,
                    isLoading: false
                });
            }else if(r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        });
    }

    render() {

        let {tags, keyTab, isLoading} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <>
                <TitleLabel content={'Editar artículo de prensa'} />

                <section className="bertha-form">
                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">
                            <Tab eventKey="tab1" title="Datos">
                                <DatosPrensa
                                    view={'edit'}
                                    data={this.state}
                                    show={false}
                                    handleChange={this.handleChange}
                                    handleEditorChange={this.handleEditorChange}
                                    handleSingularUpload={this.handleSingularUpload}
                                    handleSingularDelete={this.handleSingularDelete}
                                    handleAddition={this.handleAddition}
                                    handleDrag={this.handleDrag}
                                    handleTagClick={this.handleTagClick}
                                    handleDelete={this.handleDelete}
                                />
                            </Tab>
                        </Tabs>

                        <>{formButtons(isLoading, 'edit', null, '/prensa', null)}</>

                    </form>
                </section>
            </>
        )
    }

}

export default withRouter(PrensaEdit);

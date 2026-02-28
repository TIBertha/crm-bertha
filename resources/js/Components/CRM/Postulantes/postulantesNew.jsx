import React, { Component } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import {Tab, Tabs} from "react-bootstrap";
import "react-phone-input-2/lib/style.css";
import parse from "html-react-parser";
import {modalCancelar, showAlert, showAlertConfirmRedirectReactRouter} from '../../Helpers/alerts.js';
import {GetRequisitosViewPostulantes2} from "../../Helpers/postulantes.js";
import {
    ajaxGetActividadesList,
    ajaxPostulantesGetData,
    ajaxPostulantesNew,
    functionCalculateAge, functionSelectNationality,
    getNumAdjuntoVerificacion,
    isActividadChofer,
    nombreAdjuntoVerificacion
} from "../../Functions/Postulantes.jsx";
import NewCopyIcon from "../Components/newCopyIcon.jsx";

import DatosBasico from "./Tabs/datosBasico.jsx";
import Datos from "./Tabs/datos.jsx";
import Adjuntos from "./Tabs/adjuntos.jsx";
import VerificacionesLaborales from "./Tabs/verificacionesLaborales.jsx";
import Educacion from "./Tabs/educacion.jsx";
import {ajaxGetDepartamentosByNacionalidad,
    ajaxSearchDistrito,
    ajaxSearchDistritoExperiencia, ajaxSearchUser,
    ajaxUploadFile, ajaxVerificarNumero,
    executeCalcularTiempo, formButtons} from "../../Functions/General.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";
import CopyRequisitosViewPostulantes from "../Components/copyRequisitosViewPostulantes.jsx";
import {getExtensionFromString, GetListAddEstudios, GetSpeechDespedida2, getSpeechLlamadaVerificacion, removeExtensionFromString} from "../../Helpers/strings.js";
import Tooltips from "../Components/tooltips.jsx";
import {filesize} from "filesize";
import {useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class PostulantesNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            show: false,
            nombres: '',
            apellidos: '',
            genero: 2,
            generos: [],
            telefono: '',
            searchingNumber: false,
            estatusNumber: '',
            iconEstatusNumber: '',
            searchingDocumentoID: false,
            estatusDocumentoID: '',
            iconEstatusDocumentoID: '',
            existDuplicityNumber: 0,
            existDuplicityDocumentoID: 0,
            telefonowhatsapp: '',
            tipodocumento: 1,
            tiposdocumentos: [],
            numerodocumento: '',
            emptyDocumentoID: true,
            estadocivil: 1,
            estadosciviles: [],
            //correo: '',
            fechanacimiento: '',
            edad: '',
            niveleducativo: '',
            niveleseducativos: [],
            niveleseducativos_mx: [],
            paisprocedencia: 54,
            paispostulando: '54',
            paises: [],
            nacionalidad: 1,
            nacionalidades:[],
            departamentonacimiento: '',
            provincianacimiento: '',
            lugarnacimiento: '',
            departamentos:[],
            departamentosnacimiento:[],
            provincias: [],
            provinciasnacimiento: [],
            departamento: 15,
            provincia: 1,
            distrito: '',
            direccion: '',
            actividad: '',
            idioma: [{value: 4, label: 'ESPAÑOL', is_fixed: true}],
            idiomas: [],
            modalidad: [
                {id: 1, value: "Cama Adentro", valueCH: "Puerta Adentro", valueMX: 'De Planta', isChecked: false},
                {id: 2, value: "Cama Afuera", valueCH: "Puerta Afuera", valueMX: 'Entrada por Salida', isChecked: true},
                {id: 3, value: "Por Dias",  valueCH: "Por Dias", valueMX: 'Por Dias', isChecked: true}
            ],
            actividades: [],
            actividadesverificaciones: [],
            modalidades: [],
            parentescos: [],
            contactos: [],
            verificaciones: [],
            firma: '',
            tests: {pregunta1: 'Has mentido alguna vez en tu vida.', pregunta2: 'Si es bueno sonreir.', pregunta3: 'Si le ayudaría.', pregunta4: 'Te molesta pero tratas de mejorar.', pregunta5: 'Si pero de una manera adecuada.', pregunta6: 'Llegas 10 minutos antes.', pregunta7: 'Tratas de entender a tu jefe.', pregunta8: 'Aceptas consejos con respeto.', pregunta9: 'Te incomoda pero no tanto.', pregunta10: 'Saludo Primero.', pregunta11: 'Te incomoda pero no mucho.', pregunta12: 'Esperas un momento para hablar.', pregunta13: 'Casi siempre llego temprano.', pregunta14: 'Te acercas a ayudarle.'},
            videointroduccionyoutube: '',
            existyoutubevideo: false,
            search: '',
            usuarioid: '',
            adjuntoeducacion: [],
            numhijos: '',
            edadhijos: '',
            cantidades: [],
            tiposcertificados: [],
            isLoadingSearch: false,
            isChofer: false,
            keyTab: 'tab1',

            foto: '',
            fotodnidelantera: '',
            fotodnitrasera: '',
            documentoVigente: true,
            fotolicenciadelantera: '',
            fotolicenciatrasera: '',
            pruebacovid: [],
            informecovid: [],
            resultadocovid: '',
            certificadoantecedente: '',
            certificadoantecedentepdf: '',
            fechaemisioncertificado: '',
            fotorecibo: '',
            videopresentacion: '',
            resultadoscovid: [],
            tienevacuna: '',

            loadingfoto: false,
            loadingfotodnidelantera: false,
            loadingfotodnitrasera: false,
            loadingfotolicenciadelantera: false,
            loadingfotolicenciatrasera: false,
            loadingpruebacovid: false,
            loadinginformecovid: false,
            loadingcertificadoantecedente: false,
            loadingrecibos: false,
            loadingvideopresentacion: false,
            isLoadingSave: false,
            nombreResponsable: '',
            requis: [],
            resultUpload: {isCreated: false, msj: null, type: null, isLoading: false},
            formbasico: true,
        };

        this.sigPad = React.createRef();

        this.save = this.save.bind(this);
        this.savePostulante = this.savePostulante.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addContacto = this.addContacto.bind(this);
        this.removeContacto = this.removeContacto.bind(this);
        this.addVerificacion = this.addVerificacion.bind(this);
        this.removeVerificacion = this.removeVerificacion.bind(this);
        this.addEducacion = this.addEducacion.bind(this);
        this.removeEducacion = this.removeEducacion.bind(this);
        this.clearPad = this.clearPad.bind(this);
        this.getActividadesList = this.getActividadesList.bind(this);
        this.getDepartamentosByNacionalidad = this.getDepartamentosByNacionalidad.bind(this);
        this.cleanSearch = this.cleanSearch.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleSingularUpload = this.handleSingularUpload.bind(this);
        this.handleSingularDelete = this.handleSingularDelete.bind(this);
        this.processUpload = this.processUpload.bind(this);
        this.handleDeleteAdjunto = this.handleDeleteAdjunto.bind(this);
        this.handleRenameAdjunto = this.handleRenameAdjunto.bind(this);
        this.copyTelefono = this.copyTelefono.bind(this);
        this.loadDistritoOptions = this.loadDistritoOptions.bind(this);
        this.loadDistritoOptionsExperiencia = this.loadDistritoOptionsExperiencia.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.actionDeleteAdjunto = this.actionDeleteAdjunto.bind(this);

        this.actionUploadFile = this.actionUploadFile.bind(this);
        this.deleteAdjunto = this.deleteAdjunto.bind(this);

        this.getRequis = this.getRequis.bind(this);
        this.changeVigenciaDocumento = this.changeVigenciaDocumento.bind(this);
        this.cleanModal = this.cleanModal.bind(this);
    }

    cleanModal(){
        this.setState({
            resultUpload: {isCreated: false, msj: null, type: null, isLoading: false},
        });
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    setLoadingSearch(condition){
        this.setState({isLoadingSearch: condition});
    }

    setLoadingSave(condition){
        this.setState({isLoadingSave: condition});
    }

    changeVigenciaDocumento(e,condition){
        this.setState({
            documentoVigente: condition
        });
    }

    getRequis(){
        this.setState({ requis: GetRequisitosViewPostulantes2(this.state) });
    }

    actionDeleteAdjunto(campo, key){
        this.setState({[campo]: ''});
    }


    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/postulantes', navigate)
    }

    handleSingularUpload(files, type){
        let token = (new Date()).getTime();
        let data = [];

        if(type == 'foto'){
            this.setState({loadingfoto: true});
            data = Object.assign({}, this.state.foto);
        }else if (type == 'fotodnidelantera'){
            this.setState({loadingfotodnidelantera: true});
            data = Object.assign({}, this.state.fotodnidelantera);
        }else if (type == 'fotodnitrasera'){
            this.setState({loadingfotodnitrasera: true});
            data = Object.assign({}, this.state.fotodnitrasera);
        }else if (type == 'fotorecibo'){
            this.setState({loadingrecibos: true});
            data = Object.assign({}, this.state.fotorecibo);
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

    handleSingularDelete(e, campo){
        if(campo == 'certificadoantecedente'){
            this.setState({
                certificadoantecedente: '',
                certificadoantecedentepdf: '',
                fechaemisioncertificado: '',
                tienecuenta: false,
            });
        }else{
            this.setState({
                [campo]: ''
            });
        }
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

        axios.post("/ajax-postulantes-adjunto", datos, {})
            .then(res => {

                let r = res.data;

                if(r.code === 200){
                    this.setState({
                        [type]: r.adjunto.url,
                    });

                    if (type == 'foto'){
                        this.setState({loadingfoto: false})
                    }else if (type == 'fotodnidelantera'){
                        this.setState({loadingfotodnidelantera: false})
                    }else if (type == 'fotodnitrasera'){
                        this.setState({loadingfotodnitrasera: false})
                    }else if (type == 'fotorecibo'){
                        this.setState({loadingrecibos: false})
                    }
                }else if(r.code === 500){
                    showAlert('error', r.msj);
                }
            }).catch(() => {
            showAlert('error', 'Ocurrio un problema al adjuntar archivo. Consulte al administrador');
        });

    }

    copyTelefono(){

        let {telefono, telefonowhatsapp} = this.state;

        if(!telefonowhatsapp){
            this.setState({telefonowhatsapp: telefono})
        }
    }

    handleUpload(files, key, type, tipoadjunto = ''){

        if(type == 'verificaciones'){

            let data = Object.assign({}, this.state.verificaciones);

            let num = getNumAdjuntoVerificacion(data, key, tipoadjunto);
            let nombreEmpleador = nombreAdjuntoVerificacion(data, key, num, tipoadjunto);

            const uploadedFiles = files.map(file => ({
                file,
                id: uuidv4(),
                num: num,
                name: nombreEmpleador ? nombreEmpleador : removeExtensionFromString(file.name),
                extension: getExtensionFromString(file.name),
                size: filesize(file.size),
                fecha: moment().format('DD/MM/YYYY'),
                progress: 0,
                uploaded: false,
                error: false,
                url: null
            }));

            if(tipoadjunto == 'adjuntosrecomendaciones'){
                data[key].adjuntosrecomendaciones = data[key].adjuntosrecomendaciones ? data[key].adjuntosrecomendaciones.concat(uploadedFiles) : uploadedFiles;
            }else if(tipoadjunto == 'adjuntosverificaciones'){
                data[key].adjuntos = data[key].adjuntos ? data[key].adjuntos.concat(uploadedFiles) : uploadedFiles;
            }

            this.setState({verificaciones: Object.values(data)});

            uploadedFiles.forEach((e) => this.processUpload(e, data, key, type, tipoadjunto));

        }else if(type == 'educacion'){

            let data = Object.assign({}, this.state.adjuntoeducacion);

            const uploadedFiles = files.map(file => ({
                file,
                id: uuidv4(),
                name: file.name,
                extension: getExtensionFromString(file.name),
                size: filesize(file.size),
                fecha: moment().format('DD/MM/YYYY'),
                progress: 0,
                uploaded: false,
                error: false,
                url: null
            }));

            data[key].adjuntos = data[key].adjuntos ? data[key].adjuntos.concat(uploadedFiles) : uploadedFiles;

            this.setState({adjuntoeducacion: Object.values(data)});

            uploadedFiles.forEach((e) => this.processUpload(e, data, key, type));

        }else if(type == 'videopresentacion'){

            let keyLoading = 'loading' + type;

            const videop = files.map(file => ({
                file,
                id: uuidv4(),
                name: file.name,
                extension: getExtensionFromString(file.name),
                size: filesize(file.size),
                fecha: moment().format('DD/MM/YYYY'),
                progress: 0,
                uploaded: false,
                error: false,
                url: null
            }));

            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = (ev) => {

                this.setState({[keyLoading]: true});

                ajaxUploadFile(reader.result, type).then(r => {
                    this.setState({[keyLoading]: false});
                    if(r.code === 200){
                        videop[0].url = r.result;
                        videop[0].uploaded = true;
                        this.setState({ videopresentacion: videop });
                    }else if(r.code === 500){
                        showAlert('error', r.msj)
                    }
                }).catch( function (error) {

                });

            }

        }

    }

    processUpload(uploadedFile, data, key, type, tipoadjunto = ''){

        const datos = new FormData();

        datos.append("file", uploadedFile.file, uploadedFile.name);
        datos.append("fileid", uploadedFile.id);
        datos.append("filesize", uploadedFile.size);
        datos.append("filename", uploadedFile.name);
        datos.append("extension", uploadedFile.extension);
        datos.append("fecha", uploadedFile.fecha);
        datos.append("type", type);

        axios.post("/ajax-postulantes-adjunto", datos, {})
            .then(res => {

                let r = res.data;

                if(r.code === 200){

                    let valores = {
                        uploaded: true,
                        url: r.adjunto.url,
                        file: null
                    };

                    this.updateFile(r.adjunto.id, key, data, valores, type, tipoadjunto);

                }else if(r.code === 500){

                    showAlert('error', r.msj);

                }

            }).catch(() => {

            showAlert('error', 'Ocurrio un problema al adjuntar archivo. Consulte al administrador');

        });

    }

    updateFile(id, key, Data, valores, type, tipoadjunto = ''){

        let datos = Object.values(Data);

        if(type == 'verificaciones'){
            if(tipoadjunto == 'adjuntosrecomendaciones'){
                datos[key].adjuntosrecomendaciones = datos[key].adjuntosrecomendaciones.map(uploadedFile => {
                    return id == uploadedFile.id ? { ...uploadedFile, ...valores } : uploadedFile;
                });
            }else if(tipoadjunto == 'adjuntosverificaciones'){
                datos[key].adjuntos = datos[key].adjuntos.map(uploadedFile => {
                    return id == uploadedFile.id ? { ...uploadedFile, ...valores } : uploadedFile;
                });
            }
            this.setState({verificaciones: datos});
        }else if(type == 'educacion'){
            datos[key].adjuntos = datos[key].adjuntos.map(uploadedFile => {
                return id == uploadedFile.id ? { ...uploadedFile, ...valores } : uploadedFile;
            });
            this.setState({adjuntoeducacion: datos});
        }


    }

    handleRenameAdjunto(text, fileid, key, type, tipoadjunto = ''){

        if(type == 'verificaciones'){
            this.updateFile(fileid, key, this.state.verificaciones, {name: text.nameFile}, type, tipoadjunto);
        }else if(type == 'educacion'){
            this.updateFile(fileid, key, this.state.adjuntoeducacion, {name: text.nameFile}, type, tipoadjunto);
        }
    }

    handleDeleteAdjunto(fileid, key, type, tipoadjunto = '') {

        Swal.fire({
            text: "¿Está seguro que desea borrar el archivo?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: Constantes.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {

            if (result.value) {

                if(type == 'verificaciones'){

                    let data = Object.values(this.state.verificaciones);

                    if(tipoadjunto == 'adjuntosrecomendaciones'){
                        data[key].adjuntosrecomendaciones = data[key].adjuntosrecomendaciones.filter(file => file.id !== fileid);
                    }else if(tipoadjunto == 'adjuntosverificaciones'){
                        data[key].adjuntos = data[key].adjuntos.filter(file => file.id !== fileid);
                    }

                    this.setState({verificaciones: data});

                }else if(type == 'educacion'){

                    let data = Object.values(this.state.adjuntoeducacion);

                    data[key].adjuntos = data[key].adjuntos.filter(file => file.id !== fileid);

                    this.setState({adjuntoeducacion: data});

                }else if(type == 'videopresentacion'){

                    this.setState({videopresentacion: []});
                }

            }
        });

    }

    clearPad(){
        this.sigPad.clear();
    }

    handleChange(e, tipo = '', campo = '', campo2 = '', llave = '') {

        if(['imagen', 'imagenpdf'].includes(tipo)){

            let file = e.target.files[0];
            let tipoFile = file.type;

            if(tipo == 'imagen'){

                let options = '';

                if (campo == 'foto'){
                    options = {
                        maxSizeMB: 4,
                        maxWidthOrHeight: 800,
                        useWebWorker: true,
                        fileType: "image/jpeg",
                    };
                }else if (['fotodnidelantera', 'fotodnitrasera'].includes(campo)){
                    this.setState({documentoVigente: true});
                }else{
                    options = {
                        maxSizeMB: 4,
                        maxWidthOrHeight: 800,
                        useWebWorker: true,
                    };
                }

                imageCompression(file, options).then( function(compressedFile){

                    let reader = new FileReader();

                    reader.readAsDataURL(compressedFile);

                    reader.onload = (e) => {
                        this.actionUploadFile(reader.result, campo, null, llave);
                    };

                });

            }else if(tipo == 'imagenpdf'){

                let tiposFilePermitidos = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];

                if(tiposFilePermitidos.includes(tipoFile)){

                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = (e) => {
                        this.actionUploadFile(reader.result, campo, tipoFile);
                    }

                }else{
                    showAlert('error', 'Tipo de archivo no permitido');
                }

            }

        }else if(tipo == 'time'){

            if (campo == 'fechanacimiento'){
                this.setState({
                    [campo]: e.target.value
                }, this.calculteAge);
            }else{
                this.setState({
                    [campo]: e.target.value
                });
            }

        }else if(tipo == 'modalidad') {

            let modalidad = this.state.modalidad;

            modalidad.forEach(m => {
                if (m.value === e.target.value)
                    m.isChecked = e.target.checked
            });

            this.setState({modalidad: modalidad});


        }else if(tipo == 'formbasico'){

            this.setState(prev => ({
                formbasico: !prev.formbasico
            }));


        }else if(tipo == 'pais'){

            let {departamentonacimiento, lugarnacimiento, paispostulando} = this.state;

            let tipoDocumento = '';

            if(paispostulando == 11){
                if (parseInt(e.target.value) == 11){
                    tipoDocumento = 10;
                }
            }else if(paispostulando == 54){
                if (parseInt(e.target.value) == 54){
                    tipoDocumento = 1;
                }
            }

            this.setState({
                paisprocedencia: e.target.value,
                nacionalidad: functionSelectNationality(e.target.value),
                tipodocumento: tipoDocumento,
                lugarnacimiento: (parseInt(e.target.value) == 54 ? lugarnacimiento : ''),
                departamentonacimiento: (parseInt(e.target.value) == 54 ? departamentonacimiento : ''),
            }, this.getDepartamentosByNacionalidad(e.target.value));

        }else if(tipo == 'departamentonacimiento') {

            this.setState({
                departamentonacimiento: e.target.value
            });

        }else if(tipo == 'departamento') {

            this.setState({
                departamento: e.target.value
            });

        }else if(tipo == 'provincia') {

            this.setState({
                provincia: e.target.value
            });

        }else if(tipo == 'distrito') {

            this.setState({
                distrito: e
            });

        }else if(tipo == 'evento') {

            if(campo == 'actividad'){
                this.isChofer(e);
            }

            this.setState({
                [campo]: e
            });

        }else if(tipo == 'contacto'){

            const data = this.state.contactos.map((contacto, sidx) => {
                if (campo !== sidx) return contacto;

                if (campo2 == 'telefono'){
                    return { ...contacto, telefono: e };
                }else{
                    return { ...contacto, [e.target.name]: e.target.value.toUpperCase() };
                }

            });

            this.setState({ contactos: data});

        }else if(tipo == 'verificacion'){

            const data = this.state.verificaciones.map((verificacion, sidx) => {
                if (campo !== sidx) return verificacion;

                if(campo2 == 'distrito'){
                    return { ...verificacion, distrito: e};
                }else if(campo2 == 'actividad') {
                    return { ...verificacion, actividad: e};
                }else if(campo2 == 'ejecutivo') {
                    const ejecutivoNombre = this.state.nombreResponsable;
                    return { ...verificacion, ejecutivo: ejecutivoNombre};
                }else if (campo2 == 'telefono'){
                    return { ...verificacion, telefono: e};
                }else if(campo2 == 'llamar') {
                    return { ...verificacion, llamar: true};
                }else if(['inicioLabores', 'finLabores'].includes(campo2)){
                    return{ ...verificacion, [campo2]: e, tiempo: this.calcularTiempo(campo,e,campo2, 'verificaciones')};
                }else{
                    return { ...verificacion, [e.target.name]: e.target.value.toUpperCase() };
                }

            });

            this.setState({ verificaciones: data});

        }else if(tipo == 'educacion'){

            const data = this.state.adjuntoeducacion.map((educacion, sidx) => {
                if (campo !== sidx) return educacion;

                if(['fechainicio', 'fechafin'].includes(campo2)){
                    return{ ...educacion, [campo2]: e, tiempo: this.calcularTiempo(campo,e,campo2, 'educacion')};
                }else{
                    return { ...educacion, [e.target.name]: e.target.value.toUpperCase() };
                }

            });

            this.setState({ adjuntoeducacion: data});

        }else if(tipo == 'test') {

            const formState = Object.assign({}, this.state.tests);
            formState[e.target.name] = e.target.value;
            this.setState({tests: formState})

        }else if(tipo == 'paispostulando'){
            let {genero, } = this.state;
            this.setState({
                paispostulando: e.target.value
            }, this.getActividadesList(genero, e.target.value));
        }else if(tipo == 'genero') {
            let {paispostulando, } = this.state;

            this.setState({
                genero: e.target.value
            }, this.getActividadesList(e.target.value, paispostulando));

        }else if(tipo == 'videoyoutube') {

            this.setState({
                videointroduccionyoutube: e.target.value
            });

        }else if(tipo == 'numerocelular') {

            this.setState({
                telefono: e.target.value,
                telefonowhatsapp: e.target.value
            }, this.verificarDuplicado(e.target.value, 'phone'));

        }else if (tipo == 'codigoTelefonico'){

            if (campo == 'telefono'){
                this.setState({
                    telefono: e,
                    telefonowhatsapp: e
                }, this.verificarDuplicado(e, 'phone'));
            }else{
                this.setState({
                    [campo]: e,
                });
            }
        }else if (tipo == 'numeroDocumento'){

            this.setState({
                numerodocumento: e.target.value.toUpperCase()
            }, this.verificarDuplicado(e.target.value, 'ID'));

        }else{

            const input = e.target;
            const start = input.selectionStart;
            const end = input.selectionEnd;

            this.setState({
                [e.target.name]: e.target.value.toUpperCase()
            }, () =>  (start == undefined && end == undefined) ? '' : input.setSelectionRange(start, end) );

        }
        this.getRequis();
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
                    iconEstatusNumber: numero.length > 0 ? r.iconEstatusNumber : '',
                    existDuplicityNumber: numero.length > 0 ? r.existDuplicityNumber : 0,
                });
            }else if(tipo == 'ID'){
                this.setState({
                    searchingDocumentoID: false,
                    estatusDocumentoID: numero.length > 0 ? r.estatusDocumentoID : '',
                    iconEstatusDocumentoID: numero.length > 0 ? r.iconEstatusDocumentoID : '',
                    existDuplicityDocumentoID: numero.length > 0 ? r.existDuplicityDocumentoID : 0,
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    actionUploadFile(file, campo, tipoarchivo = null, llave = null){

        let key = 'loading'+ campo;

        this.setState({ [key]: true });

        ajaxUploadFile(file, campo, tipoarchivo).then(r => {
            if (r.code === 200){
                if(campo == 'certificadoantecedente'){
                    this.setState({
                        [key]: false,
                        certificadoantecedente: r.result.image,
                        certificadoantecedentepdf: r.result.pdf
                    });
                }else if(campo == 'cartillavacunapdf'){
                    this.setState({
                        [key]: false,
                        cartillavacuna: r.result.image,
                        cartillavacunapdf: r.result.pdf
                    });
                }else if(campo == 'recibos'){
                    const data = this.state.fotorecibo.map((recibo, sidx) => {
                        if (llave !== sidx){
                            return recibo;
                        }
                        return { ...recibo, fotorecibo: r.result };
                    });
                    this.setState({ [key]: false, fotorecibo: data});
                }else{
                    this.setState({
                        [key]: false,
                        [campo]: r.result
                    });
                }
            }else if(r.code === 500){
                this.setState({
                    [key]: false
                });
                showAlert('error', r.msj)
            }
        }).catch( function (error) {
            if (error.response.status == 422){
                showAlert('error', error.response.data);
            }
        });
    }

    deleteAdjunto(campo){

        Swal.fire({
            text: "¿Está seguro que desea borrar el adjunto?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: Constantes.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {

            if (result.value) {

                this.setState({
                    [campo]: []
                });

            }

        });

    }

    calcularTiempo(key, valor, tipo, tipoObjeto){

        let fechaI = '';
        let fechaF = '';

        if(tipoObjeto == 'verificaciones'){

            let verificaciones = this.state.verificaciones;

            if(tipo == 'inicioLabores'){
                fechaI = valor;
                fechaF = verificaciones[key].finLabores;
            }else if(tipo == 'finLabores'){
                fechaI = verificaciones[key].inicioLabores;
                fechaF = valor;
            }

        }else if(tipoObjeto == 'educacion'){

            let educacion = this.state.adjuntoeducacion;

            if(tipo == 'fechainicio'){
                fechaI = valor;
                fechaF = educacion[key].fechafin;
            }else if(tipo == 'fechafin'){
                fechaI = educacion[key].fechainicio;
                fechaF = valor;
            }

        }

        let result = executeCalcularTiempo(fechaI, fechaF);

        return result;

    }

    addContacto(){
        this.setState({
            contactos: this.state.contactos.concat([{ nombre: '', telefono: '', parentesco: '' }])
        });
    };

    removeContacto(id){
        this.setState({
            contactos: this.state.contactos.filter((s, sidx) => id !== sidx)
        });
    };

    addVerificacion(){
        this.setState({
            verificaciones: this.state.verificaciones.concat([{ nombre: '', apellidos: '', departamento: 15, provincia: 1, distrito: '', telefono:'', actividad: '', inicioLabores:'', finLabores:'', tiempo: '', motivoretiro: '', verificado: '', ejecutivo: '',  llamar: false, adjuntos: [], adjuntosrecomendaciones: [] }])
        });
    };

    removeVerificacion(id){
        this.setState({
            verificaciones: this.state.verificaciones.filter((s, sidx) => id !== sidx)
        });
    };

    addEducacion(){
        this.setState({
            adjuntoeducacion: this.state.adjuntoeducacion.concat([{ tipocertificado: '', centro: '', titulo: '', fechainicio: '', fechafin: '', tiempo: '', adjuntos: [] }])
        });
    };

    removeEducacion(id){
        this.setState({
            adjuntoeducacion: this.state.adjuntoeducacion.filter((s, sidx) => id !== sidx)
        });
    };

    getFirma(){

        let {formbasico} = this.state;

        if(formbasico){

            return null;

        }else{

            let isFirma = this.sigPad.current.isEmpty();

            if(isFirma == false){
                return this.sigPad.current.toDataURL();
            }else{
                return null;
            }

        }

    }

    cleanSearch(){

        this.setState({
            nombres: '',
            apellidos: '',
            genero: 2,
            telefono: '',
            telefonowhatsapp: '',
            tipodocumento: 1,
            numerodocumento: '',
            estadocivil: 1,
            //correo: '',
            fechanacimiento: '',
            edad: '',
            niveleducativo: '',
            paisprocedencia: '',
            nacionalidad: 1,
            departamentonacimiento: '',
            lugarnacimiento: '',
            distrito: '',
            direccion: '',
            actividad: '',
            modalidad: [
                {id: 1, value: "Cama Adentro", isChecked: true},
                {id: 2, value: "Cama Afuera", isChecked: false},
                {id: 3, value: "Por Dias", isChecked: false}
            ],
            firma: '',
            tests: {pregunta1: 'Has mentido alguna vez en tu vida.', pregunta2: 'Si es bueno sonreir.', pregunta3: 'Si le ayudaría.', pregunta4: 'Te molesta pero tratas de mejorar.', pregunta5: 'Si pero de una manera adecuada.', pregunta6: 'Llegas 10 minutos antes.', pregunta7: 'Tratas de entender a tu jefe.', pregunta8: 'Aceptas consejos con respeto.', pregunta9: 'Te incomoda pero no tanto.', pregunta10: 'Saludo Primero.', pregunta11: 'Te incomoda pero no mucho.', pregunta12: 'Esperas un momento para hablar.', pregunta13: 'Casi siempre llego temprano.', pregunta14: 'Te acercas a ayudarle.'},
            foto: '',
            fotodnidelantera: '',
            fotodnitrasera: '',
            fotolicenciadelantera: '',
            fotolicenciatrasera: '',
            pruebacovid: [],
            informecovid: [],
            resultadocovid: '',
            certificadoantecedente: '',
            certificadoantecedentepdf: '',
            fechaemisioncertificado: '',
            search: '',
            usuarioid: '',
            isLoadingSearch: false,
            isChofer: false,
            isLoading: false,
            idioma: [{value: 4, label: 'ESPAÑOL', is_fixed: true}],
            videointroduccionyoutube: '',
            existyoutubevideo: false,
            adjuntoeducacion: [],
            videointroduccion: [],
            fotorecibo: [{fotorecibo: ''}],
            numhijos: '',
            edadhijos: '',

        });

    }

    searchUser(e){

        e.preventDefault();

        this.setLoadingSearch(true);

        ajaxSearchUser(this.state.search).then(r => {
            if(r.code === 200){

                this.setLoadingSearch(false);

                if(r.trabajador){
                    showAlert('error', 'El usuario ya tiene perfil de trabajador');
                }else{
                    this.setState({
                        usuarioid: r.usuario.id,
                        nombres: r.usuario.nombres,
                        apellidos: r.usuario.apellidos,
                        genero: r.usuario.genero_id,
                        telefono: r.usuario.telefono,
                        telefonowhatsapp: r.usuario.telefono_whatsapp,
                        tipodocumento: r.usuario.tipodocumento_id,
                        numerodocumento: r.usuario.numero_documento,
                        estadocivil: r.usuario.estadocivil_id,
                        //correo: r.usuario.correo,
                        fechanacimiento: r.usuario.fecha_nacimiento ? moment(r.usuario.fecha_nacimiento,"YYYY-MM-DD").toDate() : '',
                        paisprocedencia: r.usuario.paisnacimiento_id,
                        nacionalidad: r.usuario.paisnacimiento_id ? functionSelectNationality(r.usuario.paisnacimiento_id) : '',
                        departamentonacimiento: r.usuario.departamentonacimiento_id,
                        lugarnacimiento: r.usuario.lugar_nacimiento
                    });

                    if(r.usuario.genero_id){
                        this.getActividadesList(r.usuario.genero_id, 54);
                    }

                    if(r.usuario.fecha_nacimiento){
                        this.calculteAge();
                    }
                }

            }else if(r.code === 500){
                this.setLoadingSearch(false);
                showAlert('error', r.msj);
            }
        }).catch( function (error) {
            if (error.response.status == 422){
                this.setLoadingSearch(false);
                showAlert('error', error.response.data);
            }
        });
    }

    save(e){

        e.preventDefault();
        let firma = this.getFirma();
        let {verificaciones} = this.state;

        if(verificaciones.length){

            let isInicioLaboresEmpty = verificaciones.some(element => (element.inicioLabores == null || element.inicioLabores == '' || element.inicioLabores == undefined) );
            let isFinLaboresEmpty = verificaciones.some(element => (element.inicioLabores == null || element.inicioLabores == '' || element.inicioLabores == undefined) );

            if(isInicioLaboresEmpty || isFinLaboresEmpty){
                Swal.fire({
                    title: '<i class="fas fa-exclamation-circle"></i>',
                    text: 'Estas dejando vacío los campos de inicio/fin de labor en experiencia',
                    showCancelButton: false,
                    confirmButtonColor: '#513675',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.value) {
                        this.savePostulante(firma);
                    }
                });
            }else{
                this.savePostulante(firma);
            }
        }else{
            this.savePostulante(firma);
        }
    }

    savePostulante(firma){
        let self = this;
        this.setLoadingSave(true);
        let testspsicologico = JSON.stringify(this.state.tests);

        ajaxPostulantesNew(this.state, testspsicologico, firma).then(r => {
            this.setLoadingSave(false);
            if(r.code === 200){
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/postulantes', navigate);
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch( function (error) {
            if (error.response.status == 422){
                self.setLoadingSave(false);
                showAlert('error', error.response.data);
            }
        });
    }

    calculteAge(){
        this.setState({
            edad: functionCalculateAge(this.state.fechanacimiento),
        });
    }

    getDepartamentosByNacionalidad(paisNacimiento){
        ajaxGetDepartamentosByNacionalidad(paisNacimiento).then(r => {
            if(r.code === 200){
                this.setState({
                    departamentosnacimiento: r.departamentos
                });
            }
        }).then( function (error) {

        });
    }

    getActividadesList(genero, paispostulando, init = false){
        ajaxGetActividadesList((genero ? parseInt(genero) : 2), (paispostulando ? parseInt(paispostulando) : 54)).then(r => {
            if(r.code === 200){
                if (init){
                    this.setState({
                        actividades: r.actividades
                    });
                }else{
                    this.setState({
                        actividades: r.actividades,
                        actividad: (genero == 1 ? '' : r.actividadDefault)
                    });
                }
            }
        }).catch( function (error) {

        });
    }

    isChofer(actividades){

        let isChofer = isActividadChofer(actividades);

        if(isChofer){
            this.setState({isChofer: true});
        }else{
            this.setState({isChofer: false});
        }
    }

    loadDistritoOptions(search, callback){
        let {paispostulando} = this.state;
        if (!search) {
            callback([]);
        } else {
            setTimeout(() => {
                ajaxSearchDistrito(search, paispostulando).then(r => {
                    callback(r.data);
                }).catch( function (error) {
                    console.log(error);
                })
            });
        }
    }

    loadDistritoOptionsExperiencia(search, callback){
        if (!search) {
            callback([]);
        } else {
            setTimeout(() => {
                ajaxSearchDistritoExperiencia(search).then(r => {
                    callback(r.data);
                }).catch( function (error) {
                    console.log(error);
                });
            });
        }
    }

    getData(genero, paispostulando){

        this.setLoading(true);

        ajaxPostulantesGetData(genero, paispostulando).then(r => {
            if(r.code === 200){
                this.setState({
                    cantidades: r.cantidades,
                    generos: r.generos,
                    tiposdocumentos: r.tiposdocumentos,
                    estadosciviles: r.estadosciviles,
                    niveleseducativos: r.niveleseducativos,
                    niveleseducativos_mx: r.niveleseducativos_mx,
                    paises: r.paises,
                    nacionalidades: r.nacionalidades,
                    departamentos: r.departamentos,
                    departamentosnacimiento: r.departamentos,
                    parentescos: r.parentescos,
                    actividadesverificaciones: r.actividades,
                    tiposcertificados: r.tiposcertificados,
                    idiomas: r.idiomas,
                    resultadoscovid: r.resultadoscovid,
                    idResponsable: r.idResponsable,
                    nombreResponsable: r.nombreResponsable,
                    isLoading:false
                });
            }else if(r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        }).catch( function (error) {

        });

    }

    componentDidMount() {
        let {genero, paispostulando} = this.state;
        this.getData(genero, (paispostulando ? paispostulando : 54));
        this.getActividadesList(genero, (paispostulando ? paispostulando : 54));
        this.getRequis();
    }

    render() {

        let {nombreResponsable, keyTab, formbasico, isLoading, isLoadingSave, show, nombres} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return (

            <>
                <div className="header-box-pink">
                    <div className="row mx-0">
                        <div className="col-6 align-self-center">
                            <>Nuevo Postulante</>
                        </div>
                        <div className="col-6 d-flex justify-content-end align-self-center">
                            <div className="">
                                <i className={'switch-icon fa-solid fa-toggle-' + (formbasico ? 'on' : 'off')} onClick={(e) => this.handleChange(e, 'formbasico')}></i>
                                <span className="custom-control-label text-white" >Básico</span>
                            </div>
                        </div>
                    </div>

                </div>

                <section className="bertha-form">

                    <form method="POST" onSubmit={(e) => this.save(e)} encType="multipart/form-data">

                        {formbasico ?
                            <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">

                                <Tab eventKey="tab1" title="Datos">
                                    <DatosBasico data={this.state} handleChange={this.handleChange}/>
                                </Tab>

                            </Tabs>
                            :
                            <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">

                                <Tab eventKey="tab1" title={<span>Datos</span>}>
                                    <Datos
                                        data={this.state}
                                        view={'New'}
                                        loadDistritoOptions={this.loadDistritoOptions}
                                        handleChange={this.handleChange}
                                        addContacto={this.addContacto}
                                        removeContacto={this.removeContacto}
                                        cleanModal={this.cleanModal}
                                    />
                                </Tab>

                                <Tab eventKey="tab2" title={<span>Adjuntos</span>}>
                                    <Adjuntos
                                        data={this.state}
                                        handleChange={this.handleChange}
                                        handleSingularUpload={this.handleSingularUpload}
                                        handleSingularDelete={this.handleSingularDelete}
                                        changeVigenciaDocumento={this.changeVigenciaDocumento}
                                        actionDeleteAdjunto={this.actionDeleteAdjunto}
                                        referenciaFirma={this.sigPad}
                                        modoEdicionFirma={false}
                                    />
                                </Tab>

                                <Tab eventKey="tab3" title={<span>Experiencia <CopyRequisitosViewPostulantes icon={'fas fa-copy'} copyText={GetListAddEstudios()} vista={'Covid'} tooltipText={'Copiar requisitos - Covid'} /><Tooltips estilo={'tooltip-tc'} placement={'bottom'} text={parse(getSpeechLlamadaVerificacion(nombres, nombreResponsable))}/> <NewCopyIcon icon={'far fa-handshake'} additonalClass={'ms-2 icon-question link-tc'} copyText={GetSpeechDespedida2()} colorNeutro={'unset'} tooltipText={'Copiar mensaje de despedida'} successMsj={'Mensaje copiado'} /> </span>}>
                                    <VerificacionesLaborales
                                        data={this.state}
                                        loadDistritoOptions={this.loadDistritoOptionsExperiencia}
                                        handleChange={this.handleChange}
                                        addVerificacion={this.addVerificacion}
                                        removeVerificacion={this.removeVerificacion}
                                        handleUpload={this.handleUpload}
                                        handleDeleteAdjunto={this.handleDeleteAdjunto}
                                        handleRenameAdjunto={this.handleRenameAdjunto}
                                    /> <hr/>
                                </Tab>

                                <Tab eventKey="tab4" title={<span>Estudios <CopyRequisitosViewPostulantes icon={'fas fa-copy'} copyText={GetListAddEstudios()} tooltipText={'Copiar requisitos - Estudios'} /></span>}>
                                    <Educacion
                                        data={this.state}
                                        handleChange={this.handleChange}
                                        addEducacion={this.addEducacion}
                                        removeEducacion={this.removeEducacion}
                                        handleUpload={this.handleUpload}
                                        handleDeleteAdjunto={this.handleDeleteAdjunto}
                                        handleRenameAdjunto={this.handleRenameAdjunto}
                                    /> <hr/>
                                </Tab>
                            </Tabs>
                        }

                        {formButtons(isLoadingSave, 'new', (this.cancelar), null, null)}

                    </form>

                </section>

            </>

        );
    }
}

export default withRouter(PostulantesNew);

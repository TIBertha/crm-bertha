import React, { Component } from 'react';
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
    ajaxPostulantesEdit,
    ajaxPostulantesGet,
    ajaxPostulantesGetData,
    ajaxSaveEjecutivo,
    ajaxSaveEstatusCul,
    ajaxSetContactadoPostulantes,
    functionCalculateAge,
    functionSelectNationality,
    getNumAdjuntoVerificacion,
    isActividadChofer,
    nombreAdjuntoVerificacion
} from "../../Functions/Postulantes.jsx";
import Datos from "./Tabs/datos.jsx";
import Adjuntos from "./Tabs/adjuntos.jsx";
import VerificacionesLaborales from "./Tabs/verificacionesLaborales.jsx";
import Educacion from "./Tabs/educacion.jsx";
import CertificadoAntecedente from "./Tabs/certificadoAntecedente.jsx";
import HistorialContacto from "./Components/historialContacto.jsx";
import AlertCertificadoModal from "./Modals/alertCertificadoModal.jsx";
import {ajaxGetDepartamentosByNacionalidad,
    ajaxSearchDistrito,
    ajaxSearchDistritoExperiencia,
    ajaxUploadFile, ajaxVerificarNumero,
    executeCalcularTiempo, formButtons} from "../../Functions/General.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";
import {getExtensionFromString, GetListAddEstudios, GetSpeechDespedida2, getSpeechLlamadaVerificacion, removeExtensionFromString} from "../../Helpers/strings.js";
import {filesize} from "filesize";
import TooltipCopy from "../Components/tooltipCopy.jsx";
import BadgeTab from "../Components/badgeTab.jsx";
import {useNavigate, useParams} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class PostulantesEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: props.url,
            show: props.show,
            id: props.params.id,
            linkFirma: '',
            token: '',
            baja: '',
            bajas: [],
            historialbajas: [],
            estatuspostulante: '',
            nombres: '',
            apellidos: '',
            genero: '',
            generos: [],
            telefono: '',
            telefonowhatsapp: '',
            tipodocumento: '',
            tiposdocumentos: [],
            numerodocumento: '',
            searchingNumber: false,
            estatusNumber: '',
            iconEstatusNumber: '',
            searchingDocumentoID: false,
            estatusDocumentoID: '',
            iconEstatusDocumentoID: '',
            existDuplicityNumber: 0,
            existDuplicityDocumentoID: 0,
            emptyDocumentoID: false,
            estadocivil: '',
            estadosciviles: [],
            //correo: '',
            fechanacimiento: '',
            edad: '',
            niveleducativo: '',
            niveleseducativos: [],
            niveleseducativos_mx: [],
            aceptamascotas: '',
            paisprocedencia: '',
            paispostulando: '',
            paises: [],
            nacionalidad: '',
            nacionalidades:[],
            departamentonacimiento: '',
            lugarnacimiento: '',
            departamentos:[],
            departamentosnacimiento:[],
            departamento: '',
            direccion: '',
            actividad: '',
            idioma: '',
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
            verificaciones: [],
            firma: '',
            tests:{pregunta1: '', pregunta2: '', pregunta3: '', pregunta4: '', pregunta5: '', pregunta6: '', pregunta7: '', pregunta8: '', pregunta9: '', pregunta10: '', pregunta11: '', pregunta12: '', pregunta13: '', pregunta14: ''},
            videointroduccionyoutube: '',
            existyoutubevideo: false,
            distritosall: [],
            changeSignature: false,
            changeSignatureApoderado: false,
            adjuntoeducacion: [],
            numhijos: '',
            edadhijos: '',
            cantidades: [],
            tiposcertificados: [],
            isChofer: false,
            keyTab: 'tab1',
            foto: '',
            fotoNew: {isLoding: false, foto:''},
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
            diaspasadoscertificadoantecedente: null,
            tienecuenta: false,
            fotorecibo: '',
            videopresentacion: '',
            resultadoscovid: [],
            tienevacuna: '',
            cartillavacuna: '',
            cartillavacunapdf: '',
            sideCartilla:'A',
            passwordCERTI: '',
            cartillaverificada: false,

            loadingfoto: false,
            loadingfotodnidelantera: false,
            loadingfotodnitrasera: false,
            documentoVigente: false,
            loadingfotolicenciadelantera: false,
            loadingfotolicenciatrasera: false,
            loadingpruebacovid: false,
            loadinginformecovid: false,
            loadingcertificadoantecedente: false,
            loadingcartillavacuna: false,
            loadingrecibos: false,
            loadingvideopresentacion: false,
            isLoading: false,
            isLoadingSave: false,
            showAlertModal: false,
            idResponsable: '',
            nombreResponsable: '',
            requis: [],
            resultUpload: {isCreated: false, msj: null, type: null, isLoading: false},
            checkaprobado: false,
            historialContacto: [],
            contactname: '',
            flagemoji: '',
        };

        this.sigPad = React.createRef();

        this.saveEjecutivo = this.saveEjecutivo.bind(this);
        this.save = this.save.bind(this);
        this.savePostulante = this.savePostulante.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addVerificacion = this.addVerificacion.bind(this);
        this.removeVerificacion = this.removeVerificacion.bind(this);
        this.addEducacion = this.addEducacion.bind(this);
        this.removeEducacion = this.removeEducacion.bind(this);
        this.getActividadesList = this.getActividadesList.bind(this);
        this.getDepartamentosByNacionalidad = this.getDepartamentosByNacionalidad.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleSingularUpload = this.handleSingularUpload.bind(this);
        this.handleSingularDelete = this.handleSingularDelete.bind(this);
        this.processUpload = this.processUpload.bind(this);
        this.handleDeleteAdjunto = this.handleDeleteAdjunto.bind(this);
        this.handleRenameAdjunto = this.handleRenameAdjunto.bind(this);
        this.loadDistritoOptions = this.loadDistritoOptions.bind(this);
        this.loadDistritoOptionsExperiencia = this.loadDistritoOptionsExperiencia.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.actionDeleteAdjunto = this.actionDeleteAdjunto.bind(this);

        this.actionUploadFile = this.actionUploadFile.bind(this);
        this.deleteAdjunto = this.deleteAdjunto.bind(this);

        this.changeEstatusCUL = this.changeEstatusCUL.bind(this);

        this.getRequis = this.getRequis.bind(this);
        this.changeVigenciaDocumento = this.changeVigenciaDocumento.bind(this);
        this.saveState = this.saveState.bind(this);
        this.cleanModal = this.cleanModal.bind(this);

        this.handleContactado = this.handleContactado.bind(this);
        this.alertModal = this.alertModal.bind(this);
        this.closeAlertModal = this.closeAlertModal.bind(this);
    }

    handleContactado(e){
        let{id} = this.state;
        ajaxSetContactadoPostulantes(id).then(r => {
            this.setState({
                historialContacto: r.historialContacto ? JSON.parse(r.historialContacto) : [],
            })
        })
    }

    saveState(e, paisId, newEstado){
        ajaxSaveEstado(paisId, newEstado).then(r => {
            if (r.code === 200){
                this.setState({
                    departamentonacimiento: r.estadoId,
                    lugarnacimiento: r.estadoNombre,
                    departamentosnacimiento: r.estados,
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

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    setLoadingSave(condition){
        this.setState({isLoadingSave: condition});
    }

    changeVigenciaDocumento(e,condition){
        this.setState({
            documentoVigente: condition
        });
    }

    changeEstatusCUL(e, estatus, certificadoantecedentepdf){

        if (certificadoantecedentepdf){
            this.changeEstatusCULDisable('Ya cuenta con certificado único laboral')
        }else{
            if (estatus == true){
                this.changeEstatusCULDisable('Ya fue accionado este botón')
            }else{
                this.saveAndChangeEstatusCUL(true);
            }
        }

    }

    changeEstatusCULDisable(msj){
        Swal.fire({
            text: (msj),
            type: "warning",
            showCancelButton: true,
            cancelButtonColor: global.PURPLEBERTHA,
            cancelButtonText: "Ok",
            showConfirmButton: false,
        })
    }

    saveAndChangeEstatusCUL(estatus){

        let {id} = this.state;

        ajaxSaveEstatusCul(estatus, id).then(r => {
            if(r.code === 200){
                this.setState({
                    tienecuenta: estatus
                })
            }else if(r.code === 500){
                this.setState({
                    tienecuenta: false
                })
            }
        }).catch( function (error) {

        });

    }

    actionDeleteAdjunto(campo, key){
        this.setState({[campo]: ''});
    }

    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/postulantes', navigate)
    }

    handleSingularUpload(files, type){

        //const uuidv4 = uuidv4();
        let token = (new Date()).getTime();
        let data = [];

        if(type === 'foto'){
            this.setState({loadingfoto: true});
            data = Object.assign({}, this.state.foto);
        }else if (type === 'fotodnidelantera'){
            this.setState({loadingfotodnidelantera: true});
            data = Object.assign({}, this.state.fotodnidelantera);
        }else if (type === 'fotodnitrasera'){
            this.setState({loadingfotodnitrasera: true});
            data = Object.assign({}, this.state.fotodnitrasera);
        }else if (type === 'fotorecibo'){
            this.setState({loadingrecibos: true});
            data = Object.assign({}, this.state.fotorecibo);
        }else if (type === 'certificadoantecedente'){
            this.saveAndChangeEstatusCUL(false);
            this.setState({loadingcertificadoantecedente: true});
            data = Object.assign({}, this.state.certificadoantecedente);
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
            Swal.fire({
                text: "¿Está seguro que desea borrar el certificado de antecedente?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: Constantes.PURPLEBERTHA,
                confirmButtonText: "Si",
                cancelButtonText: "No",
            }).then((result) => {
                this.setState({
                    certificadoantecedente: '',
                    certificadoantecedentepdf: '',
                    fechaemisioncertificado: '',
                    tienecuenta: false,
                });
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

                console.log('here2', datos.get("type"));

                let r = res.data;

                if(r.code === 200){
                    if (type == 'certificadoantecedente'){
                        this.setState({
                            certificadoantecedente: r.adjunto.image,
                            certificadoantecedentepdf: r.adjunto.pdf,
                        });
                    }else{
                        this.setState({
                            [type]: r.adjunto.url,
                        });
                    }

                    if (type == 'foto'){
                        this.setState({loadingfoto: false})
                    }else if (type == 'fotodnidelantera'){
                        this.setState({loadingfotodnidelantera: false})
                    }else if (type == 'fotodnitrasera'){
                        this.setState({loadingfotodnitrasera: false})
                    }else if (type == 'fotorecibo'){
                        this.setState({loadingrecibos: false})
                    }else if (type == 'certificadoantecedente'){
                        this.setState({loadingcertificadoantecedente: false})
                    }
                }else if(r.code === 500){
                    showAlert('error', r.msj);
                }
            }).catch(() => {
            showAlert('error', 'Ocurrio un problema al adjuntar archivo. Consulte al administrador');
        });

    }

    handleUpload(files, key, type, tipoadjunto = ''){

        //const uuidv4 = uuidv4();

        if(type === 'verificaciones'){

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

                ajaxUploadFile((reader.result), type).then(r => {

                    this.setState({[keyLoading]: false});

                    if(r.code === 200){
                        videop[0].url = r.result;
                        videop[0].uploaded = true;
                        this.setState({videopresentacion: videop});
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

                    this.setState({videopresentacion: ''});
                }

            }
        });

    }

    handleChange(e, tipo = '', campo = '', campo2 = '', llave = '') {

        if(['imagen', 'imagenpdf'].includes(tipo)){

            let file = e.target.files[0];
            let tipoFile = file.type;

            if(tipo == 'imagen'){

                if(campo == 'cartillavacuna'){
                    this.setState({
                        loadingcartillavacuna: true,
                    });
                }

                let options = '';

                if (campo == 'foto'){
                    options = {
                        maxSizeMB: 4,
                        maxWidthOrHeight: 800,
                        useWebWorker: true,
                        fileType: "image/jpeg",
                    };
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

                    if(campo == 'certificadoantecedente'){
                        this.setState({ loadingcertificadoantecedente: true});
                    }else if(campo == 'cartillavacunapdf'){
                        this.setState({ loadingcartillavacuna: true});
                    }

                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = (e) => {
                        this.actionUploadFile(reader.result, campo, tipoFile);
                    };

                    if (campo == 'certificadoantecedente'){
                        this.saveAndChangeEstatusCUL(false);
                    }

                }else{
                    showAlert('error', 'Tipo de archivo no permitido');
                }

                if(campo == 'cartillavacunapdf'){
                    this.setState({cartillaverificada: true});
                }

            }

        }else if(tipo == 'sideCartilla'){
            this.setState({
                sideCartilla: campo
            });
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
                    m.isChecked =  e.target.checked
            });

            this.setState({modalidad: modalidad});

        }else if(tipo == 'checkaprobado'){

            this.setState({checkaprobado: e.target.checked});

        }else if(tipo == 'cartillaverificada'){

            this.setState({cartillaverificada: e.target.checked});

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
                    return { ...verificacion, llamar: verificacion.llamar == true ? false : true};
                }else if(['inicioLabores', 'finLabores'].includes(campo2)){
                    return{ ...verificacion, [campo2]: e, tiempo: this.calcularTiempo(campo,e,campo2, 'verificaciones')};
                }else if(campo2 == 'uploadAdjunto'){

                    //const uuidv4 = uuidv4();

                    const uploadedFiles = e.map(file => ({
                        file,
                        id: uuidv4(),
                        name: removeExtensionFromString(file.name),
                        extension: getExtensionFromString(file.name),
                        size: filesize(file.size),
                        fecha: moment().format('DD/MM/YYYY'),
                        progress: 0,
                        uploaded: false,
                        error: false,
                        url: null
                    }));

                    return { ...verificacion, adjuntos: verificacion.adjuntos ? verificacion.adjuntos.concat(uploadedFiles) : uploadedFiles };

                }else{

                    return { ...verificacion, [e.target.name]: e.target.value.toUpperCase() };
                }

            });

            this.setState({ verificaciones: data});

            if(['ejecutivo', 'llamar'].includes(campo2)){
                this.saveEjecutivo(data);
            }

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
                paispostulando: e.target.value,
                niveleducativo: '',
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
            });

        }else if (tipo == 'codigoTelefonico'){

            if (campo == 'telefono'){
                this.setState({
                    telefono: e,
                    telefonowhatsapp: e
                });
            }else{
                this.setState({
                    [campo]: e,
                });
            }

        }else if (tipo == 'numeroDocumento'){

            this.setState({
                numerodocumento: e.target.value.toUpperCase()
            }, (this.state.emptyDocumentoID == true ? this.verificarDuplicado(e.target.value, 'ID') : null));

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

        ajaxUploadFile(file,campo, tipoarchivo).then(r => {
            if(r.code === 200){
                if(campo == 'certificadoantecedente'){
                    this.setState({
                        [key]: false,
                        certificadoantecedentepdf: r.result.pdf,
                        loadingcertificadoantecedente: false,
                    });
                }else if(campo == 'cartillavacunapdf'){
                    this.setState({
                        [key]: false,
                        cartillavacunapdf: r.result.pdf,
                        loadingcartillavacuna: false,
                    });
                }else if(campo == 'recibos'){
                    const data = this.state.fotorecibo.map((recibo, sidx) => {
                        if (llave !== sidx){
                            return recibo;
                        }
                        return { ...recibo, fotorecibo: r.result };
                    });

                    this.setState({ [key]: false, fotorecibo: data});

                }else if(campo == 'cartillavacuna'){
                    this.setState({
                        loadingcartillavacuna: false,
                        cartillaverificada: true,
                        cartillavacuna:r.result,
                    });
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

        if(this.sigPad.current){

            let isFirma = this.sigPad.current.isEmpty();

            if(isFirma == false){
                return this.sigPad.current.toDataURL();
            }else{
                return null;
            }

        }else{
            return null;
        }

    }

    save(e){

        e.preventDefault();

        let {verificaciones, firma} = this.state;

        let firmPad = !(this.getFirma()) ? firma : this.getFirma();

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
                        this.savePostulante(firmPad);
                    }
                });

            }else{
                this.savePostulante(firmPad);
            }

        }else{
            this.savePostulante(firmPad);
        }

    }

    saveEjecutivo(verif){

        let {id} =  this.state;

        ajaxSaveEjecutivo(id,verif).then(r => {
            if(r.code === 200){

            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch( function (error) {
            if (error.response.status === 422){
                showAlert('error', error.response.data);
            }
        });
    }

    savePostulante(firmaPad){
        let self = this;
        this.setLoadingSave(true);
        let {id} = this.state;

        ajaxPostulantesEdit(id, this.state, firmaPad).then(r => {
            this.setLoadingSave(false);
            if(r.code === 200){
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/postulantes', navigate);
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
        }).catch( function (error) {

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
                });
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

    getRequis(){
        this.setState({ requis: GetRequisitosViewPostulantes2(this.state) });
    }

    getData(genero, paispostulando){

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
                    actividades: r.actividades,
                    parentescos: r.parentescos,
                    actividadesverificaciones: r.actividades,
                    tiposcertificados: r.tiposcertificados,
                    idiomas: r.idiomas,
                    resultadoscovid: r.resultadoscovid,
                    bajas: r.bajas,
                    idResponsable: r.idResponsable,
                    nombreResponsable: r.nombreResponsable,
                    isLoading:false
                });
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch( function (error) {

        });

    }

    alertModal(){
        console.log('YA VA VENCER');
        return <AlertCertificadoModal showAlertModal={true} />
    }

    closeAlertModal(e){
        this.setState({
            showAlertModal: false,
        });
    }

    componentDidMount() {

        this.setLoading(true);

        let id = this.state.id;

        ajaxPostulantesGet(id).then(r => {
            if(r.code === 200){
                this.setState({
                    contactname: r.contact_name,
                    flagemoji: r.flag_emoji,
                    nombres: r.data.usuario.nombres,
                    passwordCERTI: r.data.password_certi,
                    apellidos: r.data.usuario.apellidos,
                    genero: r.data.usuario.genero_id ? r.data.usuario.genero_id : 2,
                    telefono: r.data.usuario.telefono ? r.data.usuario.telefono : null,
                    telefonowhatsapp: r.data.usuario.telefono_whatsapp ? r.data.usuario.telefono_whatsapp : (r.data.usuario.telefono ? r.data.usuario.telefono : null),
                    tipodocumento: r.data.usuario.tipodocumento_id,
                    numerodocumento: r.data.usuario.numero_documento,
                    emptyDocumentoID: r.data.usuario.numero_documento ? false : true,
                    estadocivil: r.data.usuario.estadocivil_id,
                    fechanacimiento: r.data.usuario.fecha_nacimiento ? (r.data.usuario.fecha_nacimiento).slice(0, 10) : '',
                    edad: r.data.usuario.fecha_nacimiento ? functionCalculateAge((r.data.usuario.fecha_nacimiento).slice(0, 10)) :'',
                    aceptamascotas: r.data.aceptamascotas,
                    //correo: r.data.usuario.correo,
                    niveleducativo: r.data.niveleducativo_id,
                    paisprocedencia: r.data.usuario.nacionalidad_id == 1 ? '54' : (r.data.usuario.paisnacimiento_id).toString(),
                    paispostulando: r.data.postulando_pais_id,
                    nacionalidad: r.data.usuario.nacionalidad_id,
                    departamentonacimiento: r.data.usuario.departamentonacimiento_id ? r.data.usuario.departamentonacimiento_id : '',
                    lugarnacimiento: r.data.usuario.lugar_nacimiento,
                    linkFirma: r.linkFirma,
                    departamentosnacimiento: r.departamentos,
                    token: r.data.token,
                    estatuspostulante: r.data.estatuspostulante_id,
                    distrito: r.distrito,
                    videointroduccionyoutube: r.data.video_introduccion_youtube,
                    direccion: r.data.direccion,
                    idioma: r.idioma ? r.idioma : [{value: 4, label: 'ESPAÑOL', is_fixed: true}] ,
                    actividad: r.actividad,
                    modalidad: [
                        {id: 1, value: "Cama Adentro",  valueCH: "Puerta Adentro", valueMX: 'De Planta', isChecked: r.data.cama_adentro ? true : false},
                        {id: 2, value: "Cama Afuera",  valueCH: "Puerta Afuera", valueMX: 'Entrada por Salida', isChecked: r.data.cama_afuera ? true : false},
                        {id: 3, value: "Por Dias",  valueCH: "Por Dias", valueMX: 'Por Dias', isChecked: r.data.por_horas ? true : false}
                    ],
                    verificaciones: r.verificaciones ? r.verificaciones : [],
                    adjuntoeducacion: r.adjuntoeducacion ? r.adjuntoeducacion : [],
                    tests: r.data.test_psicologico ? JSON.parse(r.data.test_psicologico) : {pregunta1: 'Has mentido alguna vez en tu vida.', pregunta2: 'Si es bueno sonreir.', pregunta3: 'Si le ayudaría.', pregunta4: 'Te molesta pero tratas de mejorar.', pregunta5: 'Si pero de una manera adecuada.', pregunta6: 'Llegas 10 minutos antes.', pregunta7: 'Tratas de entender a tu jefe.', pregunta8: 'Aceptas consejos con respeto.', pregunta9: 'Te incomoda pero no tanto.', pregunta10: 'Saludo Primero.', pregunta11: 'Te incomoda pero no mucho.', pregunta12: 'Esperas un momento para hablar.', pregunta13: 'Casi siempre llego temprano.', pregunta14: 'Te acercas a ayudarle.'},
                    fotodnidelantera: r.data.foto_documento_delantera,
                    fotodnitrasera: r.data.foto_documento_posterior,
                    foto: r.data.foto,
                    firma: r.data.firma ? r.data.firma : null,
                    changeSignature: r.data.firma ? false : true,
                    isChofer: r.data.chofer,
                    fotolicenciadelantera: r.data.foto_licencia_delantera,
                    fotolicenciatrasera: r.data.foto_licencia_trasera,
                    historialbajas: r.historialbajas ? r.historialbajas : [],
                    numhijos: r.data.numero_hijos,
                    edadhijos: r.data.edad_hijos,
                    tienevacuna: r.data.tiene_vacuna ? r.data.tiene_vacuna : '',
                    cartillavacuna: r.data.adjunto_cartilla_vacuna ? JSON.parse(r.data.adjunto_cartilla_vacuna) : '',
                    cartillavacunapdf: r.data.adjunto_cartilla_vacuna_pdf ? r.data.adjunto_cartilla_vacuna_pdf : '',
                    sideCartilla:  (r.data.adjunto_cartilla_vacuna_pdf ? 'A' : (r.data.adjunto_cartilla_vacuna ? 'B' : 'A')),
                    cartillaverificada: r.data.cartilla_verificada ? Boolean(r.data.cartilla_verificada) : false,
                    resultadocovid: r.data.resultado_covid,
                    pruebacovid: r.data.adjunto_prueba_covid ? JSON.parse(r.data.adjunto_prueba_covid) : [],
                    informecovid: r.data.adjunto_informe_covid ? JSON.parse(r.data.adjunto_informe_covid) : [],
                    videopresentacion: r.data.video_introduccion ? r.data.video_introduccion : '',
                    fotorecibo: r.data.recibos ? r.data.recibos : '',
                    certificadoantecedente: r.data.certificado_antecedente ? JSON.parse(r.data.certificado_antecedente) : '',
                    certificadoantecedentepdf: r.data.certificado_antecedente_pdf ? r.data.certificado_antecedente_pdf : '',
                    tienecuenta: r.data.tiene_cuenta ? r.data.tiene_cuenta : false,
                    fechaemisioncertificado: r.data.certificado_antecedente_fecha ? (r.data.certificado_antecedente_fecha).slice(0, 10) : '',
                    diaspasadoscertificadoantecedente: r.diaspasadoscertificadoantecedente,
                    documentoVigente: r.data.documento_vigente,
                    historialContacto: r.historialContacto ? JSON.parse(r.historialContacto) : [],
                    isLoading: false,
                });

                if(r.data.usuario.genero_id){
                    this.getActividadesList(r.data.usuario.genero_id, r.data.postulando_pais_id, true);
                }else{
                    this.getActividadesList(2, r.data.postulando_pais_id);
                }
                this.getData(r.data.usuario.genero_id, r.data.postulando_pais_id);

                if (r.diaspasadoscertificadoantecedente){
                    if((r.diaspasadoscertificadoantecedente >= 0) && (r.diaspasadoscertificadoantecedente <= 84)){
                        console.log('Dentro del limite');
                    }else if (r.diaspasadoscertificadoantecedente >= 85){
                        this.setState({showAlertModal: true});
                    }
                }

            }else if(r.code === 500){
                this.setLoading(false)
            }
        }).catch( function (error) {

        });

        this.getRequis();


    }

    render() {

        let {isLoadingSave, contactname, showAlertModal, diaspasadoscertificadoantecedente, flagemoji, nombres, apellidos, checkaprobado, historialContacto, token, keyTab, documentoVigente, verificaciones, adjuntoeducacion, certificadoantecedentepdf, tienecuenta, fotodnidelantera, estatuspostulante, isLoading, show, cartillavacuna, cartillaverificada} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        let antecedentes = {iconColor: '', tooltip:'', modalMsj: ''};

        if (certificadoantecedentepdf){
            if (diaspasadoscertificadoantecedente){
                if(diaspasadoscertificadoantecedente >= 0 && diaspasadoscertificadoantecedente <= 84){
                    antecedentes.iconColor = 'text-success';
                    antecedentes.tooltip = 'Vigencia restante certificado único laboral: ' + (90 - diaspasadoscertificadoantecedente) + ' dia(s)';
                }else if(diaspasadoscertificadoantecedente >= 85 && diaspasadoscertificadoantecedente <= 89){
                    antecedentes.iconColor = 'text-warning';
                    antecedentes.tooltip = 'Vigencia restante certificado único laboral : ' + (90 - diaspasadoscertificadoantecedente) + ' dia(s)';
                    antecedentes.modalMsj = 'El certificado Unico Laboral del postulante esta por vencer dentro de ' + (90 - diaspasadoscertificadoantecedente) + ' dia(s).';
                }else if(diaspasadoscertificadoantecedente >= 90){
                    antecedentes.iconColor = 'text-red';
                    antecedentes.tooltip = 'Certificado único laboral VIGENCIA VENCIDA';
                    antecedentes.modalMsj = 'El certificado Unico Laboral del postulante YA VENCIO. Favor de actualizar.';
                }
            }else{
                antecedentes.iconColor = 'text-success';
                antecedentes.tooltip = 'Tiene certificado único laboral';
            }
        }else{
            if (tienecuenta == true ){
                antecedentes.iconColor = 'text-warning';
                antecedentes.tooltip = 'Tiene una cuenta registrada. Solicitar su certificado único laboral';
            }else{
                antecedentes.iconColor = 'text-secondary';
                antecedentes.tooltip = 'No cuenta con certificado único laboral';
            }
        }

        return (
            <>
                {(showAlertModal) &&
                    <AlertCertificadoModal showAlertModal={true} alertMSJ={antecedentes.modalMsj}/>
                }

                <div className="header-box-pink">
                    <div className='row mx-0'>
                        <div className='col-6 align-self-center'>
                            <>Editar Postulante</>
                        </div>
                        <div className="col-6 d-flex justify-content-end align-self-center">
                            <TooltipCopy copyText={'https://holabertha.com/ficha-postulante/' + token} buttonColor={'pruple'} additionalStyle={'border-circled-white'} icon={'fas fa-share-alt text-white'} estilo={'tooltip-tc'} placement={'bottom'} text={'Compartir Ficha'} textResponsive={'Compartir Ficha'} responsive={false}/>
                        </div>
                    </div>
                </div>

                <section className="bertha-form">

                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <HistorialContacto historial={historialContacto} handleContactado={this.handleContactado} trabajador={nombres + ' ' + apellidos}/>

                        <Tabs defaultActiveKey={diaspasadoscertificadoantecedente >=85 ? 'tab3' :keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">

                            <Tab eventKey="tab1" title={<span>Datos</span>}>
                                <Datos
                                    data={this.state}
                                    view={'Edit'}
                                    loadDistritoOptions={this.loadDistritoOptions}
                                    handleChange={this.handleChange}
                                    removeContacto={this.removeContacto}
                                    saveState={this.saveState}
                                    cleanModal={this.cleanModal}
                                />
                            </Tab>

                            <Tab eventKey="tab2" title={<span>Adjuntos <i className={'fas fa-id-card-alt ms-1 ' + (fotodnidelantera ? (parseInt(documentoVigente) == 0 ? 'text-danger' : 'text-purple-bertha') : 'text-secondary')}></i></span>}>
                                <Adjuntos
                                    data={this.state}
                                    handleChange={this.handleChange}
                                    handleSingularUpload={this.handleSingularUpload}
                                    handleSingularDelete={this.handleSingularDelete}
                                    changeVigenciaDocumento={this.changeVigenciaDocumento}
                                    actionDeleteAdjunto={this.actionDeleteAdjunto}
                                    referenciaFirma={this.sigPad}
                                    modoEdicionFirma={true}
                                    contactname={contactname}
                                    flagemoji={flagemoji}
                                />
                            </Tab>

                            <Tab eventKey="tab3" title={<span>Antecedentes <i className={'fas fa-portrait ms-1 ' + antecedentes.iconColor} data-toggle="tooltip" data-placement="bottom" title={antecedentes.tooltip}></i></span>}>
                                <CertificadoAntecedente
                                    data={this.state}
                                    handleChange={this.handleChange}
                                    changeEstatusCUL={this.changeEstatusCUL}
                                    handleSingularUpload={this.handleSingularUpload}
                                    handleSingularDelete={this.handleSingularDelete}
                                    antecedentesIcon={antecedentes}
                                    contactname={contactname}
                                    flagemoji={flagemoji}
                                />
                                <hr/>
                            </Tab>

                            <Tab eventKey="tab4" title={<span>Experiencia <BadgeTab content={verificaciones.length} color={'#513675'}/></span>}>
                                <VerificacionesLaborales
                                    data={this.state}
                                    loadDistritoOptions={this.loadDistritoOptionsExperiencia}
                                    handleChange={this.handleChange}
                                    addVerificacion={this.addVerificacion}
                                    removeVerificacion={this.removeVerificacion}
                                    handleUpload={this.handleUpload}
                                    handleDeleteAdjunto={this.handleDeleteAdjunto}
                                    handleRenameAdjunto={this.handleRenameAdjunto}
                                    contactname={contactname}
                                    flagemoji={flagemoji}
                                /> <hr/>
                            </Tab>

                            <Tab eventKey="tab5" title={<span>Estudios <BadgeTab content={adjuntoeducacion.length} color={'#ff0080'}/></span>}>
                                <Educacion
                                    data={this.state}
                                    handleChange={this.handleChange}
                                    addEducacion={this.addEducacion}
                                    removeEducacion={this.removeEducacion}
                                    handleUpload={this.handleUpload}
                                    handleDeleteAdjunto={this.handleDeleteAdjunto}
                                    handleRenameAdjunto={this.handleRenameAdjunto}
                                    contactname={contactname}
                                    flagemoji={flagemoji}
                                /> <hr/>
                            </Tab>

                        </Tabs>


                        {[8].includes(estatuspostulante) &&
                            <div className="row">
                                <div className="col-sm">
                                    <h5 className="hk-sec-title mb-4 mt-2">Validar Registro</h5>
                                    <div className="mt-35">
                                        <div className="alert alert-secondary mb-40" role="alert">
                                            <div className="d-flex flex-wrap">
                                                <div>Para aceptar que la información proporcionada por el postulante es
                                                    correcta y veraz, tilde el siguiente botón para constatar dicho
                                                    registro.
                                                </div>
                                                <div className="ms-sm-4 ms-lg-4 mt-4 mt-sm-5 mt-lg-0">
                                                    <div className="custom-control custom-switch">
                                                        <input type="checkbox" name="checkaprobado"
                                                               onChange={(e) => this.handleChange(e, 'checkaprobado')}
                                                               checked={checkaprobado}
                                                               className="custom-control-input" id="customSwitch11"/>
                                                        <label className="custom-control-label"
                                                               htmlFor="customSwitch11">Aprobado</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                            </div>
                        }

                        {formButtons(isLoadingSave, 'edit', (this.cancelar), null, null)}

                    </form>

                </section>

            </>

        );
    }
}

export default withRouter(PostulantesEdit);

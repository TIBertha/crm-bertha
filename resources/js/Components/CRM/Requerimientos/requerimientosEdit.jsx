import React, { Component } from "react";
import {useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import {Tab, Tabs} from "react-bootstrap";
import "react-phone-input-2/lib/style.css";
import TitleLabel from "../Components/titleLabel.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";
import {modalCancelar, showAlertConfirmRedirectReactRouter, showAlert} from "../../Helpers/alerts.js";
import {
    ajaxGetCorreoEmpleador,
    ajaxRequerimientosEdit,
    ajaxRequerimientosUploadAdjuntoAdelanto,
    ajaxSaveNewDomicilioEmpleador,
    ajaxSearchDistrito,
    ajaxSearchEmpleadores,
    ajaxSearchTrabajadoresPorColocar,
    ajaxSetDistrito,
    ajaxSetDivisaPais,
    ajaxRequerimientosGet,
    ajaxSetNewTiposBeneficios, getCostoPorDia
} from "../../Functions/Requerimientos.jsx";
import {armarHorarioRequerimiento, getExtensionFromString, removeExtensionFromString} from "../../Helpers/strings.js";
import {formButtons} from "../../Functions/General.jsx";
import DatosRequerimientos from "./Tabs/datosRequerimientos.jsx";
import {filesize} from "filesize";
import Postulaciones from "./Tabs/Postulaciones/postulaciones.jsx";
import { v4 as uuidv4 } from 'uuid';

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class RequerimientosEdit extends Component{
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            show: props.show,
            id: props.params.id,
            paispedido: 54,
            divisa: {valor: 'PEN', tooltip: 'SOL - PERU' },
            supervisor: [],
            empleador: '',
            nombres: '',
            apellidos: '',
            telefono: '',
            tipocontrato: '',
            actividad: 1,
            actividadNombre: 'todo servicio',
            tipovivienda: 1,
            modalidad: '',
            nacionalidad: '',
            empleadornombres: '',
            rangominimo: '',
            rangomaximo: '',
            sueldo: '',
            sueldoPrimerMes: '',
            numpisos: '',
            numadultos:'',
            numbebes:'',
            numninos: '',
            nummascotas: '',
            edadninos: [],
            edadbebes: [],
            edadadulto: [],
            responsable: '',
            responsables: [],
            distrito: '',
            fechaentrevista: '',
            horaentrevista: '',
            diagnostico: '',
            observaciones: '',
            observacionesWeb: '',
            trabajador: [],
            actividades: [],
            tipoviviendas: [],
            modalidades: [],
            nacionalidades: [],
            cantidades: [],
            cantidadesPisos: [],
            tiposcontratos: [],
            distritos: [],
            estatusreq: [],
            seguimientos: [],
            estatus: '',
            cuarentena: [],
            frecuencia: '',
            frecuencias: [],
            valordiafrecuencia: 70,
            isValorDiaFrecuenciaValido: true,
            sueldomensual: '',
            tiposdescansos: [],
            horarios: [],
            diasalida: '',
            diaretorno: '',
            horasalida: '',
            horaretorno: '',
            diassemana: [],
            isLoading: false,
            postulaciones: 0,
            tipoBeneficio: '',
            tiposBeneficios: [],
            linkDomicilio: '',
            domicilio: '',
            referenciaDomicilio: '',
            domicilios: [],
            nuevoDomicilio: [],
            showModaDomicilio: false,
            viewModalDomicilio: '1',
            loadingModalDomicilio: false,
            typeMsjCreateDomicilio: '',
            msjCreateDomicilio: '',
            fechainiciolabores: '',
            access: false,
            inputDomicilio: '',
            montoAdelanto: '',
            fechaPagoAdelanto: '',
            confirmacionAdelanto: false,
            adjuntoAdelanto: '',
            tipoComision: '',
            montoComision: '',
            isUploadingAdjuntoAdelanto: false,
            comprobanteAdelantoID: '',
            comprobanteAdelantoPDF: '',
            postulacionesPrevias: 0,
            paises: [],

            keyTab: 'tab1',
        };
        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addSeguimiento = this.addSeguimiento.bind(this);
        this.removeSeguimiento = this.removeSeguimiento.bind(this);
        this.loadDistritoOptions = this.loadDistritoOptions.bind(this);
        this.loadEmpleadoresOptions = this.loadEmpleadoresOptions.bind(this);
        this.loadTrabajadoresPorColocarOptions = this.loadTrabajadoresPorColocarOptions.bind(this);
        this.handleChangeHorarios = this.handleChangeHorarios.bind(this);
        this.cancelar = this.cancelar.bind(this);

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);

        this.getCorreoEmpleador = this.getCorreoEmpleador.bind(this);
        this.openModalDomicilio = this.openModalDomicilio.bind(this);
        this.closeModalDomicilio = this.closeModalDomicilio.bind(this);
        this.setNewDomicilio = this.setNewDomicilio.bind(this);
        this.saveNuevoDomicilio = this.saveNuevoDomicilio.bind(this);
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    setLoadingModalDomicilio(condition){
        this.setState({loadingModalDomicilio: condition});
    }

    setDistrito(domicilio){

        ajaxSetDistrito(domicilio).then(r => {
            if (r.code === 200){
                this.setState({
                    distrito: r.distrito,
                    referenciaDomicilio: r.referencia,
                    linkDomicilio: r.linkDomicilio,
                });
            }else if (r.code === 500){
                this.setState({

                });
            }
        }).catch(function (error) {
            if (error.response.status == 422){

            }
        });
    }

    saveNuevoDomicilio(e){

        e.preventDefault();

        this.setLoadingModalDomicilio(true);

        let {nuevoDomicilio, empleador} = this.state;

        ajaxSaveNewDomicilioEmpleador(nuevoDomicilio, empleador).then(r => {
            if (r.code === 200){
                this.setState({
                    viewModalDomicilio: '2',
                    typeMsjCreateDomicilio: r.type,
                    msjCreateDomicilio: r.msj,
                    linkDomicilio: r.linkDomicilio,
                    domicilio: r.domicilio,
                    domicilios: r.domicilios,
                    distrito: r.distrito,
                    referenciaDomicilio: r.referencia,
                });
                this.setLoadingModalDomicilio(false);
            }else if (r.code === 500){
                this.setState({
                    viewModalDomicilio: '2',
                    typeMsjCreateDomicilio: r.typeMsj,
                    msjCreateDomicilio: r.msj,
                });
                this.setLoadingModalDomicilio(false);
            }
        }).catch(function (error) {
            if (error.response.status == 422){
                this.setState({
                    viewModalDomicilio: '2',
                    typeMsjCreateDomicilio: r.typeMsj,
                    msjCreateDomicilio: r.msj,
                });
                this.setLoadingModalDomicilio(false);
            }
        });

    }

    getCorreoEmpleador(id){

        ajaxGetCorreoEmpleador(id).then(r => {
            if (r.code === 200){
                this.setState({
                    telefono: r.telefono,
                    domicilios: r.domicilios,
                })
            }
        }).catch(function (error) {
            if (error.response.status == 422){
                showAlert('error', r.msj);
            }
        });

    }

    setNewDomicilio(data) {
        this.setState({
            nuevoDomicilio: data,
        })
    }

    openModalDomicilio() {
        this.setState({
            openModalDomicilio: true,
            viewModalDomicilio: '1',
        })
    }

    closeModalDomicilio() {
        this.setState({
            openModalDomicilio: false,
            nuevoDomicilio: [],
        })
    }

    /*-Tags-*/
    handleDelete(e, campo) {
        const { edades, edadbebes, edadninos, edadadulto } = this.state;

        if (campo == 'edadbebes'){
            this.setState({
                edadbebes: edadbebes.filter((tag, index) => index !== e),
            });
        }else if (campo == 'edadninos'){
            this.setState({
                edadninos: edadninos.filter((tag, index) => index !== e),
            });
        }else if (campo == 'edadadulto'){
            this.setState({
                edadadulto: edadadulto.filter((tag, index) => index !== e),
            });
        }else{
            this.setState({
                edades: edades.filter((tag, index) => index !== e),
            });
        }

    }

    handleAddition(e, campo) {

        if (campo == 'edadbebes'){
            this.setState(state => ({ edadbebes: [...state.edadbebes, e] }));
        }else if (campo == 'edadninos'){
            this.setState(state => ({ edadninos: [...state.edadninos, e] }));
        }else if (campo == 'edadadulto'){
            this.setState(state => ({ edadadulto: [...state.edadadulto, e] }));
        }else{
            this.setState(state => ({ edades: [...state.edades, e] }));
        }

    }

    handleDrag(tag, currPos, newPos, campo) {

        if (campo == 'edadbebes'){
            const edades = [...this.state.edadbebes];
            const newTags = edades.slice();

            newTags.splice(currPos, 1);
            newTags.splice(newPos, 0, tag);

            // re-render
            this.setState({ edadbebes: newTags });
        }else if (campo == 'edadninos'){
            const edades = [...this.state.edadninos];
            const newTags = edades.slice();

            newTags.splice(currPos, 1);
            newTags.splice(newPos, 0, tag);

            // re-render
            this.setState({ edadninos: newTags });
        }else if (campo == 'edadadulto'){
            const edades = [...this.state.edadadulto];
            const newTags = edades.slice();

            newTags.splice(currPos, 1);
            newTags.splice(newPos, 0, tag);

            // re-render
            this.setState({ edadadulto: newTags });
        }else{
            const edades = [...this.state.edades];
            const newTags = edades.slice();

            newTags.splice(currPos, 1);
            newTags.splice(newPos, 0, tag);

            // re-render
            this.setState({ edades: newTags });
        }

    }
    /*-Tags-*/

    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/requerimientos', navigate)
    }

    addSeguimiento(){
        this.setState({
            seguimientos: this.state.seguimientos.concat([{ fecha: moment().format('DD/MM/YYYY'), detalle: '' }])
        });
    };

    removeSeguimiento(idx){
        this.setState({
            seguimientos: this.state.seguimientos.filter((s, sidx) => idx !== sidx)
        });
    };


    handleChange(e, tipo = '', campo = '') {

        if(tipo == 'time'){

            this.setState({
                [campo]: e
            });

        }else if(tipo == 'tipoComision'){

            this.setState({
                tipoComision: e.target.value,
                montoComision: getMontoComision(e.target.value, null, null, this.state),
            });

        }else if(tipo == 'empleador'){

            this.setState({
                empleador: e
            }, this.getCorreoEmpleador(e.value));

        }else if(tipo == 'edad') {

            let edad = this.state.edad;

            if(campo == 'multiple'){

                edad.forEach(m => {

                    if(e.target.checked == true){

                        if(m.id != 4){
                            m.isChecked = false;
                            m.disabled = true;
                        }else{
                            m.isChecked = true;
                        }

                    }else{

                        if(m.id != 4){
                            m.isChecked = false;
                            m.disabled = false;
                        }else{
                            m.isChecked = false;
                        }

                    }

                });

            }else if(campo == 'single'){

                edad.forEach(m => {
                    if (m.value === e.target.value)
                        m.isChecked = e.target.checked
                });

            }

            this.setState({edad: edad});

        }else if(tipo == 'calculo'){
            if(campo == 'sueldo'){
                let {value} = e;

                this.setState({
                    [campo]: value,
                    sueldoPrimerMes: getSueldoPrimerMes(e, this.state.paispedido),
                });
            }else if(campo == 'valordiafrecuencia'){
                let {value} = e;
                let minvalue = getValordiaFrecuencia(this.state.paispedido);

                this.setState({
                    [campo] : value,
                    isValorDiaFrecuenciaValido: (value < minvalue) ? false : true
                }, this.calculoSueldoPorDias(value) );

            }else if (campo == 'montoAdelanto'){
                let {value} = e;

                this.setState({
                    [campo]: value,
                    fechaPagoAdelanto: new Date(),
                });
            }
        }else if(tipo == 'seguimiento'){

            const newSeguimiento = this.state.seguimientos.map((seguimiento, sidx) => {
                if (campo !== sidx) return seguimiento;
                return { ...seguimiento, [e.target.name]: e.target.value.toUpperCase() };
            });

            this.setState({ seguimientos: newSeguimiento});

        }else if(tipo == 'modalidad'){

            this.setState({
                modalidad: e.target.value,
                montoComision: getMontoComision(null, null, e.target.value, this.state),
            }, this.changeModalidad(e.target.value) );

            if(parseInt(e.target.value) == 3){
                this.setState({tipoBeneficio: 4});
            }

        }else if (tipo == 'paispedido'){

            let value = parseInt(e.target.value);

            if (value == 49){
                this.setState({
                    tipoComision: 3,
                    montoComision: getMontoComision(e.target.value, null, null, this.state),
                })
            }

            this.setState({
                paispedido: value,
            }, this.setDivisaPais(value));

        }else if(tipo == 'frecuencia'){

            this.setState({
                frecuencia : e.target.value
            }, this.calculoSueldoPorDias );

        }else if (['rangominimo','rangomaximo'].includes(tipo)){

            this.setState({
                [e.target.name]: e.target.value.toUpperCase(),
            });

        }else if (tipo == 'domicilio'){

            this.setState({
                [e.target.name]: e.target.value.toUpperCase(),
            }, this.setDistrito(e.target.value) );

        }else if (tipo == 'codigoTelefonico'){

            this.setState({
                [campo]: e,
            });

        }else if (tipo == 'adjuntoAdelanto'){
            let file = e.target.files[0];

            const uploadedFile = ({
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
            });

            this.actionUploadFile(uploadedFile);
        }else{

            if(tipo == 'observaciones'){

                const input = e.target;
                const start = input.selectionStart;
                const end = input.selectionEnd;

                this.setState({
                    [e.target.name]: e.target.value
                }, () => input.setSelectionRange(start, end));

            }else if(tipo == 'observacionesWeb'){

                const input = e.target;
                const start = input.selectionStart;
                const end = input.selectionEnd;

                this.setState({
                    [e.target.name]: e.target.value
                }, () => input.setSelectionRange(start, end));

            }else{

                this.setState({
                    [e.target.name]: e.target.value.toUpperCase()
                });

            }

        }

    }

    actionUploadFile(uploadedFile){

        this.setState({isUploadingAdjuntoAdelanto: true });

        let data = new FormData();

        data.append("file", uploadedFile.file, uploadedFile.name);
        data.append("fileid", uploadedFile.id);
        data.append("filesize", uploadedFile.size);
        data.append("filename", uploadedFile.name);
        data.append("extension", uploadedFile.extension);
        data.append("fecha", uploadedFile.fecha);

        ajaxRequerimientosUploadAdjuntoAdelanto(data).then(r => {
            if (r.code === 200) {
                this.setState({
                    confirmacionAdelanto: true,
                    adjuntoAdelanto: r.adjunto.url,
                    isUploadingAdjuntoAdelanto: false,
                });
            } else if (r.code === 500) {
                this.setState({
                    confirmacionAdelanto: false,
                    adjuntoAdelanto: '',
                    isUploadingAdjuntoAdelanto: false,
                });
                showAlert('error', r.msj);
            }
        })
            .catch(() => {
                this.setState({
                    confirmacionAdelanto: false,
                    adjuntoAdelanto: '',
                    isUploadingAdjuntoAdelanto: false,
                });
                showAlert('error', 'Ocurrió un problema al adjuntar archivo. Consulte al administrador');
            });
    }

    handleChangeHorarios(e, id, campo){

        const newHorarios = this.state.horarios.map((item) => {

            let value = '';

            if(campo == 'isDescanso'){
                value = e.target.checked;
            }else{
                value = e ? moment(e).format() : e
            }

            if (item.id === id) {

                const updatedDia = {
                    ...item,
                    [campo]: value,
                };

                return updatedDia;
            }else{
                if (id == '1'){
                    if (['horaingreso', 'horasalida'].includes(campo)){
                        const updatedDia = {
                            ...item,
                            [campo]: value,
                        };

                        return updatedDia;
                    }
                }
            }

            return item;

        });

        this.setState({horarios: newHorarios});

    }

    calculoSueldoPorDias(valordia){

        let costodia = 0;
        let sueldo = 0;
        let {frecuencia, paispedido, valordiafrecuencia} = this.state;

        if(valordia){
            costodia = valordia;
        }else{
            this.setState({
                valordiafrecuencia: getCostoPorDia(paispedido, valordia, valordiafrecuencia)
            });
        }

        let condition = (frecuencia && costodia) ? true : false;

        if (condition == true){
            if(frecuencia < 4){
                sueldo = costodia * 12;
            }else{
                sueldo = (costodia * frecuencia) * 4;
            }
        }

        const isValid = condition === true;

        this.setState({
            sueldo: isValid ? sueldo : '',
            montoComision: isValid ? getMontoComision(null, sueldo, null, this.state) : '',
            sueldomensual: isValid ? 4 * frecuencia * costodia : '',
            sueldoPrimerMes: isValid ? (costodia - (parseInt(paispedido) === 49 ? 100 : 20)) * frecuencia * 4 : '',
        });

    }

    save(e){

        e.preventDefault();
        this.setLoading(true);
        let self = this;

        let {id, horasalida, horaretorno, horaentrevista} = this.state;

        let hs = horasalida ? moment(horasalida).format() : horasalida;
        let hr = horaretorno ? moment(horaretorno).format() : horaretorno;
        let he = horaentrevista ? moment(horaentrevista).format() : horaentrevista;

        ajaxRequerimientosEdit(this.state, id, hs, hr, he).then(r => {
            if (r.code === 200){
                this.setLoading(false);
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/requerimientos', navigate);
            }else if (r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        }).catch(function (error) {
            if (error.response.status == 422){
                self.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    changeModalidad(modalidad){
        const {tipoBeneficio} = this.state;
        this.setSelectionModCount(modalidad,null);
        this.setState({
            frecuencia: '',
            valordiafrecuencia: 70,
            cuarentena: (modalidad == 1) ? 1 : '',
            horarios: armarHorarioRequerimiento(modalidad),
            tipoBeneficio: [5].includes(parseInt(modalidad)) ? 4 : tipoBeneficio,
        });
    }

    setDivisaPais(paisID, tipoBeneficio = null){

        this.setSelectionModCount(null,paisID);
        ajaxSetDivisaPais(paisID).then(r => {
            this.setState({
                divisa: r.divisa,
            });
        });
        ajaxSetNewTiposBeneficios(paisID).then(r => {
            this.setState({
                tiposBeneficios: r.tiposBeneficios,
                tipoBeneficio: tipoBeneficio ? tipoBeneficio : '',
            });
        });
    }

    setSelectionModCount(modalidadReq,paisReq){
        let mainModalidadID = modalidadReq ? modalidadReq : this.state.modalidad;
        let mainPaisID = paisReq ? paisReq : this.state.paispedido;
        let result = '';

        if (parseInt(mainPaisID) == 11){
            if([1,2].includes(parseInt(mainModalidadID))){
                result = 5
            }else if([3,5].includes(parseInt(mainModalidadID))){
                result = 6;
            }
        }else if (parseInt(mainPaisID) == 54){
            if([3,5].includes(parseInt(mainModalidadID))){
                result = 4;
            }
        }else if (parseInt(mainPaisID) == 49){
            result = 3;
        }

        this.setState({
            tipoBeneficio: result,
        });
    }

    getTotalPostulaciones(){

        let id = this.state.id;

        ajaxRequerimientosGet(id).then(r => {
            if (r.code === 200){
                this.setState({
                    postulaciones: r.postulaciones,
                });
            }else if (r.code === 5000){
                showAlert('error', r.msj);
            }
        }).catch(function (error) {
            if (error.response.status == 422){
                showAlert('error', r.msj);
            }
        });
    }

    getData(){

        this.setLoading(true);

        let {id} = this.state;

        ajaxRequerimientosGet(id).then(r => {
            if(r.code === 200){

                this.setDivisaPais(r.data.paispedido_id, r.data.tipobeneficio_id);

                this.setState({
                    tipoComision: r.data.tipocomision,
                    inputDomicilio: r.data.input_domicilio,
                    montoComision: r.data.monto_comision,
                    paispedido: r.data.paispedido_id,
                    postulacionesPrevias: r.postulacionesPrevias,
                    paises: r.paises,
                    supervisor: r.supervisor,
                    tipoBeneficio: r.data.tipobeneficio_id,
                    telefono: r.data.telefono,
                    cuarentena: r.data.tiempo_cuarentena != null ? r.data.tiempo_cuarentena : null,
                    actividades: r.actividades,
                    tipoviviendas: r.tipoviviendas,
                    modalidades: r.modalidades,
                    nacionalidades: r.nacionalidades,
                    cantidades: r.cantidades,
                    cantidadesPisos: r.cantidadespisos,
                    tiposcontratos: r.tiposcontratos,
                    empleador: r.empleador,
                    tipocontrato: r.tipocontratoid,
                    actividad: r.data.actividadid,
                    actividadNombre: r.data.actividad,
                    tipovivienda: r.data.tipovivienda_id,
                    modalidad: r.data.modalidadid,
                    nacionalidad: r.data.nacionalidadid ? r.data.nacionalidadid : '',
                    rangominimo: r.rangoedad ? r.rangoedad.min : '',
                    rangomaximo: r.rangoedad ? r.rangoedad.max : '',
                    sueldo: r.data.sueldo,
                    distrito: r.distrito,
                    referenciaDomicilio: r.referencia,
                    numpisos: r.data.num_pisos,
                    numadultos: r.data.num_adultos,
                    numbebes: r.data.num_bebes,
                    numninos: r.data.num_ninos,
                    nummascotas: r.data.num_mascotas,
                    edadninos: r.data.edad_nino ? JSON.parse(r.data.edad_nino) : [],
                    edadbebes: r.data.edad_bebe ? JSON.parse(r.data.edad_bebe) : [],
                    edadadulto: r.data.edad_adulto ? JSON.parse(r.data.edad_adulto) : [],
                    fechaentrevista: r.data.fechaentrevista ? moment(r.data.fechaentrevista,"YYYY-MM-DD").toDate() : '',
                    horaentrevista: r.data.horaentrevista ? moment(r.data.horaentrevista,"YYYY-MM-DD HH:mm:ss").toDate() : '',
                    fechainiciolabores: r.data.fecha_inicio_labores ? moment(r.data.fecha_inicio_labores,"YYYY-MM-DD").toDate() : '',
                    horainiciolabores: r.data.hora_inicio_labores ? moment(r.data.hora_inicio_labores,"YYYY-MM-DD HH:mm:ss").toDate() : '',
                    diagnostico: r.data.diagnostico,
                    empleadornombres: r.data.empleadornombres,
                    observaciones: r.data.observaciones,
                    observacionesWeb: r.data.observaciones_web ? r.data.observaciones_web : '',
                    trabajador: r.trabajador,
                    seguimientos: r.data.seguimientos ? JSON.parse(r.data.seguimientos) : [],
                    estatus: r.data.estatusrequerimiento_id,
                    estatusreq: r.estatusreq,
                    responsable: r.data.usuariointerno_id ? r.data.usuariointerno_id : '',
                    frecuencia: r.data.frecuenciaservicio_id,
                    frecuencias: r.frecuencias,
                    valordiafrecuencia: r.data.valor_dia_frecuencia,
                    sueldomensual: r.data.sueldo_por_dias,
                    tiposdescansos: r.tiposdescansos,
                    horarios: r.data.horarios ? JSON.parse(r.data.horarios) : armarHorarioRequerimiento(r.data.modalidad_id),
                    diasalida: r.data.dia_salida,
                    horasalida: r.data.hora_salida ? moment(r.data.hora_salida,"YYYY-MM-DD HH:mm:ss").toDate() : '',
                    diaretorno: r.data.dia_ingreso,
                    horaretorno: r.data.hora_ingreso ? moment(r.data.hora_ingreso,"YYYY-MM-DD HH:mm:ss").toDate() : '',
                    diassemana: r.diassemana,
                    postulaciones: r.postulaciones,
                    domicilio: r.data.domicilioid,
                    domicilios: r.domicilios,
                    linkDomicilio: r.linkDomicilio,
                    confirmacionAdelanto: r.data.confirmacion_adelanto,
                    adjuntoAdelanto: r.data.adjunto_adelanto,
                    comprobanteAdelantoID: r.comprobanteadelanto ? r.comprobanteadelanto.comprobanteAdelantoID : '',
                    comprobanteAdelantoPDF: r.comprobanteadelanto ? r.comprobanteadelanto.comprobanteAdelantoPDF : '',
                    access: r.accessCom,
                    montoAdelanto: r.data.monto_adelanto,
                    fechaPagoAdelanto:r.data.fecha_pago_adelanto ? moment(r.data.fecha_pago_adelanto,"YYYY-MM-DD").toDate() : '',
                });

                if(r.data.modalidad_id != 3){
                    this.setState({
                        montoComision: getMontoComision(null, r.data.sueldo, null, this.state),
                        sueldoPrimerMes: getSueldoPrimerMes(r.data.sueldo, r.data.paispedido_id, false),
                    });
                }else{
                    this.calculoSueldoPorDias(r.data.valor_dia_frecuencia);
                }


                this.setLoading(false);

            }else if(r.code === 500){

                this.setLoading(false);

                showAlert('error', r.msj);

            }
        });

    }

    loadDistritoOptions(search, callback){

        if (!search) {
            callback([]);
        } else {

            setTimeout(() => {

                ajaxSearchDistrito(search).then(r => {
                    callback(r.data);
                }).catch(function (error) {
                    console.log(error);
                });

            });
        }
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

    loadTrabajadoresPorColocarOptions(search, callback){

        if (!search) {
            callback([]);
        } else {

            setTimeout(() => {

                ajaxSearchTrabajadoresPorColocar(search).then(r => {
                    callback(r.data);
                }).catch(function (error) {
                    console.log(error);
                });

            });
        }
    }

    componentDidMount(){
        this.getData();
    }

    render() {
        let {url, id, keyTab, empleador, confirmacionAdelanto, comprobanteAdelantoID, isLoading} = this.state;

        let coinIcon = {color: 'text-secondary', tooltip: 'No pagó adelanto'};

        if (comprobanteAdelantoID){
            coinIcon.color = 'text-warning';
            coinIcon.tooltip = 'Ya pagó adelanto - Comprobante realizado por el CRM';
        }else if(confirmacionAdelanto === true){
            coinIcon.color = 'text-warning';
            coinIcon.tooltip = 'Ya pagó adelanto - Comprobante realizado por externo';
        }

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <>
                <TitleLabel content={'Editar requerimiento'} />

                <section className="bertha-form">
                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey="tab1" className="tabs-pink nav-white-style">

                            <Tab eventKey="tab1" title="Datos">
                                <DatosRequerimientos
                                    url={url}
                                    view={'edit'}
                                    data={this.state}
                                    show={false}
                                    handleChange={this.handleChange}
                                    loadEmpleadoresOptions={this.loadEmpleadoresOptions}
                                    openModalDomicilio={this.openModalDomicilio}
                                    closeModalDomicilio={this.closeModalDomicilio}
                                    setNewDomicilio={this.setNewDomicilio}
                                    saveNuevoDomicilio={this.saveNuevoDomicilio}
                                    loadDistritoOptions={this.loadDistritoOptions}
                                    handleDelete={this.handleDelete}
                                    handleAddition={this.handleAddition}
                                    handleDrag={this.handleDrag}
                                    handleChangeHorarios={this.handleChangeHorarios}
                                    addSeguimiento={this.addSeguimiento}
                                    removeSeguimiento={this.removeSeguimiento}
                                />
                            </Tab>
                        </Tabs>

                        <Tab eventKey="tab2" title={'Postulaciones'}>
                            <Postulaciones
                                data={this.state}
                                requerimientoid={id}
                                empleador={empleador}
                            />
                        </Tab>

                        {['tab1', 'tab3'].includes(keyTab) &&
                            <>{formButtons(isLoading, 'edit', null, '/requerimientos', null)}</>
                        }

                    </form>
                </section>

            </>
        )
    }
}

export default withRouter(RequerimientosEdit);

import React, { Component } from "react";
import {useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";
import "react-datepicker/dist/react-datepicker.css";
import {Tab, Tabs} from "react-bootstrap";
import "react-phone-input-2/lib/style.css";
import TitleLabel from "../Components/titleLabel.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";
import {modalCancelar, showAlertConfirmRedirectReactRouter, showAlert} from "../../Helpers/alerts.js";
import {
    ajaxGetCorreoEmpleador,
    ajaxRequerimientosGetData,
    ajaxRequerimientosGetModalidad,
    ajaxRequerimientosNew,
    ajaxRequerimientosUploadAdjuntoAdelanto,
    ajaxSaveNewDomicilioEmpleador,
    ajaxSaveNewEmpleador,
    ajaxSearchDistrito,
    ajaxSearchEmpleadores,
    ajaxSearchTrabajadoresPorColocar,
    ajaxSetDistrito,
    ajaxSetDivisaPais,
    ajaxSetNewTiposBeneficios,
    getSueldoPrimerMes,
    getCostoPorDia,
    getMontoComision
} from "../../Functions/Requerimientos.jsx";
import {armarHorarioRequerimiento} from "../../Helpers/strings.js";
import {formButtons} from "../../Functions/General.jsx";
import DatosRequerimientos from "./Tabs/datosRequerimientos.jsx";
import { v4 as uuidv4 } from 'uuid';

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class RequerimientosNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            paispedido: 54,
            divisa: {valor: 'PEN', tooltip: 'SOL - PERU' },
            tipoempleador: 1,
            empleador: '',
            nombres: '',
            apellidos: '',
            telefono: '',
            tipocontrato: 1,
            actividad: 1,
            tipovivienda: '',
            modalidad: 1,
            nacionalidad: '',
            rangominimo: '18',
            rangomaximo: '60',
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
            distrito: '',
            fechaentrevista: '',
            horaentrevista: '',
            diagnostico: '',
            observaciones: '',
            observacionesWeb: '',
            responsable: '',
            responsables: [],
            trabajador: [],
            actividades: [],
            tipoviviendas:[],
            modalidades: [],
            nacionalidades: [],
            cantidades: [],
            cantidadesPisos: [],
            tiposcontratos: [],
            distritos: [],
            seguimientos: [],
            cuarentena: '',
            frecuencia: '',
            frecuencias: [],
            diasfrecuencia: [],
            valordiafrecuencia: 80,
            isValorDiaFrecuenciaValido: true,
            sueldomensual: '',
            isLoading: false,
            tiposdescansos: [],
            diasalida: 6,
            diaretorno: 1,
            horasalida: setHours(setMinutes(new Date(), 0), 13),
            horaretorno: setHours(setMinutes(new Date(), 0), 7),
            diassemana: [],
            horarios: armarHorarioRequerimiento(1),
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
            openModalDomicilio: false,
            nuevoEmpleador: [],
            showModaEmpleador: false,
            viewModalEmpleador: '1',
            loadingModalEmpleador: false,
            typeMsjCreateEmpleador: '',
            msjCreateEmpleador: '',
            openModalEmpleador: false,
            fechainiciolabores:'',
            montoAdelanto: '',
            fechaPagoAdelanto: '',
            confirmacionAdelanto: false,
            adjuntoAdelanto: '',
            tipoComision: 1,
            montoComision: 700,
            isUploadingAdjuntoAdelanto: false,
            paises: [],

            keyTab: 'tab1',
        };

        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addSeguimiento = this.addSeguimiento.bind(this);
        this.removeSeguimiento = this.removeSeguimiento.bind(this);
        this.newEmpleador = this.newEmpleador.bind(this);
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

        this.openModalEmpleador = this.openModalEmpleador.bind(this);
        this.closeModalEmpleador = this.closeModalEmpleador.bind(this);
        this.setNewEmpleador = this.setNewEmpleador.bind(this);
        this.saveNuevoEmpleador = this.saveNuevoEmpleador.bind(this);
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    setLoadingModalDomicilio(condition){
        this.setState({loadingModalDomicilio: condition});
    }

    setDistrito(domicilio){

        let {actividad} = this.state;

        ajaxSetDistrito(domicilio).then(r => {
            if (r.code === 200){
                console.log(r);
                this.setState({
                    distrito: r.distrito,
                    referenciaDomicilio: r.referencia,
                    linkDomicilio: r.linkDomicilio,
                });
                if ([1, 4, 5, 9, 13, 14].includes(actividad)){
                    this.setState({
                        tipovivienda: r.tipoVivienda ? r.tipoVivienda : '',
                        numpisos: r.numeroPisos ? r.numeroPisos : '',
                    })
                }
            }else if (r.code === 500){
                this.setState({

                });
            }
        }).catch(function (error) {
            if (error.response.status == 422){
                showAlert('error', error.response.data);
            }
        });
    }

    setDivisaPais(paisID){

        this.setSelectionModCount(null,paisID);
        ajaxSetDivisaPais(paisID).then(r => {
            this.setState({
                divisa: r.divisa,
            });
        });
        ajaxSetNewTiposBeneficios(paisID).then(r => {
            this.setState({
                tiposBeneficios: r.tiposBeneficios,
                //tipoBeneficio: '',
            });
        });
    }

    setSelectionModCount(modalidadReq,paisReq){
        let mainModalidadID = modalidadReq ? modalidadReq : this.state.modalidad;
        let mainPaisID = paisReq ? paisReq : this.state.paispedido;

        let result = '';

        if ([11,49].includes(parseInt(mainPaisID))){
            if([1,2].includes(parseInt(mainModalidadID))){
                result = 5
            }else if([3,5].includes(parseInt(mainModalidadID))){
                result = 6;
            }
        }else if ([54].includes(parseInt(mainPaisID))){
            if([3,5].includes(parseInt(mainModalidadID))){
                result = 4;
            }
        }

        this.setState({
            tipoBeneficio: result,
        });
    }

    openModalEmpleador() {
        this.setState({
            openModalEmpleador: true,
            viewModalEmpleador: '1',
        })
    }

    closeModalEmpleador() {
        this.setState({
            openModalEmpleador: false,
            nuevoEmpleador: [],
        })
    }

    setNewEmpleador(data) {
        this.setState({
            nuevoEmpleador: data,
        })
    }

    saveNuevoEmpleador(e){

        e.preventDefault();

        this.setState({
            loadingModalEmpleador: true,
        });

        let {nuevoEmpleador} = this.state;

        ajaxSaveNewEmpleador(nuevoEmpleador).then(r => {
            if (r.code === 200){
                this.setState({

                    loadingModalEmpleador: false,
                    viewModalEmpleador: '2',
                    typeMsjCreateEmpleador: r.type,
                    msjCreateEmpleador: r.msj,
                    empleador: r.empleador,
                    telefono: r.telefono
                })
            }else if (r.code === 500){
                this.setState({
                    loadingModalEmpleador: false,
                    viewModalEmpleador: '2',
                    typeMsjCreateEmpleador: r.typeMsj,
                    msjCreateEmpleador: r.msj,
                })
            }
        }).catch(function (error) {
            if (error.response.status == 422){
                this.setState({
                    loadingModalEmpleador: false,
                    viewModalEmpleador: '2',
                    typeMsjCreateEmpleador: r.typeMsj,
                    msjCreateEmpleador: r.msj,
                })
            }
        });
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

    setNewDomicilio(data) {
        this.setState({
            nuevoDomicilio: data,
        })
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
                    tipovivienda: '',
                    numpisos: '',
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
        };

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
        };

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
                    montoComision: getMontoComision(null, value, null, this.state),
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

        }else if(tipo == 'cuarentena'){

            this.setState({cuarentena: e.target.value});

        }else if(tipo == 'tipoComision'){

            this.setState({
                tipoComision: e.target.value,
                montoComision: getMontoComision(e.target.value, null, null, this.state),
            });

        }else if(tipo == 'empleador'){

            this.setState({
                empleador: e,
                numpisos: '',
                tipovivienda: '',
                distrito: '',
                referenciaDomicilio: '',
            }, this.getCorreoEmpleador(e.value));

        }else if(tipo == 'actividad'){

            this.setState({
                actividad: e.target.value
            }, this.getModalidad );

        }else if(tipo == 'modalidad'){

            this.setState({
                modalidad: e.target.value,
                montoComision: getMontoComision(null, null, e.target.value, this.state),
            }, this.changeModalidad(e.target.value) );

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

        }else if(tipo == 'seguimiento'){

            const newSeguimiento = this.state.seguimientos.map((seguimiento, sidx) => {
                if (campo !== sidx) return seguimiento;
                return { ...seguimiento, [e.target.name]: e.target.value.toUpperCase() };
            });

            this.setState({ seguimientos: newSeguimiento});

        }else if(tipo == 'frecuencia'){

            this.setState({
                frecuencia : e.target.value
            }, this.calculoSueldoPorDias );

        }else if (tipo == 'tipoempleador'){

            this.setState({
                [e.target.name]: e.target.value.toUpperCase(),
                correo: '',
                empleador: '',
            });

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
                name: moment().format('DD/MM/YYYY'),
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

            if(campo === 'isDescanso'){
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
                if (id === '1'){
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

    calculoSueldoPorDias(valordia = null){

        let costodia = 0;
        let sueldo = 0;
        let {frecuencia, paispedido, valordiafrecuencia} = this.state;

        let newCostoDia = (valordia ? valordia : valordiafrecuencia);

        if(newCostoDia){
            costodia = newCostoDia;
        }else{
            this.setState({
                valordiafrecuencia: getCostoPorDia(paispedido, newCostoDia, valordiafrecuencia)
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

        let {horasalida, horaretorno, horaentrevista} = this.state;

        let hs = horasalida ? moment(horasalida).format() : horasalida;
        let hr = horaretorno ? moment(horaretorno).format() : horaretorno;
        let he = horaentrevista ? moment(horaentrevista).format() : horaentrevista;

        ajaxRequerimientosNew(this.state, hs, hr, he).then(r => {
            this.setLoading(false);
            if (r.code === 200){
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/requerimientos', navigate);
            }else if (r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch( function (error) {
            if (error.response.status == 422){
                self.setLoading(false);
                showAlert('error', error.response.data);
            }
        });

    }

    changeModalidad(modalidad){
        this.setSelectionModCount(modalidad,null);
        this.setState({
            frecuencia: '',
            valordiafrecuencia: 80,
            cuarentena: (modalidad == 1) ? 1 : '',
            horarios: armarHorarioRequerimiento(modalidad),
        });
    }

    getModalidad(){

        let actividad = this.state.actividad;

        if(actividad){

            ajaxRequerimientosGetModalidad(actividad).then(r => {
                if (r.code === 200){
                    this.setState({
                        modalidades: r.modalidades
                    });
                }else if (r.code === 500){
                    showAlert('error', r.msj);
                }
            }).catch(function (error) {
                if (error.response.status == 422){
                    showAlert('error', r.msj);
                }
            });

        }else{
            this.setState({
                modalidades: []
            });
        }

    }

    getData(){

        this.setLoading(true);

        ajaxRequerimientosGetData().then(r => {
            if (r.code === 200){
                this.setState({
                    paises: r.paises,
                    actividades: r.actividades,
                    tipoviviendas: r.tipoviviendas,
                    nacionalidades: r.nacionalidades,
                    cantidades: r.cantidades,
                    cantidadesPisos: r.cantidadespisos,
                    tiposcontratos: r.tiposcontratos,
                    frecuencias: r.frecuencias,
                    tiposdescansos: r.tiposdescansos,
                    diassemana: r.diassemana,
                    tiposBeneficios: r.tiposBeneficios,
                });

                this.setLoading(false);

            }else if (r.code === 500){
                this.setLoading(false);

                showAlert('error', r.msj);

            }
        }).catch(function (error) {
            if (error.response.status == 422){

                this.setLoading(false);

                showAlert('error', r.msj);

            }
        });
    }

    newEmpleador(){

        this.setState({
            nombres: '',
            apellidos: '',
            telefono: '',
            empleador: ''
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
        this.getModalidad();
    }

    render() {
        let {url, keyTab, confirmacionAdelanto, isLoading} = this.state;
        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <>
                <TitleLabel content={'Agregar requerimiento'} />

                <section className="bertha-form">
                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey="tab1" className="tabs-pink nav-white-style">

                            <Tab eventKey="tab1" title="Datos">
                                <DatosRequerimientos
                                    url={url}
                                    view={'new'}
                                    data={this.state}
                                    show={false}
                                    handleChange={this.handleChange}
                                    loadEmpleadoresOptions={this.loadEmpleadoresOptions}
                                    openModalEmpleador={this.openModalEmpleador}
                                    closeModalEmpleador={this.closeModalEmpleador}
                                    setNewEmpleador={this.setNewEmpleador}
                                    saveNuevoEmpleador={this.saveNuevoEmpleador}
                                    openModalDomicilio={this.openModalDomicilio}
                                    closeModalDomicilio={this.closeModalDomicilio}
                                    setNewDomicilio={this.setNewDomicilio}
                                    saveNuevoDomicilio={this.saveNuevoDomicilio}
                                    loadDistritoOptions={this.loadDistritoOptions}
                                    handleDelete={this.handleDelete}
                                    handleAddition={this.handleAddition}
                                    handleDrag={this.handleDrag}
                                    handleChangeHorarios={this.handleChangeHorarios}
                                />
                            </Tab>
                        </Tabs>

                        <>{formButtons(isLoading, 'new', (this.cancelar), null, null)}</>
                    </form>
                </section>
            </>
        )
    }
}

export default withRouter(RequerimientosNew);

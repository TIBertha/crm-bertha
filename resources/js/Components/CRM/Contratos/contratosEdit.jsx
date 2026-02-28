import React, { Component } from "react";
import {useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import {Tab, Tabs} from "react-bootstrap";
import "react-phone-input-2/lib/style.css";
import axios from 'axios';

import TitleLabel from "../Components/titleLabel.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";
import {
    ajaxContratosGet,
    ajaxGetContratosRequerimiento,
    ajaxGetContratosRequerimientosDomicilios,
    getCalculoTotal,
} from "../../Functions/Contratos.jsx";

import {formButtons} from "../../Functions/General.jsx";

import {
    modalCancelar,
    showAlert,
    showAlertConfirmRedirectReactRouter
} from "../../Helpers/alerts.js"

import {formatFloat} from "../../Helpers/helpers.js";
import DatosContratos from "./Tabs/datosContratos.jsx";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class ContratosEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            show: props.show,
            id: props.params.id,
            paispedido: '',
            divisa: {valor: 'PEN', tooltip: 'SOL - PERU' },
            guardar: props.guardar,
            devolver: props.devolver,
            diastrabajados: props.diastrabajados,
            creado: '',
            empleador: '',
            descuentoejecutivo: 0,
            montodescontado: 0,
            requerimientoDetalles: '',
            requerimiento: '',
            domicilio: '',
            postulante: '',
            postulanteB: '',
            postulanteC: '',
            trabajadorasB: [],
            tipocontrato: '',
            totalpago: 0,
            sueldo: 0,
            descuento: 0,
            formapago: '',
            pago1: '',
            pago2: '',
            modopago1: '',
            modopago2: '',
            fechapago: '',
            adelanto: '',
            debe: '',
            modopagoadelanto: '',
            modopagodebe: '',
            fechapagoadelanto: '',
            fechapagodebe: '',
            responsable: '',
            responsables: [],
            modospagos: [],
            formaspagos: [],
            observaciones: '',
            tiposcontratos: [],
            requerimientos: [],
            trabajadores: [],
            domicilios: [],
            garantia: '',
            garantias: [],
            fechainiciogarantia: '',
            fechafingarantia: new Date(),
            fechainiciolabores: '',
            fechainiciolaboresb: '',
            fechainiciolaboresc: '',
            fechafinlabores: '',
            horainiciolabores: '',
            contrato: '',
            montoanulacion: '',
            fechaanulacion: new Date(),
            notaanulacion: '',
            diastrabajadosid: '',
            fechadiastrabajados: new Date(),
            cantdiastrabajados: '',
            montodiastrabajados: '',
            descuentodiastrabajados: '',
            pagodiastrabajados: '',
            culminado: '',
            modopagotrabajador: '',
            modospagosdiastrabajados: [],
            firmarecibo: '',
            recibotrabajador: false,
            changeSignature: false,
            adjuntocomprobante: '',
            fecharecibotrabajador: new Date(),
            uploadedFiles: [],
            isLoading: false,
            isLoadingReciboDiasTrabajados: false,
            isLoadingDiasTrabajados: false,
            verificadoingreso: '',
            actividad: '',
            actividades: [],
            montototalcontrato: 0,
            modalidad: '',
            frecuencia: '',
            valordiafrecuencia: '',
            diaslaborablesfrecuencia: '',
            sueldomensual: '',
            dias: [],
            frecuencias: [],
            tiposcomisiones: [],
            tipocomision: '',
            linkDomicilio: '',
            keyTab: 'tab1',
        };

        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getRequerimientosDomicilios = this.getRequerimientosDomicilios.bind(this);
        this.changeRequerimiento = this.changeRequerimiento.bind(this);
        this.changeComision = this.changeComision.bind(this);
        this.calcularFechaFinGarantia = this.calcularFechaFinGarantia.bind(this);
        this.calculoTotal = this.calculoTotal.bind(this);
        this.clearPad = this.clearPad.bind(this);
        this.cancelar = this.cancelar.bind(this);
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/contratos', navigate)
    }

    clearPad(e){

        this.sigPad.clear();
    }

    handleChange(e, tipo = '', campo = '') {

        if(tipo == 'time'){

            if(campo == 'creado'){
                this.setState({
                    [campo]: e
                }, this.calcularFechaFinGarantia);

            }else if(campo == 'fechafinlabores'){

                this.setState({
                    [campo]: e
                }, this.calculoFechaMontoDiasTrabajados);

            }else if(campo == 'fechainiciogarantia'){
                this.setState({
                    [campo]: e
                }, this.calcularFechaFinGarantia(e));

            }else{
                this.setState({
                    [campo]: e
                });
            }

        }else if(tipo == 'empleador'){

            this.setState({
                empleador: e
            }, this.getRequerimientosDomicilios);

        }else if(tipo == 'select'){

            this.setState({
                [campo]: e
            });

        }else if(tipo == 'requerimiento'){

            this.setState({
                requerimiento: e.target.value
            },  this.changeRequerimiento);

        }else if(tipo == 'tipocomision'){

            this.setState({
                tipocomision: e.target.value
            },  this.changeComision);


        }else if(tipo == 'calculo'){

            if(campo == 'sueldo'){

                let {value} = e;

                this.setState({
                    [campo]: value
                },  this.calculoTotal);

            }else{

                this.setState({
                    [campo]: e.target.value.toUpperCase()
                },  this.calculoTotal);

            }

        }else if(tipo == 'diferencia'){

            let valor = '';

            if(campo == 'descuentoejecutivo'){
                let {value} = e;
                valor = value;
            }else{
                valor = e.target.value;
            }

            this.setState({
                [campo]: valor
            },  this.calculoDiferencia(campo, valor));

        }else if(tipo == 'pago12'){

            let valor = '';

            if(campo == 'pago1'){
                let {value} = e;
                valor = value;
            }else{
                valor = e.target.value;
            }

            this.setState({
                [campo]: valor
            },  this.calculoContado);

        }else if(tipo == 'adelantodebe'){

            let valor = '';

            if(campo == 'adelanto'){
                let {value} = e;
                valor = value;
            }else{
                valor = e.target.value;
            }

            this.setState({
                [campo]: valor
            },  this.CalcularAdelantoDebe);

        }else if(tipo == 'verificacion'){

            this.setState({verificadoingreso: e.target.value});

        }else if(tipo == 'calculodebe'){

            let valor = '';

            if(campo == 'debe'){
                let {value} = e;
                valor = value;
            }else{
                valor = e.target.value;
            }

            this.setState({
                [campo]: valor
            },  this.calculoDebe);

        }else if(tipo == 'formapago'){

            this.setState({
                [campo]: e.target.value
            },  this.setMontoTotal(e.target.value));

        }else if(tipo == 'montodiastrabajados'){

            let {value} = e;

            this.setState({
                [campo]: value
            },  this.calculoOperacionDiasTrabajados);

        }else if(tipo == 'float') {

            let {value} = e;

            this.setState({
                [campo]: value
            });

        }else{

            if(campo == 'garantia'){

                this.setState({
                    [e.target.name]: e.target.value
                }, this.calcularFechaFinGarantia);

            }else if(campo == 'cantdiastrabajados'){

                this.setState({
                    [e.target.name]: e.target.value.toUpperCase(),
                }, this.calcularMontoDiasTrabajados);

            }else if(tipo == 'adjunto'){

                let reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);
                reader.onloadend = (e) =>  {

                    this.setState({
                        adjunto: reader.result
                    });

                };

            }else{

                if(tipo == 'observaciones'){

                    const input = e.target;
                    const start = input.selectionStart;
                    const end = input.selectionEnd;

                    this.setState({
                        [e.target.name]: e.target.value.toUpperCase()
                    }, () => input.setSelectionRange(start, end));

                }else{

                    const input = e.target;
                    const start = input.selectionStart;
                    const end = input.selectionEnd;

                    this.setState({
                        [e.target.name]: e.target.value.toUpperCase()
                    }, () =>  (start == undefined && end == undefined) ? '' : input.setSelectionRange(start, end) );

                }

            }

        }

    }

    calculoFechaMontoDiasTrabajados(){

        let{fechafinlabores, fechainiciolabores, sueldo} = this.state;
        let dias = '';
        let monto = '';
        let a = '';
        let b = '';

        if(fechafinlabores) {

            a = moment(fechainiciolabores);
            b = moment(fechafinlabores);

            dias = (b.diff(a, 'days')) + 1;

            monto = (sueldo * dias) / 30;
        }

        this.setState({cantdiastrabajados: dias, montodiastrabajados: monto})
    }

    calcularMontoDiasTrabajados(){

        let {sueldo, cantdiastrabajados} = this.state;
        let monto = '';

        if(cantdiastrabajados){
            monto = (sueldo * cantdiastrabajados) / 30;
        }

        this.setState({montodiastrabajados: monto})

    }

    calculoOperacionDiasTrabajados(){

        let {montodiastrabajados} = this.state;

        let descuento = '';
        let pago = '';

        if(montodiastrabajados){
            descuento = montodiastrabajados * 0.30;
            pago = montodiastrabajados * 0.70;
        }

        this.setState({descuentodiastrabajados: descuento, pagodiastrabajados: pago})

    }

    calculoDebe(){

        let {montototalcontrato, debe} = this.state;

        if(debe != montototalcontrato){

            if(debe < montototalcontrato){
                this.setState({adelanto: formatFloat(montototalcontrato - debe)})
            }else if(debe > montototalcontrato){
                showAlert( "Error", "No exceda el monto");
                this.setState({debe: formatFloat(montototalcontrato), adelanto: 0});
            }
        }
    }

    calcularFechaFinGarantia(dateInit = null){

        let {garantia, creado} = this.state;
        let fecha = '';

        if(creado == ''){
            fecha = new Date();
        }else{
            fecha = creado;
        }

        if(dateInit){
            fecha = dateInit;
        }

        let fechafin = moment(fecha).add(garantia, 'months').toDate();
        let fechainicio = moment(fecha).toDate();

        this.setState({fechainiciogarantia:fecha, fechafingarantia:fechafin, fechainiciolabores: fechainicio, fechainiciolaboresb: fechainicio, fechainiciolaboresc: fechainicio});

    }

    save(e){

        e.preventDefault();

        this.setLoading(true);
        let self = this;

        let {id, postulanteB, postulanteC, tipocomision, montototalcontrato, responsable, creado, actividad, verificadoingreso, empleador, garantia, fechainiciolabores, fechainiciolaboresb,  fechainiciolaboresc, fechafinlabores, horainiciolabores, fechainiciogarantia, fechafingarantia, descuentoejecutivo, montodescontado, sueldo, requerimiento, domicilio, correo, postulante, tipocontrato, totalpago, descuento, observaciones, formapago, pago1, pago2, modopago1, modopago2, fechapago, adelanto, debe, modopagoadelanto, modopagodebe, fechapagoadelanto, fechapagodebe} = this.state;

        let hil = horainiciolabores ? moment(horainiciolabores).format() : horainiciolabores;
        let fecha_creado = creado ? moment(creado).format() : creado;
        let fecha_inicio_garantia = fechainiciogarantia ? moment(fechainiciogarantia).format() : fechainiciogarantia;
        let fecha_fin_garantia = fechafingarantia ? moment(fechafingarantia).format() : fechafingarantia;

        axios.post('/ajax-contratos-edit', {id, postulanteB, postulanteC, tipocomision, montototalcontrato, responsable, 'creado' : fecha_creado, actividad, verificadoingreso, empleador, observaciones, garantia, fechainiciolabores, fechainiciolaboresb,  fechainiciolaboresc, fechafinlabores, 'horainiciolabores': hil, 'fechainiciogarantia' : fecha_inicio_garantia, 'fechafingarantia' : fecha_fin_garantia, descuentoejecutivo, montodescontado, sueldo, requerimiento, domicilio, correo, postulante, tipocontrato, totalpago, descuento, formapago, pago1, pago2, modopago1, modopago2, fechapago, adelanto, debe, modopagoadelanto, modopagodebe, fechapagoadelanto, fechapagodebe} )
            .then(res => {

                let r = res.data;

                if(r.code === 200){
                    this.setState({
                        isLoading: false,
                        contrato: r.contrato
                    });
                    const { navigate } = this.props;
                    showAlertConfirmRedirectReactRouter('exito', r.msj, '/contratos', navigate);
                }else if(r.code === 500){
                    this.setLoading(false);
                    showAlert('error', r.msj);
                }

            }).catch(function (error){

            if (error.response.status == 422){
                self.setLoading(false);
                showAlert('error', error.response.data);

            }

        });
    }

    setMontoTotal(formapago = 1){

        let {montototalcontrato} = this.state;

        if(formapago == ''){

            this.setState({
                pago1: '',
                modopago1: '',
                pago2: '',
                modopago2: '',
                fechapago : '',
                adelanto: '',
                debe: '',
                modopagoadelanto: '',
                modopagodebe: '',
                fechapagoadelanto: '',
                fechapagodebe: ''

            });

        }else if(formapago == 1){

            this.setState({
                pago1: formatFloat(montototalcontrato),
            });

        }else if(formapago == 2){

            this.setState({
                adelanto: formatFloat(montototalcontrato),
            });

        }

    }

    calculoContado(){

        let {montototalcontrato, pago1, pago2, modopago2} = this.state;

        let tot = montototalcontrato;
        let pag1 = pago1;
        let pag2 = pago2;
        let dif = '';

        if(pag1 != tot){

            if(pag1 < tot){
                pag2 = tot - pag1;
                modopago2 = '';
                this.setState({pago2: formatFloat(pag2) , modopago2:modopago2})
            }else if(pag1 > tot){
                pag2 = 0;
                pag1 = tot;
                showAlert( "Error", "No exceda el monto");
                this.setState({pago1: formatFloat(tot), pag2: formatFloat(pag2)});
            }

        }

        if(pag1 != ''){
            this.setState({fechapago: new Date()});
        }else{
            this.setState({fechapago: ''});
        }

    }

    CalcularAdelantoDebe(){

        let {montototalcontrato, adelanto, debe, modopagodebe} = this.state;

        let tot = parseFloat(montototalcontrato);
        let pag1 = parseFloat(adelanto);
        let pag2 = parseFloat(debe);
        let dif = '';

        if(pag1 != tot){

            if(pag1 < tot){

                pag2 = tot - pag1;
                modopagodebe = '';
                this.setState({debe: formatFloat(pag2) , modopagodebe: modopagodebe , fechapagoadelanto: new Date()});
            }else if(pag1 > tot){
                pag2 = 0;
                pag1 = tot;
                showAlert( "Error", "No exceda el monto");
                this.setState({adelanto : formatFloat(tot), debe: formatFloat(pag2)});
            }else{
                this.setState({adelanto : 0, debe: formatFloat(tot)});
            }
        }

        if(pag1 != ''){
            this.setState({fechapagoadelanto: new Date()});
        }else{
            this.setState({fechapagoadelanto: ''});
        }
    }

    calculoDiferencia(campo, valor){

        let {totalpago, descuentoejecutivo, tipocontrato} = this.state;

        let tot = totalpago;
        let med = totalpago;
        let desc = campo == 'descuentoejecutivo' ? valor : descuentoejecutivo;
        let dif = 0;

        if(desc != tot){

            if(tipocontrato == 3) {
                if(desc > tot){
                    dif = desc;
                }
            }else if(tipocontrato != 3){

                if(formatFloat(desc) < formatFloat(tot)){
                    dif = tot - desc;
                }else if(desc > tot){

                    if (campo == 'descuentoejecutivo'){
                        dif = tot - desc;
                    }else{
                        if(tot == 0){
                            dif = 0;
                            //tot = med;
                        }else{
                            dif = 0;
                            tot = med;
                            showAlert( "Error", "No exceda el monto");
                            this.setState({descuentoejecutivo: formatFloat(tot)});
                        }
                    }

                }
            }
        }

        this.setState({
            montodescontado: formatFloat(dif),
            montototalcontrato: desc,
            formapago: 1}, this.setMontoTotal);
    }

    calculoTotal(warranty = null){

        let {paispedido, sueldo, tipocontrato, garantia, modalidad, tipocomision, tieneComision, montoComision} = this.state;

        let gan = warranty ? warranty : garantia;
        let tot = sueldo ? sueldo : 0;
        let cont = tipocontrato ? tipocontrato : 1;

        let total = getCalculoTotal(cont, gan, tot, tipocontrato, paispedido, tipocomision, modalidad);

        this.setState({
            totalpago: (gan == 0 ? 0 : (tieneComision == true ? montoComision : (total ? formatFloat(total) : 0)) ),
            descuentoejecutivo: (gan == 0 ? 0 : (tieneComision == true ? montoComision : total)),
            formapago: 1,
            montototalcontrato: (gan == 0 ? 0 : (tieneComision == true ? montoComision : (total ? formatFloat(total) : 0))),
        });

    }

    changeRequerimiento(){

        let id = this.state.requerimiento;

        if(id){
            ajaxGetContratosRequerimiento(id).then(r => {
                if(r.code === 200){
                    this.setState({
                        sueldo: r.totalpago,
                        totalpago: r.totalpago,
                        postulante: r.postulante,
                        tipocontrato: r.tipocontrato,
                    });
                }else if(r.code === 500){
                    showAlert('error', r.msj);
                }
            }).catch(function (error) {
                console.log(error);
            });
        }else{
            this.setState({
                postulante: '',
                tipocontrato: '',
                totalpago: 0,
                descuento: '',
                sueldo: '',
                pago1: '',
                pago2: '',
                modopago2: '',
                fechapago: '',
                adelanto: '',
                debe: '',
                modopagoadelanto: '',
                modopagodebe: '',
                fechapagoadelanto: '',
                fechapagodebe: '',
            });
        }

    }

    changeComision(){
        let {tipocomision} = this.state;

        this.setState({
            garantia: tipocomision == 1 ? 6 : 3
        }, this.actionsChangeComision);

    }

    actionsChangeComision(){
        this.calcularFechaFinGarantia();
        this.calculoTotal();
        this.calculoContado();
    }

    getRequerimientosDomicilios(){

        ajaxGetContratosRequerimientosDomicilios(this.state.empleador).then(r => {
            if(r.code === 200){

                this.setState({
                    requerimientos: r.requerimientos,
                    domicilios: r.domicilios
                });

            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch(function (error) {
            console.log(error);
        });

    }

    getData(){

        this.setLoading(true);

        let id = this.state.id;

        ajaxContratosGet(id).then(r => {
            if(r.code === 200){

                let traB = r.trabajador_b_id;
                let traC = r.trabajador_c_id;
                let fechaILB = r.contrato.fechainiciolaboresb;
                let fechaILC = r.contrato.fechainiciolaboresc;

                this.setState({
                    postulanteB: traB,
                    postulanteC: traC,
                    fechainiciolaboresb: fechaILB ? moment(fechaILB,"YYYY-MM-DD").toDate() : '',
                    fechainiciolaboresc: fechaILC ? moment(fechaILC,"YYYY-MM-DD").toDate() : '',
                    divisa: r.divisa,
                    paispedido: r.paispedido,
                    contrato: r.contrato,
                    creado: moment(r.contrato.creado,"YYYY-MM-DD").toDate(),
                    empleador: r.empleador_id,
                    requerimiento: r.contrato.requerimiento_id,
                    requerimientoDetalles: r.requerimientoDetalles,
                    domicilio: r.contrato.domicilio_id,
                    //correo: r.correo,
                    postulante: r.trabajador_id,
                    tipocontrato: r.contrato.tipocontrato_id,
                    totalpago: r.contrato.total_pago,
                    descuentoejecutivo: r.contrato.descuentoejecutivo,
                    montodescontado: r.contrato.montodiferencia,
                    sueldo: r.contrato.sueldopactado,
                    formapago: r.contrato.formapago_id,
                    pago1: r.contrato.pago1,
                    pago2: r.contrato.pago2,
                    modopago1: r.contrato.modopago1,
                    modopago2: r.contrato.modopago2,
                    fechapago: r.contrato.fechapago ? moment(r.contrato.fechapago,"YYYY-MM-DD").toDate() : '',
                    adelanto: r.contrato.adelanto,
                    debe: r.contrato.debe,
                    modopagoadelanto: r.contrato.modopagoadelanto,
                    modopagodebe: r.contrato.modopagodebe,
                    fechapagoadelanto: r.contrato.fechapagoadelanto ? moment(r.contrato.fechapagoadelanto,"YYYY-MM-DD").toDate() : '',
                    fechapagodebe: r.contrato.fechapagodebe ? moment(r.contrato.fechapagodebe,"YYYY-MM-DD").toDate() : '',
                    tiposcontratos: r.tiposcontratos,
                    tiposcomisiones: r.tiposcomisiones,
                    tipocomision: r.contrato.tipocomision_id,
                    modospagos: r.modospagos,
                    formaspagos: r.formaspagos,
                    trabajadores: r.trabajadores,
                    trabajadoresB: r.trabajadores,
                    trabajadoresC: r.trabajadores,
                    requerimientos: r.requerimientos,
                    domicilios: r.domicilios,
                    garantias : r.garantias,
                    observaciones : r.contrato.observaciones,
                    garantia: r.requerimiento.garantia,
                    montoanulacion: r.contrato.montoanulacion,
                    fechaanulacion: r.contrato.fecha_anulacion ? moment(r.contrato.fecha_anulacion,"YYYY-MM-DD").toDate() : new Date(),
                    notaanulacion: r.contrato.nota_anulacion,
                    fechainiciogarantia: r.requerimiento.fecha_inicio_garantia ? moment(r.requerimiento.fecha_inicio_garantia,"YYYY-MM-DD").toDate() : '',
                    fechafingarantia : r.requerimiento.fecha_fin_garantia ? moment(r.requerimiento.fecha_fin_garantia,"YYYY-MM-DD").toDate() : '',
                    fechainiciolabores: r.contrato.fechainiciolabores ? moment(r.contrato.fechainiciolabores,"YYYY-MM-DD").toDate() : '',
                    fechafinlabores: r.diastrabajados.fechafinlabores ? moment(r.diastrabajados.fechafinlabores,"YYYY-MM-DD").toDate() : '',
                    horainiciolabores: r.contrato.horainiciolabores ? moment(r.contrato.horainiciolabores,"YYYY-MM-DD HH:mm:ss").toDate() : '',
                    fechadiastrabajados: r.diastrabajados.fecha ? moment(r.diastrabajados.fecha,"YYYY-MM-DD HH:mm:ss").toDate() : new Date(),
                    cantdiastrabajados: r.diastrabajados.cantidad_dias ? r.diastrabajados.cantidad_dias : '',
                    montodiastrabajados: r.diastrabajados.monto ? r.diastrabajados.monto : '',
                    descuentodiastrabajados: r.diastrabajados.descuento ? r.diastrabajados.descuento : '',
                    pagodiastrabajados: r.diastrabajados.pago_trabajador ? r.diastrabajados.pago_trabajador : '',
                    diastrabajadosid: r.diastrabajados.id ? r.diastrabajados.id : '',
                    uploadedFiles: r.contrato.adjuntos ? JSON.parse(r.contrato.adjuntos) : [],
                    culminado: Boolean(r.contrato.culminado),
                    modospagosdiastrabajados: r.modospagosdt,
                    modopagotrabajador: r.diastrabajados.modopagorecibotrabajador,
                    firmarecibo: r.diastrabajados.firmarecibotrabajador,
                    recibotrabajador: r.diastrabajados.recibotrabajador,
                    adjuntocomprobante: r.diastrabajados.adjuntorecibotrabajador,
                    fecharecibotrabajador: r.diastrabajados.fecharecibotrabajador ? moment(r.diastrabajados.fecharecibotrabajador,"YYYY-MM-DD HH:mm:ss").toDate() : new Date(),
                    actividad: r.contrato.actividad_id,
                    verificadoingreso: r.contrato.verificador_ingreso,
                    actividades: r.actividades,
                    responsable: r.contrato.usuariointerno_id,
                    responsables: r.responsables,
                    isLoading: false,
                    montototalcontrato: r.contrato.monto_total_contrato,
                    frecuencias: r.frecuencias,
                    modalidad: r.modalidad,
                    frecuencia: r.frecuencia,
                    valordiafrecuencia: r.valordiafrecuencia,
                    diaslaborablesfrecuencia: r.diaslaborablesfrecuencia,
                    sueldomensual: r.sueldomensual,
                    dias: r.dias,
                    linkDomicilio: r.linkDomicilio,
                });
            }else if(r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        }).catch(function (error) {

        });
    }

    setVerifIngreso(condition){
        this.setState({
            verificadoingreso: condition
        });
    }

    componentDidMount(){
        this.getData();
    }

    render() {

        let { url, show, keyTab, isLoading, verificadoingreso, id, linkDomicilio} = this.state;
        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <>
                <TitleLabel content={(Boolean(show) ? 'Ver' : 'Editar') + ' contrato'}/>

                <section className="bertha-form">

                    <div className="row mx-0 mb-25">
                        <div className={'form-group col-9 col-md-auto m-0 px-2'}>
                            <div className={'switch-ingreso-trabajador'}>
                                <div className={'row mx-0'}>
                                    <label className="col-6 col-md-auto col-form-label align-self-center text-white">¿Ingreso a trabajar?</label>
                                    <div className="col-6 col-md-auto align-self-center">
                                        <div className="switch-side-area">
                                            <div className="row mx-0">
                                                <div className={'col-auto option-action font-weight-bold' + (verificadoingreso == '1' ? ' checked-green' : '')} onClick={() => this.setVerifIngreso('1')} >{'SI'}</div>
                                                <div className={'col-auto option-action font-weight-bold' + (verificadoingreso == '0' ? ' checked-red' : '')} onClick={() => this.setVerifIngreso('0')}>{'NO'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {linkDomicilio &&
                            <>
                                <div className={'col-auto px-2'}>
                                    <a className={'btn btn-md btn-maps'} href={'https://www.' + linkDomicilio} target={'_blank'} data-toggle="tooltip" data-placement="top" title={'Ver dirección'}>
                                        <i className="fa-solid fa-map-location-dot icon-16"></i>
                                    </a>
                                </div>
                                <div className={'col-auto px-2'}>
                                    <a className={'btn btn-md btn-moovit'} href={'https://moovitapp.com/lima-1102/poi/es'} target={'_blank'} data-toggle="tooltip" data-placement="top" title={'Abrir Moovit'}>
                                        <i className="fa-solid fa-location-pin icon-16"></i>
                                    </a>
                                </div>
                            </>
                        }
                    </div>

                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">
                            <Tab eventKey="tab1" title="Datos">
                                <DatosContratos
                                    view={'edit'}
                                    data={this.state}
                                    handleChange={this.handleChange}
                                />
                            </Tab>
                        </Tabs>

                        <>{formButtons(isLoading, 'edit', (this.cancelar), null, id)}</>
                    </form>
                </section>
            </>
        )
    }
}

export default withRouter(ContratosEdit);

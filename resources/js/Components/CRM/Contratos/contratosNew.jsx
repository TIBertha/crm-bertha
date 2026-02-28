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
    ajaxContratosGetData,
    ajaxExcludePostulante,
    ajaxGetContratosRequerimiento, ajaxGetContratosRequerimientosDomicilios,
    ajaxGetVerificacionPorDias, getCalculoTotal,
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

class ContratosNew extends Component{
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            creado: new Date(),
            paispedido: 54,
            tieneComision: false,
            divisa: {valor: 'PEN', tooltip: 'SOL - PERU' },
            empleador: '',
            descuentoejecutivo: 0,
            montodescontado: 0,
            requerimiento: '',
            requerimientoDetalles: '',
            domicilio: '',
            postulante: '',
            diaslaborpostulante: '',
            postulanteB: '',
            postulanteC: '',
            trabajadorasB: [],
            tipocontrato: '',
            totalpago: 0,
            sueldo: 0,
            descuento: 0,
            formapago: 1,
            pago1: '',
            pago2: '',
            modopago1: 4,
            modopago2: '',
            fechapago: new Date(),
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
            tiposcontratos: [],
            requerimientos: [],
            empleadores: [],
            trabajadores: [],
            domicilios: [],
            contrato: '',
            garantia: 3,
            observaciones: '',
            garantias: [],
            fechainiciogarantia: '',
            fechafingarantia: '',
            fechainiciolabores: '',
            fechainiciolaboresb: '',
            fechainiciolaboresc: '',
            horainiciolabores: '',
            actividad: '',
            actividades: [],
            montototalcontrato: 0,
            modalidad: '',
            frecuencia: '',
            frecuencias: [],
            diasfrecuencia: [],
            dias: [],
            valordiafrecuencia: '',
            diaslaborablesfrecuencia: '',
            sueldomensual: '',
            tiposcomisiones: [],
            tipocomision: 2,
            isLoading: false,

            keyTab: 'tab1',
        };

        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getRequerimientosDomicilios = this.getRequerimientosDomicilios.bind(this);
        this.getVerificacionPorDias = this.getVerificacionPorDias.bind(this);
        this.excludePostulante = this.excludePostulante.bind(this);
        this.changeRequerimiento = this.changeRequerimiento.bind(this);
        this.changeComision = this.changeComision.bind(this);
        this.calcularFechaFinGarantia = this.calcularFechaFinGarantia.bind(this);
        this.calculoTotal = this.calculoTotal.bind(this);
        this.removeCode = this.removeCode.bind(this);
        this.cancelar = this.cancelar.bind(this);
    }

    setLoading(condition){
        this.setState({ isLoading: condition});
    }

    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/contratos', navigate)
    }

    handleChange(e, tipo = '', campo = '') {

        if(tipo == 'time'){

            if(campo == 'creado'){
                this.setState({
                    [campo]: e
                }, this.calcularFechaFinGarantia);

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

            if (campo == 'postulante'){

                let {modalidad} = this.state;

                if (modalidad == 3){

                    this.setState({
                        postulante: e
                    }, this.getVerificacionPorDias);
                }else {
                    this.setState({
                        postulante: e
                    });
                }

            }else if (campo == 'postulanteB'){
                this.setState({
                    postulanteB: e
                })
            }else if (campo == 'postulanteC'){
                this.setState({
                    postulanteC: e
                })
            }else{

                this.setState({
                    [campo]: e
                });

            }

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
            });
        }else if(tipo == 'formapago'){

            this.setState({
                [campo]: e.target.value
            },  this.setMontoTotal(e.target.value));

        }else if(tipo == 'float') {

            let {value} = e;

            this.setState({
                [campo]: value
            });

        }else{

            if(campo == 'garantia'){

                this.setState({
                    [e.target.name]: e.target.value
                }, this.calcularFechaFinGarantia, this.calculoTotal(e.target.value));

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

        let fechafin = garantia == 0 ? fecha : (moment(fecha).add(garantia, 'months').toDate());

        this.setState({
            fechainiciogarantia:fecha,
            fechafingarantia:fechafin,
        });

    }

    removeCode(){
        this.calculoDiferencia();
    }

    save(e){

        e.preventDefault();

        this.setLoading(true);
        let self = this;

        let {postulanteB, postulanteC, diaslaborablesfrecuencia, tipocomision, frecuencia, diasfrecuencia, modalidad, montototalcontrato, empleador, responsable, observaciones, actividad, garantia, fechainiciolabores, fechainiciolaboresb,  fechainiciolaboresc, creado, horainiciolabores, fechainiciogarantia, fechafingarantia, descuentoejecutivo, montodescontado, sueldo, requerimiento, domicilio, correo, postulante, tipocontrato, totalpago, descuento, formapago, pago1, pago2, modopago1, modopago2, fechapago, adelanto, debe, modopagoadelanto, modopagodebe, fechapagoadelanto, fechapagodebe} = this.state;

        let hil = horainiciolabores ? moment(horainiciolabores).format() : horainiciolabores;
        let fecha_creado = creado ? moment(creado).format() : creado;
        let fecha_inicio_garantia = fechainiciogarantia ? moment(fechainiciogarantia).format() : fechainiciogarantia;
        let fecha_fin_garantia = fechafingarantia ? moment(fechafingarantia).format() : fechafingarantia;

        axios.post('/ajax-contratos-new', {postulanteB, postulanteC, diaslaborablesfrecuencia, tipocomision, frecuencia, diasfrecuencia, modalidad, montototalcontrato, 'creado' : fecha_creado, responsable, empleador, observaciones, actividad, garantia, fechainiciolabores, fechainiciolaboresb,  fechainiciolaboresc, 'horainiciolabores': hil, 'fechainiciogarantia' : fecha_inicio_garantia, 'fechafingarantia' : fecha_fin_garantia, descuentoejecutivo, montodescontado, sueldo, requerimiento, domicilio, correo, postulante, tipocontrato, totalpago, descuento, formapago, pago1, pago2, modopago1, modopago2, fechapago, adelanto, debe, modopagoadelanto, modopagodebe, fechapagoadelanto, fechapagodebe} )
            .then(res => {

                let r = res.data;

                if(r.code === 200){
                    this.setLoading(false);
                    this.setState({
                        contrato: r.contrato
                    });
                    const { navigate } = this.props;
                    showAlertConfirmRedirectReactRouter('exito', r.msj, '/contratos', navigate);
                }else{
                    this.setLoading(false);
                    showAlert('error', r.msj);
                }
            }).catch(function (error){
            if (error.response.status === 422){
                self.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    setMontoTotal(formapago = 1){

        let {montototalcontrato, creado} = this.state;

        if(formapago == ''){

            this.setState({
                adelanto: '',
                pago1: '',
                fechapagoadelanto: '',
                fechapago: ''
            });

        }else if(formapago == 1){

            this.setState({
                pago1: montototalcontrato ? formatFloat(montototalcontrato) : 0,
                fechapago: creado
            });

        }else if(formapago == 2){

            this.setState({
                adelanto: montototalcontrato ? formatFloat(montototalcontrato) : 0,
                fechapagoadelanto: creado,
                debe: 0
            });

        }

    }

    calculoContado(){

        let {montototalcontrato, pago1, pago2, modopago2} = this.state;

        let tot = formatFloat(montototalcontrato);
        let pag1 = formatFloat(pago1);
        let pag2 = pago2;

        if(pag1 != tot){
            if(pag1 < tot){
                pag2 = tot - pag1;
                modopago2 = '';
                this.setState({pago2: formatFloat(pag2) , modopago2:modopago2})
            }else if(pag1 > tot){
                pag2 = 0;
                pag1 = tot;
                showAlert( "Error", "No exceda el monto");
                this.setState({pago1: formatFloat(tot), pago2: formatFloat(pag2)});
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
                    let contratodefault  = r.tipocontratodefault;
                    let garantia = r.paispedido == 54 ? r.garantia : 1;
                    this.setState({
                        horainiciolabores: r.hora_inicio ? moment(r.hora_inicio,"YYYY-MM-DD HH:mm:ss").toDate() : '',
                        tieneComision: r.tiene_comision,
                        montoComision: r.monto_comision,
                        divisa: r.divisa,
                        paispedido: r.paispedido,
                        tiposcontratos: r.tiposcontratos,
                        sueldo: r.sueldo,
                        totalpago: r.paispedido === 54 ? r.totalpago : 120000,
                        descuentoejecutivo: r.paispedido === 54 ? r.totalpago : 120000,
                        tipocontrato: contratodefault,
                        tipocomision: r.tipocomision,
                        fechainiciolabores: r.fechainiciolabores ? moment(r.fechainiciolabores,"YYYY-MM-DD").toDate() : new Date(),
                        fechainiciolaboresb: r.fechainiciolabores ? moment(r.fechainiciolabores,"YYYY-MM-DD").toDate() : new Date(),
                        fechainiciolaboresc: r.fechainiciolabores ? moment(r.fechainiciolabores,"YYYY-MM-DD").toDate() : new Date(),
                        garantias: r.garantias,
                        garantia: r.garantia ? garantia : (6),
                        fechainiciogarantia: r.fechainiciogarantia ? moment(r.fechainiciogarantia,"YYYY-MM-DD").toDate() : new Date(),
                        fechafingarantia: r.fechafingarantia ? moment(r.fechafingarantia,"YYYY-MM-DD").toDate() : '',
                        domicilio: r.domicilio,
                        actividad: r.actividad,
                        observaciones: r.observaciones,
                        modalidad: r.modalidad,
                        frecuencia: r.frecuencia,
                        valordiafrecuencia: r.valordiafrecuencia,
                        diaslaborablesfrecuencia: r.diaslaborablesfrecuencia,
                        sueldomensual: r.sueldomensual,
                        trabajadores: r.trabajadores,
                        trabajadoresB: r.trabajadoresB,
                        trabajadoresC: r.trabajadoresC,
                        requerimientoDetalles: r.requerimientoDetalles,
                    });


                    this.calculoTotal();
                    if(contratodefault == 1){
                        this.calcularFechaFinGarantia();
                    }
                    this.setMontoTotal(1);
                }else if(r.code === 500){
                    showAlert('error', r.msj);
                }
            });
        }else{
            this.setState({
                paispedido: 54,
                postulante: '',
                tipocontrato: '',
                totalpago: 0,
                descuentoejecutivo: 0,
                descuento: '',
                sueldo: 0,
                garantia: [1,2,3],
                fechainiciogarantia: new Date(),
                fechafingarantia: '',
                horainiciolabores: '',
                pago1: '',
                pago2: '',
                modopago2: '',
                fechapago: new Date(),
                adelanto: '',
                debe: '',
                modopagoadelanto: '',
                modopagodebe: '',
                fechapagoadelanto: new Date(),
                fechapagodebe: '',
                montodescontado: 0,
                actividad: '',
                observaciones: '',
                responsable: '',
                montototalcontrato: 0,
                modalidad: '',
                frecuencia: '',
                valordiafrecuencia: '',
                sueldomensual: '',
                diaslaborablesfrecuencia: '',
                trabajadores: []
            });
        }
    }

    changeComision(){

        let {tipocomision} = this.state;

        let garantiaNew = '';

        if(tipocomision == 1){
            garantiaNew = 6;
        }else if(tipocomision == 2){
            garantiaNew = 3;
        }else if(tipocomision == 3 ){
            garantiaNew = 1;
        }else if(tipocomision == 4 ){
            garantiaNew = 1;
        }

        this.setState({
            garantia: garantiaNew
        }, this.actionsChangeComision);

    }

    actionsChangeComision(){

        this.calcularFechaFinGarantia();
        this.calculoTotal();
        this.calculoContado();

    }

    getVerificacionPorDias(){

        ajaxGetVerificacionPorDias(this.state.postulante).then(r => {
            if (r.code === 200) {
                this.setState({
                    diaslaborpostulante:r.diaslaborpostulante ? r.diaslaborpostulante : '',
                });
            }
        });
    }

    excludePostulante(postulante){

        ajaxExcludePostulante(postulante).then(r => {
            this.setState({
                trabajadoresB:r.trabajadoresB,
                trabajadoresC:r.trabajadoresB,
            });
        });
    }

    getRequerimientosDomicilios(){

        let {empleador} = this.state;

        ajaxGetContratosRequerimientosDomicilios(empleador).then(r => {
            if(r.code === 200){
                //let mail = r.correo ? r.correo : '';
                this.setState({
                    requerimientos: r.requerimientos,
                    domicilios: r.domicilios,
                    //correo: mail,
                    postulante: '',
                    requerimiento: '',
                    tipocontrato: '',
                    totalpago: 0,
                    descuento: '',
                    sueldo: '',
                    fechainiciogarantia: new Date(),
                    fechafingarantia: '',
                    horainiciolabores: '',
                    pago1: '',
                    pago2: '',
                    modopago1: 4,
                    modopago2: '',
                    fechapago: new Date(),
                    adelanto: '',
                    debe: '',
                    modopagoadelanto: '',
                    modopagodebe: '',
                    fechapagoadelanto: new Date(),
                    fechapagodebe: '',
                    descuentoejecutivo: 0,
                    montodescontado: 0
                });

            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        });
    }

    getData(){

        this.setLoading(true);

        ajaxContratosGetData().then(r => {
            if(r.code === 200){
                this.setState({
                    modospagos: r.modospagos,
                    formaspagos: r.formaspagos,
                    empleadores: r.empleadores,
                    garantias: r.garantias,
                    actividades: r.actividades,
                    responsables: r.responsables,
                    frecuencias: r.frecuencias,
                    dias: r.dias,
                    tiposcomisiones: r.tiposcomisiones,
                });
                this.setLoading(false);
            }else if(r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        });
    }

    componentDidMount(){
        this.getData();
    }

    render() {
        let {keyTab, isLoading, contrato} = this.state;
        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <>
                <TitleLabel content={'Agregar nuevo contrato'}/>

                <section className="bertha-form">
                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">
                            <Tab eventKey="tab1" title="Datos">
                                <DatosContratos
                                    view={'new'}
                                    data={this.state}
                                    handleChange={this.handleChange}
                                />
                            </Tab>
                        </Tabs>

                        <>{formButtons(isLoading, 'new', (this.cancelar), null, contrato)}</>
                    </form>
                </section>
            </>
        )
    }
}

export default withRouter(ContratosNew);

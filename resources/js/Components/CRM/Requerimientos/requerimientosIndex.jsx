import React, { Component } from "react";
import Swal from "sweetalert2";
import LoadingScreen from "../Components/loadingScreen.jsx";
import IndexButton from "../Components/indexButton.jsx";
import Flyer from "../Components/flyer.jsx";
import NoDataLabel from "../Components/noDatalabel.jsx";
import RequerimientosSearchSideBar from "./requerimientosSearchSideBar.jsx";
import VerMaps from "../Components/verMaps.jsx";
import Cotizador from "./Components/Cotizador.jsx";
import RequerimientosTable from "./requerimientosTable.jsx";
import {
    ajaxRefreshRequerimientos,
    ajaxRequerimientosBuscar,
    ajaxRequerimientosGetDataInicial
} from "../../Functions/Requerimientos.jsx";
import {useNavigate, useParams} from "react-router-dom";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class RequerimientosIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            requerimientos: [],
            totalrequerimientos: [],
            page: '',
            pageOfItems: [],
            codigo: '',
            empleador: '',
            empleadortelefono: '',
            fecha: '',
            fechaentrevista: '',
            actividad: '',
            modalidad: '',
            estado: '',
            fastsearch: 'T',
            actividades: [],
            modalidades: [],
            responsable: '',
            responsables: [],
            estados: [],
            distrito: '',
            textoresultados: '',
            fechaHoy: '',
            isLoading: true,
            busqueda:false,
            access: false,
            sideBar: false,
        };

        this.openSideBar = this.openSideBar.bind(this);

        this.changeEstadoRequerimiento = this.changeEstadoRequerimiento.bind(this);
        this.habilitarEntrevista = this.habilitarEntrevista.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.buscar = this.buscar.bind(this);
        this.limpiar = this.limpiar.bind(this);
        this.updateTableData = this.updateTableData.bind(this);
        this.changePagination = this.changePagination.bind(this);
        this.paginationSearch = this.paginationSearch.bind(this);
        this.eliminarRequerimiento = this.eliminarRequerimiento.bind(this);
    }

    openSideBar(e, condition) {
        this.setState({
            sideBar: condition,
        });
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    setBusqueda(condition){
        this.setState({busqueda: condition});
    }

    limpiar(){

        this.setState({
            codigo: '',
            empleador: '',
            empleadortelefono: '',
            fecha: '',
            fechaentrevista: '',
            actividad: '',
            modalidad: '',
            estado: '',
            responsable:'',
            distrito: '',
            fastsearch: 'H',
            busqueda: false,
        });

        this.refreshRequerimientos();

    }

    onChangePage(pageOfItems) {
        this.setState({ pageOfItems: pageOfItems });
    }

    handleChange(e, tipo = '', campo = '') {

        if(tipo == 'time'){
            this.setState({
                [campo]: e
            });

        }else if(tipo == 'keypress'){

            if(e.charCode === 13){
                this.buscar();
            }

        }else{

            if(e.target.name == 'fastsearch'){

                this.setState({
                    [e.target.name]: e.target.value.toUpperCase()
                }, this.refreshRequerimientos);

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

    eliminarRequerimiento(e, id){

        e.preventDefault();

        Swal.fire({
            text: ('¿Está seguro que deseas eliminar el requerimiento N° ' + id + '?'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxRequerimientosDelete(id).then(r => {
                    if(r.code === 200){
                        this.refreshRequerimientos();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/requerimientos.js', navigate);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                }).catch(function (error) {
                    showAlert('error', 'Ocurrio un problema al eliminar el requerimiento. Consulte al administrador');
                });
            }
        });
    }

    changeEstadoRequerimiento(e,id, estado){

        e.preventDefault();

        Swal.fire({
            text: ('¿Está seguro que desea cambiar el estado a ' + setEstadosRequerimientoName(estado) + '?'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {

                ajaxCambiarEstadoReq(id, estado).then(r => {
                    if (r.code === 200){
                        this.refreshRequerimientos();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/requerimientos.js', navigate);
                    }else if (r.code === 500){
                        showAlert('error', r.msj);
                    }
                }).catch(function (error) {
                    showAlert('error', 'Ocurrio un problema al adjuntar archivo. Consulte al administrador');
                });
            }
        });
    }

    habilitarEntrevista(e, id , activo){

        e.preventDefault();

        Swal.fire({
            text: ('¿Desea que ' + (activo == true ? 'no' : 'si') + ' figure en holabertha.com/busco-trabajo?'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {

                ajaxEntrevistaSwitch(id).then(r => {
                    if (r.code === 200){
                        this.refreshRequerimientos();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/requerimientos.js', navigate);
                    }else if (r.code === 500){
                        showAlert('error', r.msj);
                    }
                }).catch(function (error) {
                    if (error.response.status == 422){
                        showAlert('error', r.msj);
                    }
                });
            }
        });

    }

    getDataInicial(){

        ajaxRequerimientosGetDataInicial().then(r => {
            this.setState({
                actividades: r.actividades,
                modalidades: r.modalidades,
                estados: r.estados,
                responsables: r.responsables
            });
        })
    }

    updateTableData(id){

        let {requerimientos} = this.state;

        const data = requerimientos.map(item => {
            let view = false;

            if(item.id == id){
                view = true;
            }

            return {...item, view};
        });

        this.setState({requerimientos: data});

    }

    refreshRequerimientos(){

        let {fastsearch} = this.state;

        this.setLoading(true);

        ajaxRefreshRequerimientos(fastsearch,0).then(r => {

            if (r.code === 200){
                this.setState({
                    page: r.page,
                    requerimientos: r.requerimientos,
                    totalrequerimientos: r.total,
                    textoresultados: r.textoresultados,
                    fechaHoy: r.fechaHoy,
                    access: r.accessCom,
                });
                this.setLoading(false);
            }else if (r.code === 500) {
                this.setLoading(false);
            }
        }).catch(function (error) {
            if (error.response.status == 422){
                this.setLoading(false);
            }
        });
    }

    changePagination(page){

        let {fastsearch} = this.state;
        let pagina = parseInt(page.selected) + 1;
        let offset = (pagina - 1) * 15 ;

        ajaxRefreshRequerimientos(fastsearch ,offset).then(r => {
            this.setState({
                page: pagina,
                requerimientos: r.requerimientos,
                totalrequerimientos: r.total,
                textoresultados: r.textoresultados,
            });
        })
    }

    paginationSearch(page){
        let pagina = parseInt(page.selected) + 1;
        let offset = (pagina - 1) * 15 ;

        ajaxRequerimientosBuscar(this.state, offset).then(r =>{
            if (r.code === 200){
                if(r.requerimientos){
                    this.setState({
                        requerimientos: r.requerimientos,
                        totalrequerimientos: r.total,
                        textoresultados: r.textoresultados,
                        page: pagina,
                    });
                    this.setLoading(false);
                }else{
                    this.setLoading(false);
                }
            }else if (r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        }).catch(function (error) {
            if (error.response.status == 422){
                this.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    buscar(){

        this.setLoading(true);
        this.setBusqueda(true);

        let pagina = 0;
        let offset = 0;

        ajaxRequerimientosBuscar(this.state, offset).then(r => {
            if (r.code === 200){
                if(r.requerimientos){
                    this.setState({
                        requerimientos: r.requerimientos,
                        totalrequerimientos: r.total,
                        textoresultados: r.textoresultados,
                        page: pagina,
                    });
                    this.setLoading(false);
                }else{
                    this.setLoading(false);
                }
                this.closeSearchSide();
            }else if (r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        }).catch(function (error) {
            if (error.response.status == 422){
                this.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    componentDidMount(){
        this.getDataInicial();
        this.refreshRequerimientos();
    }

    render() {
        let {url, sideBar, access, requerimientos, isLoading, fastsearch, totalrequerimientos, codigo, empleador, empleadortelefono, fecha, fechaentrevista, actividad, modalidad, estado, actividades, modalidades, estados, distrito, responsable, responsables, page, busqueda, textoresultados, fechaHoy} = this.state;

        let mapas = [
            {name: 'Lima - Perú', flag: 'pe', img: 'https://adjuntosexperta.s3.amazonaws.com/Adjuntos/mapa-lima.jpg', size: 'lg'},
            {name: 'Ciudad de México - Mexico', flag: 'mx', img: 'https://adjuntosexperta.s3.amazonaws.com/Adjuntos/mapa-mexico.jpg', size: 'xl'},
        ]

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <section>

                <RequerimientosSearchSideBar
                    data={this.state}
                    sideBar={sideBar}
                    handleOpenSideBar={this.openSideBar}
                    handleChange={this.handleChange}
                    buscar={this.buscar}
                    limpiar={this.limpiar}
                />

                <div className="row mx-0 pt-4">
                    <IndexButton
                        type={"search"}
                        handleOpenSideBar={this.openSideBar}
                    />

                    <IndexButton
                        type={"create"}
                        route={"/requerimientos/new"}
                    />

                    <div className="col-12 col-md-auto px-1 my-2 my-md-0">
                        <Cotizador url={url}/>
                    </div>

                    <div className={'col-12 col-md-auto px-1 my-2 my-md-0'}>
                        <ul className={'mapaButtons'}>
                            {mapas.map((m,index) => {
                                return(
                                    <li>
                                        <VerMaps flag={m.flag} name={m.name} img={m.img} imgSize={m.size}/>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                </div>

                <section className="fichas">
                    <div className="container-fluid pb-5 mt-4">
                        <div className="d-flex row mb-4 mx-0">
                            <Flyer
                                content={totalrequerimientos + " requerimientos listados"}
                            ></Flyer>
                        </div>

                        <>
                            {requerimientos.length ?
                                <RequerimientosTable
                                    url={url}
                                    handleEliminarRequerimiento={this.eliminarRequerimiento}
                                    access={access}
                                    busqueda={busqueda}
                                    requerimientos={requerimientos}
                                    total={totalrequerimientos}
                                    page={page}
                                    changePagination={this.changePagination}
                                    paginationSearch={this.paginationSearch}
                                    changeEstadoRequerimiento={this.changeEstadoRequerimiento}
                                    habilitarEntrevista={this.habilitarEntrevista} />
                                :
                                <NoDataLabel msj={textoresultados}/>
                            }
                        </>
                    </div>
                </section>

            </section>
        )
    }
}

export default withRouter(RequerimientosIndex);

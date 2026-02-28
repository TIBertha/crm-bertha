import React, { Component } from "react";
import Swal from "sweetalert2";
import global from "../../Helpers/constantes.js";
import {useNavigate, useParams} from "react-router-dom";

import LoadingScreen from "../Components/loadingScreen.jsx";
import Flyer from "../Components/flyer.jsx";
import IndexButton from "../Components/indexButton.jsx";
import NoDataLabel from "../Components/noDatalabel.jsx";

import {showAlert, showAlertConfirmRedirectReactRouter} from "../../Helpers/alerts.js";
import {
    ajaxCredencialesBuscar,
    ajaxCredencialesEliminar,
    ajaxRefreshCredenciales,
} from "../../Functions/Credenciales.jsx";

import CredencialesTable from "./credencialesTable.jsx";
import CredencialesSearchSideBar from "./credencialesSearchSideBar.jsx";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class CredencialesIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            indicadores: [],
            credenciales:[],
            totalcredenciales:'',
            page: '',
            textoresultados: '',
            nombrePlataforma: '',
            nivelCredencial: '',
            access:false,
            isLoading: false,
            busqueda:false,
            fastsearch: 'T',
            sideBar: false,
        };

        this.openSideBar = this.openSideBar.bind(this);
        this.changePagination = this.changePagination.bind(this);
        this.eliminar = this.eliminar.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.buscar = this.buscar.bind(this);
        this.limpiarBusqueda = this.limpiarBusqueda.bind(this);
        this.paginationSearch = this.paginationSearch.bind(this);
    }

    openSideBar(e, condition) {
        this.setState({sideBar: condition});
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    setBusqueda(condition){
        this.setState({busqueda: condition});
    }

    closeSearchSide(){
        $(".hk-wrapper").toggleClass('hk-settings-toggle');
        $(window).trigger( "resize" );
    }

    handleChange(e, tipo = '', campo = ''){
        if(tipo == 'keypress'){

            if(e.charCode === 13){
                this.buscar();
            }

        }else{

            if(e.target.name == 'fastsearch'){

                this.setState({
                    [e.target.name]: e.target.value.toUpperCase()
                }, this.refresh);

            }else{

                const input = e.target;
                const start = input.selectionStart;
                const end = input.selectionEnd;

                this.setState({
                    [e.target.name]: e.target.value
                }, () =>  (start == undefined && end == undefined) ? '' : input.setSelectionRange(start, end) );

            }

        }
    }

    paginationSearch(page){

        let pagina = parseInt(page.selected) + 1;
        let offset = (pagina - 1) * 15 ;

        ajaxCredencialesBuscar(this.state, offset).then(r => {
            if(r.code === 200){
                if(r.credenciales){
                    this.setState({
                        credenciales: r.credenciales,
                        totalcredenciales: r.total,
                        textoresultados: r.textoresultados,
                        page: r.page,
                        fastsearch: ''
                    });
                }
                this.closeSearchSide();
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch( function (error) {
            if (error.response.status == 422){
                showAlert('error', error.response.data);
            }
        });
    }

    buscar(){

        this.setLoading(true);
        this.setBusqueda(true);

        let offset = 0;

        ajaxCredencialesBuscar(this.state, offset).then(r => {
            if(r.code === 200){
                if(r.credenciales){
                    this.setState({
                        credenciales: r.credenciales,
                        totalcredenciales: r.total,
                        textoresultados: r.textoresultados,
                        page: r.page,
                        fastsearch: ''
                    });
                    this.setLoading(false);
                }else{
                    this.setLoading(false);
                }
                this.closeSearchSide();
            }else if(r.code === 500){
                this.setLoading(false);
                showAlert('error', r.msj);
            }
        }).catch( function (error) {
            if (error.response.status == 422){
                this.setLoading(false);
                showAlert('error', error.response.data);
            }
        });
    }

    limpiarBusqueda(){
        this.setState({
            nombrePlataforma: '',
            nivelCredencial: '',
            fastsearch: 'H',
            busqueda: false,
        });
        this.refresh();
    }

    eliminar(e,id){
        e.preventDefault();

        Swal.fire({
            text: "¿Está seguro que deseas eliminar al credencial?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxCredencialesEliminar(id).then(r => {
                    if(r.code === 200){
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/empleadores', navigate);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                });
            }
        });
    }

    refresh(){
        this.setLoading(true);

        ajaxRefreshCredenciales(0).then(r => {
            this.setState({
                page: r.page,
                textoresultados: r.textoresultados,
                credenciales: r.credenciales,
                totalcredenciales: r.total,
                access: r.accessCom,
            });
            this.setLoading(false);
        });

    }

    changePagination(page){

        let pagina = parseInt(page.selected) + 1;
        let offset = (pagina - 1) * 10 ;

        ajaxRefreshCredenciales(offset).then(r => {
            this.setState({
                page: pagina,
                textoresultados: r.textoresultados,
                credenciales: r.credenciales,
                totalcredenciales: r.total,
            });
        });
    }

    componentDidMount(){
        this.refresh();
    }

    render() {

        let { isLoading, credenciales, totalcredenciales, access} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <section>


                <CredencialesSearchSideBar
                    data={this.state}
                    handleChange={this.handleChange}
                    buscar={this.buscar}
                    limpiarBusqueda={this.limpiarBusqueda}
                />

                <div className="row mx-0 pt-4">
                    <IndexButton
                        type={"search"}
                        handleOpenSideBar={this.openSideBar}
                    />

                    {(access === true) &&
                        <IndexButton type={'create'} route={'/credenciales/new'}/>
                    }
                </div>

                <section className="fichas">
                    <div className="container-fluid pb-5 mt-4">

                        <div className="d-flex row mb-4 mx-0">
                            <Flyer
                                content={totalcredenciales + ' credenciales listados'}
                            ></Flyer>
                        </div>

                        <>
                            {credenciales.length > 0 ?
                                <CredencialesTable
                                    data={this.state}
                                    paginationSearch={this.paginationSearch}
                                    changePagination={this.changePagination}
                                    eliminar={this.eliminar}
                                />
                                :
                                <NoDataLabel msj={'No existen credenciales'}/>
                            }
                        </>

                    </div>
                </section>

            </section>
        )

    }
}

export default withRouter(CredencialesIndex)

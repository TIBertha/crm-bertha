import React, { Component } from "react";
import Swal from "sweetalert2";
import global from "../../Helpers/constantes.js";
import {useNavigate, useParams} from "react-router-dom";

import LoadingScreen from "../Components/loadingScreen.jsx";
import Flyer from "../Components/flyer.jsx";
import IndexButton from "../Components/indexButton.jsx";
import NoDataLabel from "../Components/noDatalabel.jsx";

import {showAlert, showAlertConfirmRedirectReactRouter} from "../../Helpers/alerts.js";
import {ajaxPrensaAction, ajaxRefreshPrensa} from "../../Functions/Prensa.jsx";

import PrensaTable from "./prensaTable.jsx";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class PrensaIndex extends Component{
    constructor(props) {
        super(props);

        this.state = {
            blogs: [],
            totalblogs: [],
            page:'',
            textoresultados: '',
            contadorDecimal: '',
            isLoading: true,
        };

        this.activar = this.activar.bind(this);
        this.prensa = this.prensa.bind(this);
        this.borrar = this.borrar.bind(this);
        this.changePagination = this.changePagination.bind(this);

    }

    activar(e, id){

        e.preventDefault();

        Swal.fire({
            text: "¿Está seguro que desea activar/inactivar el artículo?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxPrensaAction(id, '/ajax-prensa-active').then(r => {
                    if(r.code === 200){
                        this.refresh();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/prensa', navigate);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                });
            }
        });

    }

    prensa(e, id){

        e.preventDefault();

        Swal.fire({
            text: "¿Está seguro que deseas colocar el artículo en prensa?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxPrensaAction(id, '/ajax-prensa-prensa').then(r => {
                    if(r.code === 200){
                        this.refresh();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/prensa', navigate);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                });
            }
        });

    }

    borrar(e, id){

        e.preventDefault();

        Swal.fire({
            text: "¿Está seguro que desea borrar el artículo?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxPrensaAction(id, '/ajax-prensa-delete').then(r => {
                    if(r.code === 200){
                        this.refresh();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/prensa', navigate);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                });
            }
        });

    }

    changePagination(page){

        let pagina = parseInt(page.selected) + 1;
        let offset = (pagina - 1) * 10 ;
        this.setState({page: pagina});

        ajaxRefreshPrensa(offset).then(r => {

            this.setState({
                blogs: r.blogs,
                totalblogs: r.total,
                textoresultados: r.textoresultados,
                contadorDecimal:(pagina-1)*10});
        })

    }

    refresh(){

        this.setState({isLoading: true});

        ajaxRefreshPrensa().then(r => {
            this.setState({
                blogs: r.blogs,
                totalblogs: r.total,
                isLoading: false,
                contadorDecimal:0
            });
        });
    }

    componentDidMount(){
        this.refresh();
    }

    render(){

        let {isLoading, blogs, totalblogs, page, textoresultados, contadorDecimal} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return (
            <section>

                <div className="row mx-0 pt-4">
                    <IndexButton type={'create'} route={'/prensa/new'}/>
                </div>

                <section className="fichas">
                    <div className="container-fluid pb-5 mt-4">
                        <div className="d-flex row mb-4 mx-0">
                            <Flyer content={totalblogs + ' artículos de prensa listados'}></Flyer>
                        </div>

                        <>
                            {blogs.length ?
                                <PrensaTable blogs={blogs} total={totalblogs} page={page} changePagination={this.changePagination} active={this.activar} prensa={this.prensa} borrar={this.borrar} contadorDecimal={contadorDecimal}/>
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

export default withRouter(PrensaIndex);

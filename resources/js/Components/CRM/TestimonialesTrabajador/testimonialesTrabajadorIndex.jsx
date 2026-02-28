import React, { Component } from "react";
import Swal from "sweetalert2";
import global from "../../Helpers/constantes.js";
import {Link} from "react-router-dom";

import LoadingScreen from "../Components/loadingScreen.jsx";
import Flyer from "../Components/flyer.jsx";
import IndexButton from "../Components/indexButton.jsx";
import NoDataLabel from "../Components/noDatalabel.jsx";

import {showAlert, showAlertConfirmRedirectReactRouter} from "../../Helpers/alerts.js";
import {
    ajaxRefreshTestimonialesTrabajador,
    ajaxTestimonialesTrabajadorActive,
} from "../../Functions/Testimoniales.jsx";

import TestimonialesTrabajadorTable from "./testimonialesTrabajadorTable.jsx";
import {useNavigate, useParams} from "react-router-dom";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class TestimonialesTrabajadorIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: props.url,
            testimoniales: [],
            totaltestimoniales: [],
            page:'',
            textoresultados: '',
            contadorDecimal: '',
            isLoading: true,
            access: false,
        };
        this.activar = this.activar.bind(this);
        this.changePagination = this.changePagination.bind(this);
    }

    activar(e, id, estado){

        e.preventDefault();

        Swal.fire({
            text: ('¿Está seguro que desea ' + (estado ? 'in' : '') + 'activar el testimonio?'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxTestimonialesTrabajadorActive(id).then(r => {
                    if(r.code === 200){
                        this.refresh();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/testimoniales-trabajador', navigate);
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

        ajaxRefreshTestimonialesTrabajador(offset).then(r => {

            this.setState({
                testimoniales: r.testimoniales,
                totaltestimoniales: r.total,
                textoresultados: r.textoresultados,
                contadorDecimal: (pagina-1)*10
            });
        })

    }

    refresh(){

        this.setState({isLoading: true});

        ajaxRefreshTestimonialesTrabajador().then(r => {
            this.setState({
                testimoniales: r.testimoniales,
                totaltestimoniales: r.total,
                isLoading: false,
                contadorDecimal: 0,
                access: r.accessCom,
            });
        });
    }

    componentDidMount() {
        this.refresh();
    }

    render() {
        let {isLoading, testimoniales, totaltestimoniales, textoresultados} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return (
            <section className="hk-sec-wrapper new-style rounded">
                <div className="row mx-0 pt-4">
                    <IndexButton type={'create'} route={'/testimoniales-trabajador/new'}/>
                </div>

                <section className="fichas">
                    <div className="container-fluid pb-5 mt-4">

                        <div className="d-flex row mb-4 mx-0">
                            <Flyer content={totaltestimoniales + ' testimoniales de trabajadores'}></Flyer>
                        </div>

                        <>
                            {testimoniales.length ?
                                <TestimonialesTrabajadorTable data={this.state} changePagination={this.changePagination} active={this.activar}/>
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

export default withRouter(TestimonialesTrabajadorIndex);

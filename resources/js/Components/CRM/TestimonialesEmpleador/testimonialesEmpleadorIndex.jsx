import React, { Component } from "react";
import Swal from "sweetalert2";
import global from "../../Helpers/constantes.js";

import LoadingScreen from "../Components/loadingScreen.jsx";
import Flyer from "../Components/flyer.jsx";
import IndexButton from "../Components/indexButton.jsx";
import NoDataLabel from "../Components/noDatalabel.jsx";

import {showAlert, showAlertConfirmRedirectReactRouter} from "../../Helpers/alerts.js";
import {
    ajaxRefreshTestimonialesEmpleador,
    ajaxTestimonialesEmpleadorActive,
} from "../../Functions/Testimoniales.jsx";

import TestimonialesEmpleadorTable from "./testimonialesEmpleadorTable.jsx";
import {useNavigate, useParams} from "react-router-dom";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class TestimonialesEmpleadorIndex extends Component {
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
                ajaxTestimonialesEmpleadorActive(id).then(r => {
                    if(r.code === 200){
                        this.refresh();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/testimoniales-empleador', navigate);
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

        ajaxRefreshTestimonialesEmpleador(offset).then(r => {

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

        ajaxRefreshTestimonialesEmpleador().then(r => {
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
        let {isLoading, access, testimoniales, totaltestimoniales, textoresultados} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <section>
                <div className="row mx-0 pt-4">
                    <IndexButton type={'create'} route={'/testimoniales-empleador/new'}/>
                </div>

                <section className="fichas">
                    <div className="container-fluid pb-5 mt-4">

                        <div className="d-flex row mb-4 mx-0">
                            <Flyer content={totaltestimoniales + ' testimoniales de empleadores'}></Flyer>
                        </div>

                        <>
                            { testimoniales.length ?
                                <TestimonialesEmpleadorTable data={this.state} changePagination={this.changePagination} active={this.activar}/>
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

export default withRouter(TestimonialesEmpleadorIndex);

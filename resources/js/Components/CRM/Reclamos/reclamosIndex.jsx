import React, { Component } from "react";
import Swal from "sweetalert2";
import global from "../../Helpers/constantes.js";
import {useNavigate, useParams} from "react-router-dom";

import LoadingScreen from "../Components/loadingScreen.jsx";
import Flyer from "../Components/flyer.jsx";
import IndexButton from "../Components/indexButton.jsx";
import NoDataLabel from "../Components/noDatalabel.jsx";

import {showAlert, showAlertConfirmRedirect} from "../../Helpers/alerts.js";
import {ajaxReclamosAtendido, ajaxRefreshReclamos} from "../../Functions/Reclamos.jsx";

import ReclamosTable from "./reclamosTable.jsx";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class ReclamosIndex extends Component{
    constructor(props) {
        super(props);

        this.state = {
            url: props.url,
            reclamos: [],
            totalreclamos: [],
            page:'',
            textoresultados: '',
            contadorDecimal: '',
            isLoading: true
        };

        this.atendido = this.atendido.bind(this);
        this.changePagination = this.changePagination.bind(this);

    }

    atendido(e, id){

        e.preventDefault();

        Swal.fire({
            text: ('¿Está seguro que desea dar por ATENDIDO el reclamo N°' + id +'?'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxReclamosAtendido(id).then(r => {
                    if(r.code === 200){
                        const { navigate } = this.props;
                        showAlertConfirmRedirect('exito', r.msj, '/reclamos', navigate);
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

        ajaxRefreshReclamos(offset).then(r => {

            this.setState({
                reclamos: r.reclamos,
                totalreclamos: r.total,
                textoresultados: r.textoresultados,
                contadorDecimal:(pagina-1)*10
            });
        })

    }

    refresh(){

        this.setState({isLoading: true});

        ajaxRefreshReclamos().then(r => {
            this.setState({
                reclamos: r.reclamos,
                totalreclamos: r.total,
                isLoading: false
            });
        });
    }

    componentDidMount(){
        this.refresh();
    }

    render() {

        let {url, isLoading, reclamos, totalreclamos, textoresultados, contadorDecimal, page} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return (
            <section>

                <div className="row mx-0 pt-4">
                    <IndexButton type={'create'} route={'/reclamos/new'}/>
                </div>


                <section className="fichas">
                    <div className="container-fluid pb-5 mt-4">
                        <div className="d-flex row mb-4 mx-0">
                            <Flyer content={totalreclamos + ' reclamos listados'}></Flyer>
                        </div>

                        <>
                            {reclamos.length ?
                                <ReclamosTable
                                    reclamos={reclamos}
                                    total={totalreclamos}
                                    page={page}
                                    changePagination={this.changePagination}
                                    contadorDecimal={contadorDecimal}
                                    atendido={this.atendido}
                                />
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

export default withRouter(ReclamosIndex);

import React, { Component } from "react";
import Swal from "sweetalert2";
import global from "../../Helpers/constantes.js";

import LoadingScreen from "../Components/loadingScreen.jsx";
import Flyer from "../Components/flyer.jsx";
import IndexButton from "../Components/indexButton.jsx";
import NoDataLabel from "../Components/noDatalabel.jsx";

import {showAlert, showAlertConfirmRedirectReactRouter} from "../../Helpers/alerts.js";
import {
    ajaxAdministradoresActive,
    ajaxAdministradoresDelete,
    ajaxAdministradoresReset
} from "../../Functions/Administrador.jsx";
import {ajaxRefreshUsuariosInternos} from "../../Functions/UsuariosInternos.jsx";

import AdminTable from "./adminTable.jsx";
import ResetPasswords from "./Modals/resetPasswords.jsx";
import {useNavigate, useParams} from "react-router-dom";

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class AdminIndex extends Component{

    constructor(props) {
        super(props);

        this.state = {
            url: props.url,
            usuarios: [],
            totalusuarios: [],
            page: '',
            textoresultados: '',
            access: false,
            isLoading: true
        };
        this.activar = this.activar.bind(this);
        this.reset = this.reset.bind(this);
        this.changePagination = this.changePagination.bind(this);
        this.eliminarUsuario = this.eliminarUsuario.bind(this);
    }

    eliminarUsuario(e, id, nombre){
        e.preventDefault();

        Swal.fire({
            text: ('¿Está seguro que deseas eliminar al usuario ' + nombre + '?'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxAdministradoresDelete(id).then(r => {
                    if(r.code === 200){
                        this.refresh();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/usu-int', navigate);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                }).catch(function (error) {
                    showAlert('error', 'Ocurrio un problema al eliminar al usuario. Consulte al administrador');
                });
            }
        });
    }

    activar(e, id){

        e.preventDefault();

        Swal.fire({
            text: "¿Está seguro que desea activar/inactivar el usuario?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxAdministradoresActive(id).then(r => {
                    if(r.code === 200){
                        this.refresh();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/usu-int', navigate);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                }).catch( function (error) {

                });
            }
        });

    }

    reset(e, id){

        e.preventDefault();

        Swal.fire({
            text: "¿Está seguro que desea resetear la contraseña del usuario?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxAdministradoresReset(id).then(r => {
                    if(r.code === 200){
                        this.refresh();
                        const { navigate } = this.props;
                        showAlertConfirmRedirectReactRouter('exito', r.msj, '/usu-int', navigate);
                    }else if(r.code === 500){
                        showAlert('error', r.msj);
                    }
                }).catch( function (error) {

                });
            }
        });

    }

    refresh(){

        this.setState({isLoading: true});

        ajaxRefreshUsuariosInternos(0).then(r => {
            this.setState({
                page: r.page,
                textoresultados: r.textoresultados,
                usuarios: r.usuarios,
                totalusuarios: r.total,
                access: r.accessCom,
                isLoading: false
            });
        });
    }

    changePagination(page){
        let pagina = parseInt(page.selected) + 1;
        let offset = (pagina - 1) * 10 ;
        this.setState({page: pagina});

        ajaxRefreshUsuariosInternos(offset).then(r => {
            this.setState({
                page: r.page,
                usuarios: r.usuarios,
                totalusuarios: r.total,
                textoresultados: r.textoresultados,
            });
        });
    }

    componentDidMount(){
        this.refresh();
    }

    render() {

        let {isLoading, usuarios, totalusuarios, access} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>

        return (
            <section>
                <div className="row mx-0 pt-4">
                    <IndexButton type={'create'} route={'/usu-int/new'}/>

                    {(access === true) &&
                        <div className="col-12 col-md-auto px-1 my-2 my-md-0">
                            <ResetPasswords/>
                        </div>
                    }
                </div>

                <section className="fichas">
                    <div className="container-fluid pb-5 mt-4">
                        <div className="d-flex row mb-4 mx-0">
                            <Flyer content={totalusuarios + ' usuarios listados'}></Flyer>
                        </div>
                    </div>

                    {usuarios.length > 0 ?
                        <AdminTable
                            data={this.state}
                            access={access}
                            eliminarUsuario={this.eliminarUsuario}
                            changePagination={this.changePagination}
                            activar={this.activar}
                            reset={this.reset}
                        />
                        :
                        <NoDataLabel msj={'No existen usuarios'}/>
                    }
                </section>
            </section>
        )

    }
}

export default withRouter(AdminIndex);

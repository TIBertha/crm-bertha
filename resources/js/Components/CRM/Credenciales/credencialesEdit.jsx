import React, { Component } from 'react';
import {Tab, Tabs} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import {useParams, useNavigate } from "react-router-dom";

import {formButtons} from "../../Functions/General.jsx";

import TitleLabel from "../Components/titleLabel.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";

import {
    modalCancelar,
    showAlert,
    showAlertConfirmRedirectReactRouter
} from "../../Helpers/alerts.js";
import {ajaxCredencialesEdit, ajaxCredencialesGet} from "../../Functions/Credenciales.jsx";

import DatosCredenciales from './Tabs/datosCredenciales.jsx';

export function withRouter(Component) {
    return props => {
        const navigate = useNavigate();
        return <Component {...props} params={useParams()} navigate={navigate} />;
    };
}

class CredencialesEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            id: props.params.id,
            nombrePlataforma: '',
            usuario: '',
            contra: '',
            linkPlataforma: '',
            nivelCredencial: '',
            isLoading: false,
            keyTab: 'tab1',
        };

        this.save = this.save.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    setLoading(condition){
        this.setState({isLoading: condition});
    }

    cancelar(){
        const { navigate } = this.props;
        modalCancelar('/reclamos', navigate);
    }

    handleChange(e, tipo = '', campo = '', campo2 = '', llave = '') {
        if (tipo == 'time'){
            this.setState({
                [campo]: e
            })
        }else if (tipo == 'nivelCredencial'){
            this.setState({
                nivelCredencial: e.target.value
            })
        }else{
            const input = e.target;
            const start = input.selectionStart;
            const end = input.selectionEnd;

            this.setState({
                [e.target.name]: e.target.value
            }, () =>  (start == undefined && end == undefined) ? '' : input.setSelectionRange(start, end) );
        }
    }

    save(e){
        e.preventDefault();
        this.setLoading(true);
        let self = this;

        ajaxCredencialesEdit(this.state).then(r => {
            this.setLoading(false);
            if(r.code === 200){
                const { navigate } = this.props;
                showAlertConfirmRedirectReactRouter('exito', r.msj, '/credenciales', navigate);
            }else if(r.code === 500){
                showAlert('error', r.msj);
            }
        }).catch(function (error) {
            self.setLoading(false);
            if (error.response.status === 422){
                showAlert('error', error.response.data);
            }
        });

    }

    componentDidMount() {

        let {id} = this.state;
        this.setLoading(true);

        ajaxCredencialesGet(id).then(r =>{
            if(r.code === 200){
                this.setState({
                    nombrePlataforma: r.credencial.nombre_plataforma,
                    usuario: r.credencial.usuario,
                    contra: r.credencial.contra,
                    linkPlataforma: r.credencial.link_plataforma,
                    nivelCredencial: r.credencial.nivel_credencial ? (r.credencial.nivel_credencial).toString() : '',
                });
                this.setLoading(false);
            }else if(r.code === 500){
                this.setLoading(false);
                console.log(r.msj);
            }
        });
    }

    render() {
        let {isLoading, keyTab} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return (
            <>
                <TitleLabel content={'Editar credencial'}/>

                <section className="bertha-form">
                    <form method="POST" onSubmit={this.save} encType="multipart/form-data">

                        <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">
                            <Tab eventKey="tab1" title="Datos">
                                <DatosCredenciales
                                    data={this.state}
                                    handleChange={this.handleChange}
                                />
                            </Tab>
                        </Tabs>

                        <>{formButtons(isLoading, 'edit', null, '/credenciales', null)}</>
                    </form>
                </section>
            </>
        )

    }
}

export default withRouter(CredencialesEdit);

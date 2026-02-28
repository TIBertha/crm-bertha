import React, { Component } from 'react';
import {Tab, Tabs} from "react-bootstrap";

import {ajaxGetIndicadores} from "../../Functions/Indicadores.jsx";
import LoadingScreen from "../Components/loadingScreen.jsx";

import IndicadoresIngresosMensuales from "./Tabs/indicadoresIngresosMensuales.jsx";
import VisualizacionesWeb from "./Tabs/visualizacionesWeb.jsx";
import IndicadoresDataNueva from "./Tabs/indicadoresDataNueva.jsx";

export default class IndicadoresIndex extends Component{
    constructor(props) {
        super(props);

        this.state = {
            indicadores: [],
            vistasWeb: [],
            dataNueva: [],
            mesActual: 'Enero',
            access: false,
            isLoading: true,
            keyTab: 'tab1',
        };

    }

    refreshIndicadores(){

        this.setState({isLoading: true});

        ajaxGetIndicadores().then(r => {
            this.setState({
                indicadores: r.indicadores,
                //vistasWeb: r.vistasWeb,
                dataNueva: r.dataNueva,
                access: r.accessCom,
                isLoading: false,
            });
        });

        let d = new Date();
        let mes = d.toLocaleDateString('es-ES', {month: 'long'});

        this.setState({
            mesActual: mes.charAt(0).toUpperCase() + mes.slice(1)
        })
    }

    componentDidMount(){
        this.refreshIndicadores();
    }

    render() {

        let {isLoading, indicadores, vistasWeb, dataNueva, access, keyTab} = this.state;

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return(
            <section className="bertha-form">
                <Tabs defaultActiveKey={keyTab} onSelect={ (k) => this.setState({keyTab: k}) } className="tabs-pink nav-white-style">
                    <Tab eventKey="tab1" title="Venta">
                        <IndicadoresIngresosMensuales indicadores={indicadores} />
                    </Tab>

                    {/*
                    <Tab eventKey="tab2" title="Visualizaciones web">
                        <VisualizacionesWeb vistasWeb={vistasWeb}/>
                    </Tab>
                    */}

                    <Tab eventKey="tab2" title="Indicadores">
                        <IndicadoresDataNueva dataNueva={dataNueva}/>
                    </Tab>
                </Tabs>

            </section>
        )

    }
}

import React, { Component } from "react";
import IndexButton from "../Components/indexButton";
import ButtonAccess from "../Layouts/SubComponents/buttonAccess";
import PostulantesSearchSideBar from "./postulantesSearchSideBar";
import {
    ajaxPostulantesGetDataInicial,
    ajaxRefreshPostulantes,
} from "../../Functions/Postulantes";
import Flyer from "../Components/flyer";
import NoDataLabel from "../Components/noDatalabel";
import ReactPaginate from "react-paginate";
import global from "../../Helpers/constantes.js";
import { showAlert, showAlertConfirmRedirect } from "../../Helpers/alerts.js";
import CardPostulante from "../Components/cardPostulante";
import LoadingScreen from "../Components/loadingScreen";
import { ajaxSearchDistrito } from "../../Functions/General.jsx";
import CalculadoraBeneficio from "./Modals/CalculadoraBeneficio/calculadoraBeneficio.jsx";
import RegistrarUsuario from "./Modals/RegistrarUsuario/registrarUsuario.jsx";

//PostulantesIndex

export default class PostulantesIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: props.url,
            trabajadorid: "",
            postulantes: [],
            token: "",
            telefonorecomendacion: "",
            totalpostulantes: "",
            pagina: "",
            nombre: "",
            nacionalidad: "",
            nacionalidades: [],
            telefono: "",
            telefonowhatsapp: "",
            fechaactdesde: "",
            fechaacthasta: "",
            actividad: "",
            modalidad: "",
            distrito: "",
            estado: "",
            documento: "",
            resultadocovid: "",
            tuvocovid: "",
            departamentonac: "",
            paispostulacion: "",
            textoresultados: "",
            actividades: [],
            modalidades: [],
            distritos: [],
            estados: [],
            resultadoscovid: [],
            isLoading: true,
            access: false,
            sideBar: false,
        };

        this.openSideBar = this.openSideBar.bind(this);

        this.contactado = this.contactado.bind(this);
        this.antecedentes = this.antecedentes.bind(this);
        this.baja = this.baja.bind(this);
        this.colocar = this.colocar.bind(this);
        this.completar = this.completar.bind(this);
        this.noDisponible = this.noDisponible.bind(this);
        this.porVerificar = this.porVerificar.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.buscar = this.buscar.bind(this);
        this.limpiar = this.limpiar.bind(this);
        this.loadDistritoOptions = this.loadDistritoOptions.bind(this);
    }

    setLoading(condition) {
        this.setState({
            isLoading: condition,
        });
    }

    calcularOffset(pagina) {
        return (pagina - 1) * 9;
    }

    handleChange(e, tipo = "", campo = "") {
        if (tipo == "time") {
            this.setState({
                [campo]: e,
            });
        } else if (tipo == "keypress") {
            if (e.charCode === 13) {
                this.buscar();
            }
        } else {
            const input = e.target;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            this.setState(
                {
                    [e.target.name]: e.target.value.toUpperCase(),
                },
                () =>
                    start == undefined && end == undefined
                        ? ""
                        : input.setSelectionRange(start, end),
            );
        }
    }

    contactado(e, id) {
        let question = "¿Está seguro que desea cambiar el estado a contactado?";
        let url = "/ajax-postulantes-contactado";

        e.preventDefault();

        Swal.fire({
            text: question,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxExecuteChangePostulante(url, id).then((r) => {
                    if (r.code === 200) {
                        showAlertConfirmRedirect(
                            "exito",
                            r.msj,
                            "/postulantes",
                        );
                    } else if (r.code === 500) {
                        showAlert("error", r.msj);
                    }
                });
            }
        });
    }

    antecedentes(e, id) {
        let question =
            "¿Está seguro que desea generar una solicitud de antecedentes?";
        let url = "/ajax-postulantes-antecedentes";

        e.preventDefault();

        Swal.fire({
            text: question,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxExecuteChangePostulante(url, id).then((r) => {
                    if (r.code === 200) {
                        showAlertConfirmRedirect(
                            "exito",
                            r.msj,
                            "/postulantes",
                        );
                    } else if (r.code === 500) {
                        showAlert("error", r.msj);
                    }
                });
            }
        });
    }

    porVerificar(e, id) {
        let question =
            "¿Está seguro que desea cambiar el estado a por verificar?";
        let url = "/ajax-postulantes-porverificar";

        e.preventDefault();

        Swal.fire({
            text: question,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxExecuteChangePostulante(url, id).then((r) => {
                    if (r.code === 200) {
                        showAlertConfirmRedirect(
                            "exito",
                            r.msj,
                            "/postulantes",
                        );
                    } else if (r.code === 500) {
                        showAlert("error", r.msj);
                    }
                });
            }
        });
    }

    noDisponible(e, id) {
        let question =
            "¿Está seguro que desea cambiar el estado a no disponible?";
        let url = "/ajax-postulantes-nodisponible";

        e.preventDefault();

        Swal.fire({
            text: question,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxExecuteChangePostulante(url, id).then((r) => {
                    if (r.code === 200) {
                        showAlertConfirmRedirect(
                            "exito",
                            r.msj,
                            "/postulantes",
                        );
                    } else if (r.code === 500) {
                        showAlert("error", r.msj);
                    }
                });
            }
        });
    }

    eliminar(e, id) {
        let question = "¿Está seguro que deseas eliminar al postulante?";
        let url = "/ajax-postulantes-eliminar";

        e.preventDefault();

        Swal.fire({
            text: question,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxExecuteChangePostulante(url, id).then((r) => {
                    if (r.code === 200) {
                        showAlertConfirmRedirect(
                            "exito",
                            r.msj,
                            "/postulantes",
                        );
                    } else if (r.code === 500) {
                        showAlert("error", r.msj);
                    }
                });
            }
        });
    }

    baja(e, id) {
        let question = "¿Está seguro que desea cambiar el estado a de baja?";
        let url = "/ajax-postulantes-baja";

        e.preventDefault();

        Swal.fire({
            text: question,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxExecuteChangePostulante(url, id).then((r) => {
                    if (r.code === 200) {
                        showAlertConfirmRedirect(
                            "exito",
                            r.msj,
                            "/postulantes",
                        );
                    } else if (r.code === 500) {
                        showAlert("error", r.msj);
                    }
                });
            }
        });
    }

    colocar(e, id) {
        let question =
            "¿Está seguro que desea cambiar el estado a por colocar?";
        let url = "/ajax-postulantes-colocar";

        e.preventDefault();

        Swal.fire({
            text: question,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxExecuteChangePostulante(url, id).then((r) => {
                    if (r.code === 200) {
                        showAlertConfirmRedirect(
                            "exito",
                            r.msj,
                            "/postulantes",
                        );
                    } else if (r.code === 500) {
                        showAlert("error", r.msj);
                    }
                });
            }
        });
    }

    completar(e, id) {
        let question =
            "¿Está seguro que desea cambiar el estado a por completar?";
        let url = "/ajax-postulantes-completar";

        e.preventDefault();

        Swal.fire({
            text: question,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: global.PURPLEBERTHA,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                ajaxExecuteChangePostulante(url, id).then((r) => {
                    if (r.code === 200) {
                        showAlertConfirmRedirect(
                            "exito",
                            r.msj,
                            "/postulantes",
                        );
                    } else if (r.code === 500) {
                        showAlert("error", r.msj);
                    }
                });
            }
        });
    }

    refreshPostulantes() {
        this.setLoading(true);

        ajaxRefreshPostulantes(this.calcularOffset(1), this.state).then((r) => {
            this.setState({
                postulantes: r.postulantes,
                totalpostulantes: r.total,
                textoresultados: r.textoresultados,
                access: r.accessCom,
            });
            this.setLoading(false);
        });
    }

    getDataInicial() {
        ajaxPostulantesGetDataInicial().then((r) => {
            this.setState({
                actividades: r.actividades,
                nacionalidades: r.nacionalidades,
                modalidades: r.modalidades,
                distritos: r.distritos,
                estados: r.estados,
                resultadoscovid: r.resultadoscovid,
            });
        });
    }

    openSideBar(e, condition) {
        this.setState({
            sideBar: condition,
        });
    }

    onChangePage({ selected }) {
        let pagina = selected + 1;

        ajaxRefreshPostulantes(this.calcularOffset(pagina), this.state)
            .then((r) => {
                this.setState({
                    postulantes: r.postulantes,
                    totalpostulantes: r.total,
                    textoresultados: r.textoresultados,
                });
            })
            .catch(function (error) {
                showAlert("error", error.response.data);
            });
    }

    buscar(e) {
        if (e) {
            e.preventDefault();
        }
        this.setLoading(true);

        ajaxRefreshPostulantes(this.calcularOffset(1), this.state)
            .then((r) => {
                if (r.code === 200) {
                    if (r.postulantes) {
                        this.setState({
                            postulantes: r.postulantes,
                            totalpostulantes: r.total,
                            textoresultados: r.textoresultados,
                        });
                        this.setLoading(false);
                    } else {
                        this.setLoading(false);
                    }
                    this.closeSearchSide();
                } else if (r.code === 500) {
                    this.setLoading(false);
                    showAlert("error", r.msj);
                }
            })
            .catch(function (error) {
                if (error.response.status == 422) {
                    this.setLoading(false);
                    showAlert("error", error.response.data);
                }
            });
    }

    limpiar() {
        this.setState(
            {
                trabajadorid: "",
                nombre: "",
                nacionalidad: "",
                telefono: "",
                telefonowhatsapp: "",
                fechaactdesde: "",
                fechaacthasta: "",
                actividad: "",
                modalidad: "",
                distrito: "",
                estado: "",
                documento: "",
                resultadocovid: "",
                tuvocovid: "",
                departamentonac: "",
                paispostulacion: "",
            },
            this.buscar,
        );
    }

    loadDistritoOptions(search, callback) {
        if (!search) {
            callback([]);
        } else {
            setTimeout(() => {
                ajaxSearchDistrito(search, null)
                    .then((r) => {
                        callback(r.data);
                    })
                    .catch(function (error) {
                        showAlert("error", error.response.data);
                    });
            });
        }
    }
    /* sdsa*/
    componentDidMount() {
        this.getDataInicial();
        this.refreshPostulantes();
    }

    render() {
        let {
            url,
            sideBar,
            access,
            textoresultados,
            postulantes,
            totalpostulantes,
            isLoading,
        } = this.state;

        let links = {
            ElDNI: "https://dniperu.com/buscar-dni-nombres-apellidos/",
            SIS: "http://app.sis.gob.pe/SisConsultaEnLinea/Consulta/frmConsultaEnLinea.aspx",
            RUN: "https://consulta.servel.cl",
        };

        if(isLoading) return <LoadingScreen load={isLoading} classStyle={'bg-purple-bertha'}/>;

        return (
            <section>
                <PostulantesSearchSideBar
                    data={this.state}
                    sideBar={sideBar}
                    handleOpenSideBar={this.openSideBar}
                    handleChange={this.handleChange}
                    buscar={this.buscar}
                    limpiar={this.limpiar}
                    loadDistritoOptions={this.loadDistritoOptions}
                />

                <div className="row mx-0 pt-4">
                    <IndexButton
                        type={"search"}
                        handleOpenSideBar={this.openSideBar}
                    />

                    <IndexButton
                        type={"create"}
                        route={"/postulantes/new"}
                    />

                    <div className="col-12 col-md-auto px-1 my-2 my-md-0">
                        <ButtonAccess
                            url={links.ElDNI}
                            buttonColor={"green"}
                            icon={"far fa-id-card"}
                            title={"Buscar por DNI peruano"}
                        />
                    </div>

                    <div className="col-12 col-md-auto px-1 my-2 my-md-0">
                        <CalculadoraBeneficio />
                    </div>

                    {access == true && (
                        <div className="col-12 col-md-auto px-1 my-2 my-md-0">
                            <RegistrarUsuario />
                        </div>
                    )}
                </div>

                <section className="fichas">
                    <div className="container-fluid pb-5 mt-4">
                        <div className="d-flex row mb-4 mx-0">
                            <Flyer
                                content={totalpostulantes + " postulantes listados"}
                            ></Flyer>
                        </div>

                        <>
                            {postulantes.length ? (
                                <div className="d-flex flex-wrap">
                                    {postulantes.map((p, key) => (
                                        <CardPostulante
                                            url={url}
                                            access={access}
                                            data={p}
                                            modelCard={1}
                                            refreshPostulantes={this.refreshPostulantes}
                                            handleContactado={this.contactado}
                                            handleNoDisponible={this.noDisponible}
                                            handlePorColocar={this.colocar}
                                            handleEliminarFicha={this.eliminar}
                                            handlePorCompletar={this.completar}
                                            handlePorVerificar={this.porVerificar}
                                        />
                                    ))}
                                    <div className="pt-4 pe-2 pb-4 col-12 text-center">
                                        <nav aria-label="Page navigation">
                                            <ReactPaginate
                                                pageCount={Math.ceil((totalpostulantes? totalpostulantes : 0) / 9,)}
                                                initialPage={0}
                                                forcePage={0}
                                                marginPagesDisplayed={2}
                                                pageRangeDisplayed={2}
                                                previousLabel={"Previo"}
                                                nextLabel={"Siguiente"}
                                                containerClassName="pagination pagination-sm pagination-seleccion"
                                                breakClassName="page-item"
                                                breakLinkClassName="page-link"
                                                pageClassName="page-item"
                                                previousClassName="page-item"
                                                nextClassName="page-item"
                                                pageLinkClassName="page-link"
                                                previousLinkClassName="page-link"
                                                nextLinkClassName="page-link"
                                                activeClassName="active"
                                                disableInitialCallback={true}
                                                onPageChange={(data) =>
                                                    this.onChangePage(
                                                        data,
                                                    )
                                                }
                                            />
                                        </nav>
                                    </div>
                                </div>
                            ) : (
                                <NoDataLabel msj={textoresultados} />
                            )}
                        </>
                    </div>
                </section>
            </section>
        );
    }
}

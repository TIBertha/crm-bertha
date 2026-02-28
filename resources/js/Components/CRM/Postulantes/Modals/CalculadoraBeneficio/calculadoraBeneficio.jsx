import React, { useState } from "react";
import { Modal, ModalBody, ModalTitle } from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import es from "date-fns/locale/es";
import DatePicker from "react-datepicker";
import {
    ajaxCalcularLiquidacion,
    ajaxGetRegistroLiquidaciones,
} from "../../../../Functions/Postulantes.jsx";
import { isResponsive } from "../../../../Functions/General.jsx";
import { IMaskInput } from "react-imask";
import CardRegistro from "./cardRegistro.jsx";
import toast from "react-hot-toast";

export default function CalculadoraBeneficio({}) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(1);
    const [fechaIngreso, setFechaIngreso] = useState(null);
    const [totalDias, setTotalDias] = useState(null);
    const [fechaCese, setFechaCese] = useState(null);
    const [monto, setMonto] = useState(20);
    const [sueldo, setSueldo] = useState(null);
    const [copyNL, setCopyNL] = useState(null);
    const [copyAL, setCopyAL] = useState(null);
    const [registros, setRegistros] = useState([]);
    const [loadingRegistros, setLoadingRegistros] = useState(false);
    let conf = { title: "Calculadora de Beneficio", icon: "fas fa-calculator" };
    let responsive = isResponsive();
    let celdas = {
        label: "col-12 col-md-3 align-self-center text-start",
        input: "col-12 col-md-9",
    };

    const [backgroundColorNL, setBackgroundColorNL] = useState("#00acf0");
    const [backgroundColorAL, setBackgroundColorAL] = useState("#ffc107");

    let iconStyleColorNL = {
        backgroundColor: backgroundColorNL,
        color: "#FFFFFF",
    };
    let iconStyleColorAL = {
        backgroundColor: backgroundColorAL,
        color: "#FFFFFF",
    };

    function handleCopyNL(textCopy, successMsj) {
        navigator.clipboard.writeText(textCopy);
        toast(successMsj, {
            icon: "✅",
        });

        setBackgroundColorNL("#037eab");

        setTimeout(function () {
            setBackgroundColorNL("#00acf0");
        }, 1500);
    }

    function handleCopyAL(textCopy, successMsj) {
        navigator.clipboard.writeText(textCopy);
        toast(successMsj, {
            icon: "✅",
        });

        setBackgroundColorAL("#9d7701");

        setTimeout(function () {
            setBackgroundColorAL("#ffc107");
        }, 1500);
    }

    function handleChange(e, campo) {
        if (campo == "fechaIngreso") {
            setFechaIngreso(e);
            if (fechaCese) {
                getTotalDias(e, fechaCese);
            }
        } else if (campo == "fechaCese") {
            setFechaCese(e);
            if (fechaIngreso) {
                getTotalDias(fechaIngreso, e);
            }
        }
    }

    function getTotalDias(FI, FC) {
        if (FI && FC) {
            let fc = moment(FC);
            let fi = moment(FI);

            setTotalDias(fc.diff(fi, "days"));
        }
    }

    function openModal(e) {
        setShow(true);
        cleanData();
    }
    function cleanData(e) {
        setMonto(20);
        setFechaIngreso(null);
        setFechaCese(null);
        setSueldo("");
        setCopyNL(null);
        setCopyAL(null);
        setTotalDias(null);
    }

    function calcular(e) {
        setLoading(true);
        ajaxCalcularLiquidacion(fechaIngreso, fechaCese, sueldo, monto)
            .then((r) => {
                if (r.code === 200) {
                    setCopyNL(r.copyNuevaLey);
                    setCopyAL(r.copyAntiguaLey);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })
            .catch(function (error) {
                setLoading(false);
            });
    }

    function setView2(e) {
        setView(2);
        getData();
    }

    function getData() {
        setLoadingRegistros(true);
        ajaxGetRegistroLiquidaciones()
            .then((r) => {
                if (r.code === 200) {
                    setRegistros(r.data);
                    setLoadingRegistros(false);
                } else {
                    setLoadingRegistros(false);
                }
            })
            .catch(function (error) {
                setLoadingRegistros(false);
            });
    }

    function view1() {
        return (
            <>
                <section className="main round-bg text-dark">
                    <div className="form-group row mx-0">
                        <div className={celdas.label}>
                            <label className="mb-0">1.- Monto</label>
                        </div>
                        <div className={celdas.input}>
                            <input
                                type="text"
                                className={"form-control no-box-shadow"}
                                name="monto"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                placeholder="Ingrese el monto"
                            />
                        </div>
                    </div>
                </section>

                <div className="py-2"></div>

                <div className="round-bg text-dark">
                    <p className="text-start special-description mb-0">
                        Llene los campos para calcular los beneficios laborales.
                        Para recibir beneficios se debe laborar por{" "}
                        <strong>más de 30 días</strong>.
                    </p>
                </div>

                <div className="py-2"></div>

                <section className="main round-bg text-dark">
                    <div className="form-group row mx-0">
                        <div className={celdas.label}>
                            <label className="mb-0">
                                1.- Inicio de labores
                            </label>
                        </div>
                        <div className={celdas.input}>
                            <DatePicker
                                selected={fechaIngreso}
                                selectsStart
                                startDate={fechaIngreso}
                                endDate={fechaCese}
                                onChange={(e) =>
                                    handleChange(e, "fechaIngreso")
                                }
                                showMonthDropdown
                                showYearDropdown
                                dateFormat="dd/MM/yyyy"
                                scrollableYearDropdown
                                locale={es}
                                maxDate={new Date()}
                                dropdownMode="select"
                                className={
                                    "form-control no-box-shadow " +
                                    (totalDias && totalDias < 30
                                        ? "warning-field"
                                        : "")
                                }
                                name="fechaingreso"
                                placeholderText="Selecciona la fecha de inicio"
                                autoComplete="off"
                                disabled={!monto}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <hr />
                    </div>

                    <div className="form-group row mx-0">
                        <div className={celdas.label}>
                            <label className="mb-0">2.- Fin de labores</label>
                        </div>
                        <div className={celdas.input}>
                            <DatePicker
                                selected={fechaCese}
                                selectsEnd
                                startDate={fechaCese}
                                endDate={fechaCese}
                                onChange={(e) => handleChange(e, "fechaCese")}
                                showMonthDropdown
                                showYearDropdown
                                dateFormat="dd/MM/yyyy"
                                scrollableYearDropdown
                                locale={es}
                                minDate={fechaIngreso}
                                dropdownMode="select"
                                className={
                                    "form-control no-box-shadow " +
                                    (totalDias && totalDias < 30
                                        ? "warning-field"
                                        : "")
                                }
                                name="fechacese"
                                placeholderText="Selecciona la fecha de fin"
                                autoComplete="off"
                                disabled={!monto}
                            />
                        </div>
                        {totalDias && totalDias < 30 && (
                            <div className={"col-12 text-danger pt-3"}>
                                <b>
                                    Para recibir beneficios se debe laborar por
                                    más de 30 días
                                </b>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <hr />
                    </div>

                    <div className="form-group row mx-0">
                        <div className={celdas.label}>
                            <label className="mb-0">3.- Sueldo</label>
                        </div>
                        <div className={celdas.input}>
                            <IMaskInput
                                type="text"
                                className="form-control no-box-shadow"
                                placeholder="Ingrese el sueldo"
                                value={sueldo}
                                onChange={(e) => setSueldo(e.target.value)}
                                name="sueldo"
                                mask="99999999"
                                maskPlaceholder=""
                                maskChar=""
                                disabled={!monto}
                            />
                        </div>
                    </div>
                </section>

                <div className="py-2"></div>

                <section className="main round-bg">
                    {copyNL && copyAL && (
                        <button
                            type="button"
                            onClick={(e) => cleanData(e)}
                            className={
                                "btn btn-lg btn-block bertha-purple-button no-box-shadow"
                            }
                        >
                            Borrar datos
                        </button>
                    )}

                    {!(copyNL && copyAL) && (
                        <button
                            type="button"
                            onClick={(e) => calcular(e)}
                            className={
                                "btn btn-lg btn-block bertha-green-button no-box-shadow"
                            }
                            disabled={!(monto && fechaIngreso && fechaCese && sueldo && totalDias >= 30)}
                        >
                            Calcular
                        </button>
                    )}

                    {copyNL && copyAL && (
                        <>
                            <div className="py-2"></div>

                            <div className={"text-dark text-start"}>
                                El reporte de beneficios fue generado con éxito:
                            </div>

                            <div className={"text-center mt-2"}>
                                <a
                                    className={
                                        "btn btn-lg btn-block font-weight-bold"
                                    }
                                    style={iconStyleColorNL}
                                    onClick={(e) =>
                                        handleCopyNL(copyNL, "Texto copiado")
                                    }
                                >
                                    <i className={"fas fa-copy me-2"}></i>
                                    Copiar calculo NUEVA LEY
                                </a>
                            </div>

                            <div className={"text-center mt-2"}>
                                <a
                                    className={
                                        "btn btn-lg btn-block font-weight-bold"
                                    }
                                    style={iconStyleColorAL}
                                    onClick={(e) =>
                                        handleCopyAL(copyAL, "Texto copiado")
                                    }
                                >
                                    <i className={"fas fa-copy me-2"}></i>
                                    Copiar calculo ANTIGUA LEY
                                </a>
                            </div>
                        </>
                    )}
                </section>
            </>
        );
    }

    return (
        <>
            <a
                className={responsive == true ? "w-100" : ""}
                role="button"
                onClick={(e) => openModal(e)}
            >
                <div
                    className={
                        "btn bertha-purple-button font-weight-bold font btn-" + (responsive == true ? "lg w-100" : "sm text-white")
                    }
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={conf.title}
                >
                    <i className={conf.icon + " icon-question"}></i>
                    {responsive == true && (<span className="ms-2">{conf.title}</span>)}
                </div>
            </a>
            <Modal
                size={"xl"}
                show={show}
                onHide={() => setShow(false)}
                centered={true}
            >
                <ModalHeader className="border-0" closeButton>
                    <ModalTitle>
                        <h6>{conf.title}</h6>
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="py-20 text-center">
                    {loading ? (
                        <section className="isLoadingArea">
                            <i className="fas fa-sync fa-spin"></i>
                        </section>
                    ) : (
                        <section>
                            <div className={"main round-bg text-dark"}>
                                <a
                                    className={"btn m-2 cusbutton" + (view === 1 ? " selected" : " noselected")}
                                    onClick={(e) => setView(1)}
                                >
                                    Nuevo Calculo
                                </a>
                                <a
                                    className={"btn m-2 cusbutton" + (view === 2 ? " selected": " noselected")}
                                    onClick={(e) => setView2(e)}
                                >
                                    Historial Calculo
                                </a>

                                <div className="py-2"></div>

                                {view === 1 && view1()}

                                {view === 2 && (
                                    <>
                                        {loadingRegistros ? (
                                            <section className="isLoadingArea">
                                                <i className="fas fa-sync fa-spin"></i>
                                            </section>
                                        ) : (
                                            <section className={'modal-calculob'}>
                                                {registros.length > 0 ? (
                                                    <div className={"row mx-0"}>
                                                        {registros.map(
                                                            (d, index) => (
                                                                <div className={"col-12 col-sm-6 py-2"}>
                                                                    <CardRegistro data={d}/>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="round-bg text-dark">
                                                        <b className="text-start special-description mb-0">
                                                            No hay data.
                                                        </b>
                                                    </div>
                                                )}
                                            </section>
                                        )}
                                    </>
                                )}
                            </div>
                        </section>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
}

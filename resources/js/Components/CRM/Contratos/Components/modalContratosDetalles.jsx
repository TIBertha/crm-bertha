import React, { useState } from 'react';
import {
    Modal,
    ModalBody,
    ModalTitle,
    ModalFooter,
} from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';
import moment from 'moment';
import { currencySoles } from '../../../Helpers/strings.js';
import { ajaxGetDataModalDetallesContratos } from '../../../Functions/Contratos.jsx';
import { isResponsive } from '../../../Functions/General.jsx';
import CardContratoDetalles from './cardContratoDetalles.jsx';

function CampoDetalle({ label, children, completo = false }) {
    return (
        <div className={`detalle-campo${completo ? ' completo' : ''}`}>
            <dt>{label}</dt>
            <dd>{children ?? '—'}</dd>
        </div>
    );
}

function formatFecha(fecha) {
    if (!fecha) return '—';

    const valor = moment(fecha);

    return valor.isValid()
        ? valor.format('DD/MM/YYYY')
        : '—';
}

function obtenerHistorial(historial) {
    if (Array.isArray(historial)) return historial;
    if (!historial) return [];

    try {
        const resultado = JSON.parse(historial);
        return Array.isArray(resultado) ? resultado : [];
    } catch {
        return [];
    }
}

export default function ModalContratosDetalles({ idCont }) {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    const responsive = isResponsive();
    const title = `Detalles del contrato #${idCont}`;

    const historial = obtenerHistorial(data?.historial);

    async function openModal() {
        setShow(true);
        setIsLoading(true);
        setData(null);
        setError('');

        try {
            const respuesta = await ajaxGetDataModalDetallesContratos(idCont);

            if (respuesta.code !== 200 || !respuesta.data) {
                throw new Error('No se encontraron los datos del contrato.');
            }

            setData(respuesta.data);
        } catch {
            setError('No pudimos cargar los detalles del contrato.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <a
                className="button-information-modal text-white"
                role="button"
                tabIndex={0}
                onClick={openModal}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal();
                    }
                }}
                aria-label={title}
                title={title}
            >
                <i
                    className="fas fa-info-circle"
                    aria-hidden="true"
                />

                {responsive && (
                    <span className="ms-2">{title}</span>
                )}
            </a>

            <Modal
                size="lg"
                className="modal-contratos-detalles"
                show={show}
                onHide={() => setShow(false)}
                aria-labelledby={`contrato-detalles-title-${idCont}`}
                centered
                scrollable
            >
                <ModalHeader closeButton>
                    <ModalTitle
                        id={`contrato-detalles-title-${idCont}`}
                    >
                        {title}
                    </ModalTitle>
                </ModalHeader>

                <ModalBody>
                    {isLoading ? (
                        <div className="detalles-loading" role="status">
                            <i
                                className="fas fa-spinner fa-spin"
                                aria-hidden="true"
                            />
                            <span>Cargando detalles…</span>
                        </div>
                    ) : error ? (
                        <div className="detalles-error" role="alert">
                            <p>{error}</p>

                            <button
                                type="button"
                                className="detalles-reintentar"
                                onClick={openModal}
                            >
                                <i
                                    className="fas fa-sync-alt"
                                    aria-hidden="true"
                                />
                                Reintentar
                            </button>
                        </div>
                    ) : data ? (
                        <div className="detalles-secciones">
                            <section className="detalle-seccion">
                                <h3 className="detalle-titulo">
                                    Requerimiento
                                </h3>

                                <dl className="detalles-grid">
                                    <CampoDetalle label="Número">
                                        {data.requerimiento_id}
                                    </CampoDetalle>

                                    <CampoDetalle label="Modalidad">
                                        {data.modalidad}
                                    </CampoDetalle>

                                    {data.frecuencia_servicio && (
                                        <CampoDetalle label="Frecuencia">
                                            {data.frecuencia_servicio}
                                        </CampoDetalle>
                                    )}

                                    {data.valor_dia_frecuencia && (
                                        <CampoDetalle label="Pago por día">
                                            {data.valor_dia_frecuencia}
                                        </CampoDetalle>
                                    )}

                                    {data.dias_frecuencia && (
                                        <CampoDetalle
                                            label="Días laborables"
                                            completo
                                        >
                                            {data.dias_frecuencia}
                                        </CampoDetalle>
                                    )}

                                    {data.sueldo
                                        && Number(data.modalidad_id) === 3
                                        && (
                                            <CampoDetalle label="Sueldo base">
                                                {data.sueldo}
                                            </CampoDetalle>
                                        )}
                                </dl>
                            </section>

                            <section className="detalle-seccion">
                                <h3 className="detalle-titulo">
                                    Empleador
                                </h3>

                                <dl className="detalles-grid">
                                    <CampoDetalle label="N.º de documento">
                                        {data.empleador_num_doc || '—'}
                                    </CampoDetalle>

                                    <CampoDetalle label="Teléfono">
                                        {data.empleador_tel ? (
                                            <a href={`tel:${data.empleador_tel}`}>
                                                {data.empleador_tel}
                                            </a>
                                        ) : '—'}
                                    </CampoDetalle>

                                    <CampoDetalle label="Correo" completo>
                                        {data.empleador_mail ? (
                                            <a href={`mailto:${data.empleador_mail}`}>
                                                {data.empleador_mail}
                                            </a>
                                        ) : '—'}
                                    </CampoDetalle>
                                </dl>
                            </section>

                            <section className="detalle-seccion">
                                <h3 className="detalle-titulo">
                                    Contrato
                                </h3>

                                <dl className="detalles-grid">
                                    <CampoDetalle label="N.º de contrato">
                                        {data.id}
                                    </CampoDetalle>

                                    <CampoDetalle label="Garantía">
                                        {data.garantia != null
                                            ? `${data.garantia} ${
                                                Number(data.garantia) === 1
                                                    ? 'mes'
                                                    : 'meses'
                                            }`
                                            : '—'}
                                    </CampoDetalle>

                                    <CampoDetalle label="Inicio de garantía">
                                        <span className="detalle-fecha">
                                            <i
                                                className="far fa-calendar-alt"
                                                aria-hidden="true"
                                            />
                                            {formatFecha(data.fecha_inicio_garantia)}
                                        </span>
                                    </CampoDetalle>

                                    <CampoDetalle label="Fin de garantía">
                                        <span className="detalle-fecha">
                                            <i
                                                className="far fa-calendar-alt"
                                                aria-hidden="true"
                                            />
                                            {formatFecha(data.fecha_fin_garantia)}
                                        </span>
                                    </CampoDetalle>
                                </dl>
                            </section>

                            {Number(data.forma_pago_id) === 2 && (
                                <section className="detalle-seccion">
                                    <h3 className="detalle-titulo">
                                        Pagos
                                    </h3>

                                    <dl className="detalles-grid">
                                        <CampoDetalle label="Adelanto">
                                            {currencySoles(data.adelanto || 0)}
                                        </CampoDetalle>

                                        <CampoDetalle label="Debe">
                                            {currencySoles(data.debe || 0)}
                                        </CampoDetalle>

                                        <CampoDetalle label="Modo adelanto">
                                            {data.modo_pago_adelanto || '—'}
                                        </CampoDetalle>

                                        <CampoDetalle label="Modo debe">
                                            {data.modo_pago_debe || '—'}
                                        </CampoDetalle>

                                        <CampoDetalle label="Fecha adelanto">
                                            {formatFecha(data.fecha_pago_adelanto)}
                                        </CampoDetalle>

                                        <CampoDetalle label="Fecha debe">
                                            {formatFecha(data.fecha_pago_debe)}
                                        </CampoDetalle>
                                    </dl>
                                </section>
                            )}

                            {data.historial && (
                                <section className="detalle-seccion">
                                    <h3 className="detalle-titulo">
                                        Historial
                                        <span className="detalle-contador">
                                            {historial.length}
                                        </span>
                                    </h3>

                                    <div className="detalles-historial">
                                        {historial.length > 0 ? (
                                            historial.map((item, index) => (
                                                <CardContratoDetalles
                                                    key={`${item.id ?? 'contrato'}-${index}`}
                                                    data={item}
                                                    actual={
                                                        Number(data.id)
                                                        === Number(item.id)
                                                    }
                                                />
                                            ))
                                        ) : (
                                            <p className="historial-vacio">
                                                No hay registros en el historial.
                                            </p>
                                        )}
                                    </div>
                                </section>
                            )}
                        </div>
                    ) : null}
                </ModalBody>
            </Modal>
        </>
    );
}

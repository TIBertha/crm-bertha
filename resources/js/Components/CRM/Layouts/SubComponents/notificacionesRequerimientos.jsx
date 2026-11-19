import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function NotificacionesRequerimientos({ url }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notificaciones, setNotificaciones] = useState([]);
    const [total, setTotal] = useState(0);

    const containerRef = useRef(null);
    const requestRef = useRef(null);
    const loadingRef = useRef(false);

    const baseUrl = (url || '').replace(/\/$/, '');

    async function cargarNotificaciones() {
        if (loadingRef.current) return;

        const controller = new AbortController();

        requestRef.current = controller;
        loadingRef.current = true;

        setLoading(true);
        setError('');

        try {
            const { data } = await axios.get(
                `${baseUrl}/ajax-notificaciones-requerimientos`,
                { signal: controller.signal }
            );

            if (data.code !== 200) {
                throw new Error('Respuesta inesperada');
            }

            setNotificaciones(data.notificaciones ?? []);
            setTotal(data.total ?? 0);
        } catch (err) {
            if (!axios.isCancel(err)) {
                setError('No pudimos cargar las notificaciones.');
            }
        } finally {
            if (requestRef.current === controller) {
                loadingRef.current = false;
                requestRef.current = null;

                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }
    }

    useEffect(() => {
        cargarNotificaciones();

        return () => {
            requestRef.current?.abort();
            requestRef.current = null;
            loadingRef.current = false;
        };
    }, [baseUrl]);

    useEffect(() => {
        if (!open) return;

        function cerrarAlSalir(event) {
            if (
                containerRef.current
                && !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        function cerrarConEscape(event) {
            if (event.key === 'Escape') {
                setOpen(false);
                containerRef.current
                    ?.querySelector('.notificaciones-bell')
                    ?.focus();
            }
        }

        document.addEventListener('pointerdown', cerrarAlSalir);
        document.addEventListener('keydown', cerrarConEscape);

        return () => {
            document.removeEventListener('pointerdown', cerrarAlSalir);
            document.removeEventListener('keydown', cerrarConEscape);
        };
    }, [open]);

    function toggleNotificaciones() {
        if (!open) {
            cargarNotificaciones();
        }

        setOpen(!open);
    }

    return (
        <div className="notificaciones-req" ref={containerRef}>
            <button
                type="button"
                className={`notificaciones-bell${open ? ' active' : ''}`}
                onClick={toggleNotificaciones}
                aria-label={`Requerimientos web: ${total} por completar`}
                aria-expanded={open}
                aria-controls="notificaciones-requerimientos-panel"
                title="Requerimientos web"
            >
                <i className="fa-regular fa-bell" aria-hidden="true" />

                {total > 0 && (
                    <span className="notificaciones-counter">
                        {total > 99 ? '99+' : total}
                    </span>
                )}
            </button>

            {open && (
                <section
                    id="notificaciones-requerimientos-panel"
                    className="notificaciones-panel"
                    aria-label="Requerimientos web"
                    aria-busy={loading}
                >
                    <div className="notificaciones-header">
                        <div>
                            <h6>Requerimientos web</h6>
                            {/*
                            <span>
                                {total} {total === 1
                                ? 'por completar'
                                : 'por completar'}
                            </span>
                            */}
                            <span>
                                Lista de requerimientos realizados en la web de holabertha.com
                            </span>
                        </div>

                        <button
                            type="button"
                            className="notificaciones-refresh"
                            onClick={cargarNotificaciones}
                            disabled={loading}
                            aria-label="Actualizar notificaciones"
                            title="Actualizar"
                        >
                            <i
                                className={`fa-solid fa-arrows-rotate${loading ? ' fa-spin' : ''}`}
                                aria-hidden="true"
                            />
                        </button>
                    </div>

                    <div className="notificaciones-list">
                        {error ? (
                            <div
                                className="notificaciones-empty text-danger"
                                role="alert"
                            >
                                {error}
                            </div>
                        ) : loading && notificaciones.length === 0 ? (
                            <div
                                className="notificaciones-empty"
                                role="status"
                            >
                                Cargando…
                            </div>
                        ) : notificaciones.length === 0 ? (
                            <div className="notificaciones-empty">
                                No hay requerimientos web por completar
                                actualizados desde hoy.
                            </div>
                        ) : (
                            notificaciones.map(item => (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    className="notificaciones-card"
                                >
                                    <div className="notificaciones-content">
                                        <strong>{item.empleador}</strong>

                                        <div className="notificaciones-meta">
                                            {item.country && (
                                                <span
                                                    className={`flag-icon flag-icon-${item.country}`}
                                                    aria-hidden="true"
                                                />
                                            )}

                                            <span>{item.pais}</span>
                                            <span aria-hidden="true">·</span>

                                            <time dateTime={item.actualizado}>
                                                {item.tiempo}
                                            </time>
                                        </div>

                                        <span className="notificaciones-status">
                                            POR COMPLETAR
                                        </span>
                                    </div>

                                    <i
                                        className="fa-solid fa-chevron-right notificaciones-arrow"
                                        aria-hidden="true"
                                    />
                                </a>
                            ))
                        )}
                    </div>

                    <div className="notificaciones-footer">
                        Selecciona un pedido para editarlo
                    </div>
                </section>
            )}
        </div>
    );
}

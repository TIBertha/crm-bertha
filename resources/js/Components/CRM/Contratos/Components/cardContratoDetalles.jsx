import React from 'react';

export default function CardContratoDetalles({ data, actual }) {
    return (
        <article
            className={`historial-card${actual ? ' es-actual' : ''}`}
        >
            <header className="historial-card-header">
                <div className="historial-identificador">
                    <a
                    >
                        #{data.id}
                    </a>

                    {actual && (
                        <span className="historial-actual">
                            Actual
                        </span>
                    )}
                </div>

                <span className="historial-fecha">
                    {data.fecha || '—'}
                </span>
            </header>

            <div className="historial-card-body">
                <span className="historial-label">
                    Trabajadora
                </span>

                <a
                    className="historial-trabajador"
                    href={`/postulantes/ficha-postulante/${data.trabajadorid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {data.trabajador || 'Sin nombre'}
                </a>

                {data.trabajadortelefono && (
                    <a
                        className="historial-telefono"
                        href={`tel:${data.trabajadortelefono}`}
                    >
                        <i
                            className="fas fa-phone-alt"
                            aria-hidden="true"
                        />
                        {data.trabajadortelefono}
                    </a>
                )}
            </div>

            <footer className="historial-card-footer">
                <div>
                    <span className="historial-label">
                        Tipo de contrato
                    </span>

                    <span className="historial-tipo">
                        {data.tipocontrato || '—'}
                    </span>
                </div>

                <div className="historial-sueldo">
                    <span className="historial-label">
                        Sueldo
                    </span>

                    <strong>
                        {data.codigo_iso_divisa}{' '}
                        {data.sueldo ?? '—'}
                    </strong>
                </div>
            </footer>
        </article>
    );
}

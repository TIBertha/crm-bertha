import React, { useState } from 'react';
import DomicilioModal from './domicilioModal.jsx';

export default function Domicilio({
  domicilios = [],
  add,
  edit,
  delete: deleteItem,
}) {
    const [dataEdit, setDataEdit] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (data = '') => {
        setDataEdit(data);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <section className="empleadores-domicilios-tab">
            <DomicilioModal
                show={isModalOpen}
                close={closeModal}
                dataEdit={dataEdit}
                add={add}
                edit={edit}
            />

            <div className="domicilios-heading">
                <h3>{"Domicilios registrados" + (domicilios.length > 0 ? ' (' + domicilios.length + ')' : '')}</h3>

                <button
                    type="button"
                    className="domicilios-add"
                    onClick={() => openModal()}
                >
                    <i className="fas fa-plus" aria-hidden="true" />
                    <span>Agregar domicilio</span>
                </button>
            </div>

            <div className="domicilios-list">
                {domicilios.length === 0 ? (
                    <div className="domicilios-empty">
                        <i
                            className="fas fa-map-marker-alt"
                            aria-hidden="true"
                        />
                        <p>No hay domicilios registrados.</p>
                        <span>
                            Agrega el primer domicilio del empleador.
                        </span>
                    </div>
                ) : (
                    domicilios.map((dom, index) => {
                        const ubicacion = [
                            dom.direccion,
                            dom.nombredistrito,
                        ].filter(Boolean).join(', ');

                        const link = dom.linkOpcional
                            || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacion)}`;

                        return (
                            <article
                                key={dom.id ?? index}
                                className="domicilios-card"
                            >
                                <header className="domicilios-card-header">
                                    <h4>
                                        <i
                                            className="fas fa-map-marker-alt"
                                            aria-hidden="true"
                                        />
                                        Dirección {index + 1}
                                    </h4>

                                    <div className="domicilios-actions">
                                        <button
                                            type="button"
                                            className="domicilios-action"
                                            onClick={() => openModal(dom)}
                                            aria-label={`Editar dirección ${index + 1}`}
                                        >
                                            <i
                                                className="fas fa-edit"
                                                aria-hidden="true"
                                            />
                                            <span>Editar</span>
                                        </button>

                                        <a
                                            href={link}
                                            className="domicilios-action"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Ver dirección ${index + 1} en el mapa`}
                                        >
                                            <i
                                                className="fas fa-map-marked-alt"
                                                aria-hidden="true"
                                            />
                                            <span>Ver mapa</span>
                                        </a>

                                        {dom.delete && (
                                            <button
                                                type="button"
                                                className="domicilios-action domicilios-action-delete"
                                                onClick={() =>
                                                    deleteItem(index, dom.id)
                                                }
                                                aria-label={`Eliminar dirección ${index + 1}`}
                                            >
                                                <i
                                                    className="fas fa-trash-alt"
                                                    aria-hidden="true"
                                                />
                                                <span>Eliminar</span>
                                            </button>
                                        )}
                                    </div>
                                </header>

                                <dl className="domicilios-details">

                                    <div className="domicilios-location-row">
                                        <div className="domicilios-field">
                                            <dt>País</dt>

                                            <dd className="domicilios-country">
                                                {dom.paiscode && (
                                                    <span
                                                        className={`flag-icon flag-icon-${dom.paiscode.toLowerCase()}`}
                                                        aria-hidden="true"
                                                    />
                                                )}

                                                <span>{dom.pais || '—'}</span>
                                            </dd>
                                        </div>

                                        <div className="domicilios-field">
                                            <dt>Distrito</dt>
                                            <dd>{dom.nombredistrito || '—'}</dd>
                                        </div>
                                    </div>

                                    <div className="domicilios-field">
                                        <dt>Dirección</dt>
                                        <dd>{dom.direccion || '—'}</dd>
                                    </div>

                                    <div className="domicilios-field">
                                        <dt>Referencia</dt>
                                        <dd>{dom.referencia || '—'}</dd>
                                    </div>
                                </dl>
                            </article>
                        );
                    })
                )}
            </div>
        </section>
    );
}

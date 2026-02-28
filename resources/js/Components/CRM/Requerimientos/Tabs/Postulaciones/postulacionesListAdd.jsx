import React from 'react';
import fotoExample from "../../../../../../../public/img/user_icon.svg";

export default function ({data, addPostulante}) {

    return (
        <li className="list-group-item">
            <div className="media">
                <div className="pull-left me-3 ">
                    <div className="thumb hidden-sm-down mr-20">
                        <img src={data.foto ? data.foto : fotoExample} className="rounded-circle avatar-postulante" alt=""/>
                    </div>
                </div>
                <div className="media-body">
                    <div className="media-heading">
                        <div className="nombre-postulante mr-10">{data.trabajador}</div>
                        <div className="float-right text-muted">
                        </div>
                    </div>
                    <p className="telefono-postulante"><a href={'tel:' + data.telefono}>{data.telefono}</a></p>
                </div>
                <div className="align-self-center">
                    <i className="fas fa-plus icon-action-postulaciones-add" onClick={() => addPostulante(data.id) }></i>
                </div>
            </div>
        </li>
    );
};

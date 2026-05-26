import React from 'react';
import fotoExample from "../../../../../../../public/img/user_icon.svg";

export default function ({data, addPostulante}) {

    return (
        <li className="list-group-item">
            <div className={'row mx-0'}>
                <div className={'col-auto alignselfcenter'}>
                    <img src={data.foto ? data.foto : fotoExample} className="rounded-circle avatar-postulante" alt=""/>
                </div>
                <div className={'col alignselfcenter'}>
                    <div className="media-heading">
                        <div className="nombre-postulante mr-10">{data.trabajador}</div>
                        <div className="telefono-postulante">
                            <a href={'tel:' + data.telefono}>{data.telefono}</a>
                        </div>
                    </div>
                </div>
                <div className={'col-auto alignselfcenter text-center'}>
                    <div >
                        <i className="fas fa-plus icon-action-postulaciones-add" onClick={() => addPostulante(data.id) }></i>
                    </div>
                </div>
            </div>
        </li>
    );
};

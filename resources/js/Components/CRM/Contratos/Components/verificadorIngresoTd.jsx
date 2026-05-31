import React, {useState} from "react";
import {Td} from "react-super-responsive-table";

export default function VerificadorIngresoTd({data, setVerifIngreso}) {
    const [verificadorIngreso, setVerificadorIngreso] = useState(data.verif_ingreso);
    let switchClassName= 'col-12 col-md text-center option-action font-weight-bold px-2';

    function changeEstatusAsistencia(e, condition) {
        setVerificadorIngreso(condition);
        setVerifIngreso(e, data.id, condition);
    }

    return(
        <Td className={'vertical-align-middle align-switch'}>
            <div className={'switch-side-area-purple'}>
                <div className="row mx-0 justify-content-center">
                    <div className={switchClassName + (verificadorIngreso === 1 ? ' checked-green' : '')} onClick={(e) => ( verificadorIngreso === 0 ? changeEstatusAsistencia(e, 1) : null)} >{'SI'}</div>
                    <div className={switchClassName + (verificadorIngreso === 0 ? ' checked-purple' : '')} onClick={(e) => ( verificadorIngreso === 1 ? changeEstatusAsistencia(e, 0) : null)}>{'NO'}</div>
                </div>
            </div>
        </Td>
    )
}

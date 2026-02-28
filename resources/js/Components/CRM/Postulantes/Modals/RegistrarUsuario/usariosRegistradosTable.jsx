import React, {useState} from 'react';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {Td, Tr} from "react-super-responsive-table";
import {ajaxRegistrarUsuarioPostulante} from "../../../../Functions/Usuarios.jsx";

export default function UsariosRegistradosTable({usuarios}) {

    return(
        <>
            {usuarios.map((u, key) => {
                const [viewUsuario, setViewUsuario] = useState(1);
                const [registrado, setRegistrado] = useState(false);
                const [tbMsjText, setTbMsjText] = useState('');
                const [tbMsjColor, setTbMsjColor] = useState('');
                const [tbMsjIcon, setTbMsjIcon] = useState('');

                function registrarUsuario(e, idUsuario) {
                    setViewUsuario(0);
                    ajaxRegistrarUsuarioPostulante(idUsuario).then(r => {
                        if (r.code === 200) {
                            setRegistrado(true);
                            setViewUsuario(2);
                            setTbMsjText('Trabajador Registrado');
                            setTbMsjColor('text-success');
                            setTbMsjIcon('fas fa-check-circle');

                            setTimeout(function () {
                                setViewUsuario(3);
                            }, 1250);
                        } else {
                            setRegistrado(false);
                            setViewUsuario(2);
                            setTbMsjText('Usuario no registrado');
                            setTbMsjColor('text-danger');
                            setTbMsjIcon('fas fa-times-circle');

                            setTimeout(function () {
                                setViewUsuario(2);
                            }, 1250);
                        }
                    }).catch(function (error) {
                        setRegistrado(false);
                        setViewUsuario(2);
                        setTbMsjText('Usuario no registrado');
                        setTbMsjColor('text-danger');
                        setTbMsjIcon('fas fa-times-circle');

                        setTimeout(function () {
                            setViewUsuario(2);
                        }, 1250);
                    })
                }

                return (
                    <Tr className={'table-filas hover-column'}>
                        <Td className={'align-middle'}>
                            <strong>{(u.usuario + ' (ID: ' + u.id + ')')}</strong>
                        </Td>
                        <Td className={'align-middle'}>
                            <>
                                {(u.registrado == true) ?
                                    <span className={'badge bgb-green text-white'}>TRABAJADOR REGISTRADO</span>
                                    :
                                    <>
                                        <>
                                            {(viewUsuario == 0) &&
                                                <div className={'w-100 text-center'}>
                                                    <i className="fas fa-sync fa-spin"></i>
                                                </div>
                                            }
                                        </>
                                        <>
                                            {(viewUsuario == 1) &&
                                                <a className={'btn btn-sm bertha-purple-button'}
                                                   onClick={(e) => registrarUsuario(e, u.id)}>REGISTRAR
                                                </a>
                                            }
                                        </>
                                        <>
                                            {(viewUsuario == 2) &&
                                                <strong className={tbMsjColor}>
                                                    {tbMsjText} <i className={tbMsjIcon + ' mr-2'}></i>
                                                </strong>
                                            }

                                        </>
                                        <>
                                            {(viewUsuario == 3) &&
                                                <span className={'badge bgb-green text-white'}>TRABAJADOR REGISTRADO</span>
                                            }
                                        </>
                                    </>
                                }
                            </>
                        </Td>
                    </Tr>
                )
            })}
        </>
    )

}

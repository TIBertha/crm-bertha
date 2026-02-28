import React, {useState} from 'react';
import { MdCheckCircle, MdError, MdLink } from "react-icons/md";
import 'react-circular-progressbar/dist/styles.css';
import { Container, FileInfo } from "./stylesFileList";
import NewCopyIcon from "../../Components/newCopyIcon.jsx";

export default function fileList({disableAction=false, files, onDelete, onChangeName }) {
    const [textoBotonCopiar, setTextoBtnCopiar] = useState('Copiar');
    const [tempID, setTempID] = useState('');

    function changeTextoBtnCopiar(e, id){

        setTempID(id);
        setTextoBtnCopiar('Copiado');

        setTimeout(function () {
            setTextoBtnCopiar('Copiar');
            setTempID('');
        }, 1500);
    }

    return (
        <Container>
            {files.map(uploadedFile => (
                <li key={uploadedFile.id} className={'fileList'}>
                    <FileInfo>
                        <div>
                            <strong className='edit-inline'>
                                {uploadedFile.name}
                            </strong>

                            {(disableAction === false) &&
                                <span>
                                  {uploadedFile.extension.toUpperCase()}{" - "}{uploadedFile.fecha}{" - "}{uploadedFile.size}{" "}
                                    {!!uploadedFile.url && (
                                        <span className="btn-delete-upload-file" onClick={() => onDelete(uploadedFile.id)}>Borrar</span>
                                    )}
                                </span>
                            }
                        </div>
                    </FileInfo>

                    <div>
                        {!uploadedFile.uploaded &&
                            !uploadedFile.error && (
                                <i className="fas fa-circle-notch fa-spin icon-spin-upload-adjuntos-contrato"></i>
                            )}

                        {uploadedFile.url && (

                            <span>

                                <NewCopyIcon copyText={uploadedFile.url} icon={'fa-solid fa-copy'} tooltipText={'Copiar'} />

                                <a
                                    href={uploadedFile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download="logo"
                                    data-toggle="tooltip" data-placement="top" title="Ver archivo"
                                >
                                    <i className={'fa-solid fa-magnifying-glass me-2'}></i>
                                </a>

                            </span>

                        )}

                        {uploadedFile.uploaded && <MdCheckCircle size={24} color="#00de00" />}
                        {uploadedFile.error && <MdError size={24} color="#e57878" />}

                    </div>
                </li>
            ))}
        </Container>

    );
}

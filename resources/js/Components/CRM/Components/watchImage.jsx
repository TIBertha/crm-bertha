import React, {useState} from "react";
import VerImgModal from "../Components/verImgModal.jsx";
import NewCopyButton from "../Components/newCopyButton.jsx";

export default function WatchImage({file, handleDelete, campo, nombreImg}) {
    const [copyButtonStyle, setCopyButtonStyle] = useState('');

    function changeStyleBtnCopiar(e){
        setCopyButtonStyle(' active');

        setTimeout(function () {
            setCopyButtonStyle('');
        }, 1500);
    }

    return(
        <section className={'input-area active'}>
            <div className={'row mx-0 justify-content-center'}>
                <section className={'col-12 col-md-10 col-lg-8 watch-file text-center'}>
                    <VerImgModal image={file} titleModal={nombreImg} />
                    <div className={'row mx-0 pt-2'}>
                        <div className={'col-12 col-lg-6 py-1 py-lg-0 px-1'}>
                            <NewCopyButton btnColor={'gray'} btnSize={'lg'} btnText={'COPIAR LINK'} successMsj={'LINK COPIADO'} copyText={file} additionalClass={'copy-button btn-block'} />
                        </div>
                        <div className={'col-12 col-lg-6 py-1 py-lg-0 px-1'}>
                            <a className={'btn btn-lg btn-block delete-button'} onClick={(e) => handleDelete(e, campo)}>
                                BORRAR
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    )
}

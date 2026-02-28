import React, {useState} from "react";
import toast, {Toaster} from "react-hot-toast";

export default function CopyCredencial({copyText, colorStyle, successMsj = "Credencial copiada"}) {

    const colorMap = {
        pink: '#ff0080',
        purple: '#47187D',
        white: '#ffffff',
        green: '#22AF47',
        yellow: '#ffc107',
        skblue: '#4dabf7',
        gray: '#848d91',
        orange: '#f57c31'
    };

    const txtColor = colorMap[colorStyle];

    function darken(hex, amount = 20) {
        const num = parseInt(hex.replace('#', ''), 16);

        let r = (num >> 16) - amount;
        let g = ((num >> 8) & 0x00FF) - amount;
        let b = (num & 0x0000FF) - amount;

        r = Math.max(0, r);
        g = Math.max(0, g);
        b = Math.max(0, b);

        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }

    const [textButton, setTextButton] = useState(txtColor);

    let divStyleColor = {
        color: textButton,
    };

    function handleCopy(e) {
        navigator.clipboard.writeText(copyText);

        toast(successMsj, { icon: "✅" });

        // Darken the current button color
        setTextButton(darken(txtColor));

        setTimeout(() => {
            setTextButton(txtColor); // restore original
        }, 1500);
    }

    return(
        <>
            <div className={'finger-action credential-section'} onClick={(e) => handleCopy(e)} style={divStyleColor}>
                <div className={'row mx-0'}>
                    <strong className={'px-0 col-auto'}>{copyText}</strong>
                    <strong className="px-2 col-auto">|</strong>
                    <i className={'px-0 fas fa-copy icon-credential-section align-self-center col-auto'} ></i>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    )
}

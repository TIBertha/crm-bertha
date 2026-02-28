import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function NewCopyButton({
  icon,
  tooltipText = "Copiar",
  btnText,
  btnColor,
  btnSize = 'block',
  copyText,
  additionalClass = '',
  successMsj = "Link copiado",
}) {

    const colorMap = {
        pink: '#ff0080',
        purple: '#47187D',
        white: '#ffffff',
        green: '#22AF47',
        yellow: '#ffc107',
        skblue: '#4dabf7',
        gray: '#848d91'
    };

    const bgColor = colorMap[btnColor];

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


    const [bgButton, setBgButton] = useState(bgColor);

    const buttonBgColor = {
        backgroundColor: bgButton,
    };

    function handleCopy(e) {
        navigator.clipboard.writeText(copyText);

        toast(successMsj, { icon: "✅" });

        // Darken the current button color
        setBgButton(darken(bgColor));

        setTimeout(() => {
            setBgButton(bgColor); // restore original
        }, 1500);
    }


    return (
        <>
            <a
                className={'btn font-weight-bold font text-white btn-' + btnSize + ' bertha-' + btnColor + '-button ' + additionalClass}
                data-toggle="tooltip"
                data-placement="top"
                title={tooltipText}
                onClick={(e) => handleCopy(e)}
                style={buttonBgColor}
            >
                {(icon) &&
                    <i className={icon + ( btnText ? " me-2" : "")}></i>
                }
                {btnText}
            </a>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}

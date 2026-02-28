import React, {Component, useEffect, useState} from 'react';

export default function CopyRequisitosViewPostulantes({copyText, icon = 'fas fa-bars', additonalClass = 'mx-2 icon-question link-tc', tooltipText, colorNeutro = 'unset', colorOnCopy = '#4dabf7', textSize = null}) {
    const [colorIcon, setColorIcon] = useState(colorNeutro);

    let iconStyleColor = {
        color: colorIcon
    };

    if (textSize){
        iconStyleColor = {
            color: colorIcon,
            fontSize: textSize
        };
    }

    function handleCopy(e) {
        navigator.clipboard.writeText(copyText);
        setColorIcon(colorOnCopy);

        setTimeout(function () {
            setColorIcon(colorNeutro);
        }, 1500);
    }

    return(
        <i onClick={(e) => handleCopy(e)} data-toggle="tooltip" data-placement="top" title={tooltipText} className={icon + (additonalClass ? (' ' + additonalClass) : additonalClass)} style={iconStyleColor} ></i>
    )
}

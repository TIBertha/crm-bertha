import React from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

export default function Tooltips({
    estilo = "",
    text = "",
    placement = "top",
    icon = "fas fa-info-circle",
    additionalIconClass
}) {
    const renderTooltip = (tooltipProps) => (
        <Tooltip id="button-tooltip" className={estilo} {...tooltipProps}>
            {text}
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement={placement}
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
        >
            <i className={icon + " icon-action icon-question m-2" + additionalIconClass}></i>
        </OverlayTrigger>
    );
}

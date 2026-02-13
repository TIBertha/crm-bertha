import React from "react";
import Tooltip from "react-bootstrap/tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export default function TooltipPorDias(props) {
    function renderTooltip(props) {
        return (
            <Tooltip id="button-tooltip" className={props.estilo} {...props}>
                {props.text}
            </Tooltip>
        );
    }

    return (
        <OverlayTrigger
            target={"body"}
            placement={props.placement}
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(props)}
        >
            <i className="fas fa-calendar-alt icon-question ml-1"></i>
        </OverlayTrigger>
    );
}

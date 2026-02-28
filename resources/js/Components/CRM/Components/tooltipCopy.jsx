import React from "react";
import toast, { Toaster } from "react-hot-toast";

export default function TooltipCopy({
    estilo,
    icon,
    copyText,
    text,
    textResponsive,
    responsive,
    additionalStyle,
    buttonColor,
    placement,
}) {
    function handleCopy(e) {
        navigator.clipboard.writeText(copyText);
        toast("Link copiado", {
            icon: "✅",
        });
    }

    return (
        <div
            onClick={(e) => handleCopy(e)}
            className={
                "bertha-" +
                buttonColor +
                "-button " +
                additionalStyle +
                " font-weight-bold font btn btn-" +
                (responsive == true ? "lg w-100" : "sm")
            }
            data-toggle="tooltip"
            data-placement={placement}
            title={text}
        >
            <i className={icon + " icon-question"}></i>
            {responsive == true ? (
                <span className={"ms-2"}>{textResponsive}</span>
            ) : (
                ""
            )}
        </div>
    );
}

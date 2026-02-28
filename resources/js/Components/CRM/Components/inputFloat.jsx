import React from "react";
import {NumberFormatBase} from "react-number-format";

export default function InputFloat({
   value,
   onchange,
   tipo = "",
   name = "",
   placeholder = "",
   disable = false,
   negative = false,
   additionalClass = ""
}) {

    const handleChange = (values) => {
        if (onchange) {
            onchange(values, tipo, name);
        }
    };

    return (
        <span>
            <NumberFormatBase
                type="text"
                className={`form-control ${additionalClass}`}
                maxLength={8}
                allowNegative={negative}
                thousandSeparator={true}
                decimalScale={2}
                isNumericString={true}
                fixedDecimalScale={false}
                value={value}
                onValueChange={handleChange}
                placeholder={placeholder}
                disabled={disable}
            />
        </span>
    );
}


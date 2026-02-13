import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import esp from "react-phone-input-2/lang/es.json";

export default function TelefonoInternacional({ numero, paddingLeft = false }) {
    return (
        <PhoneInput
            localization={esp}
            country={"pe"}
            value={numero}
            disableDropdown={true}
            inputClass="custom-phone-code no-box-shadow"
            containerClass={
                (paddingLeft ? "no-padding " : "") +
                "custom-phone-input no-box-shadow"
            }
            enableLongNumbers={true}
        />
    );
}

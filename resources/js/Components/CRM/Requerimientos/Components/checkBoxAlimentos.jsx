import React from "react";

export default function CheckBoxAlimentos({handleChange, m}){

    return(
        <li>
            <input
                key={m.id}
                onChange={(e) => handleChange(e, 'alimentos')}
                type="checkbox"
                checked={m.isChecked}
                value={m.value} />
            <span className={'ms-2'}>{m.value}</span>
        </li>
    )
};

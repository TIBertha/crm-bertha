import React from "react";

export default function CheckBoxModalidad({handleChange, pais, m}){
    let CheckValue = m.value;

    if (parseInt(pais) == 11){
        CheckValue = m.valueCH;
    }else if (parseInt(pais) == 49){
        CheckValue = m.valueMX;
    }
    return(
        <li>
            <input
                key={m.id}
                onChange={(e) => handleChange(e, 'modalidad')}
                type="checkbox"
                checked={m.isChecked}
                value={m.value} />
            <span className={'ms-1'}>{CheckValue}</span>
        </li>
    )
}

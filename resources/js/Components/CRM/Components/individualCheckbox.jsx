import React, {useState} from "react";

export default function IndividualCheckbox({label, inputValue, handleChange, tipo, campo}) {
    const [isChecked, setIsChecked] = useState(inputValue);

    function handleCheckboxChange(e) {
        const newCheckedState = e.target.checked;
        setIsChecked(newCheckedState);
        handleChange(e, tipo, campo, newCheckedState);
    }

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleCheckboxChange(e)}
                />
                <label className="form-check-label ps-2" >{label}</label>

            </label>
        </div>
    );
}

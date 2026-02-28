import React, {Component} from "react";
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function Edades({campo, name, labelEdad, onDelete, onAddition, onDrag}) {

    return (
        <div className={'form-group col-12 col-md-7'}>
            <div className={'row'}>
                <label className="col-12 col-md-3 col-form-label align-self-center">{labelEdad}</label>
                <div className="col-md-9 align-self-center">
                    <ReactTags
                        tags={campo}
                        allowUnique={false}
                        inline
                        delimiters={delimiters}
                        placeholder="Agregar edad..."
                        handleDelete={(e) => onDelete(e, name)}
                        handleAddition={(e) => onAddition(e, name)}
                        handleDrag={(tag, currPos, newPos) => onDrag(tag, currPos, newPos, name)}
                        classNames={{
                            remove: 'reactTag-remove',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

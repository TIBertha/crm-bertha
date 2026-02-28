<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ValidateAdministradores extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'data.nombres'   => ['required'],
            'data.apellidos' => ['required'],
            'data.correo'    => ['nullable'],
            'data.telefono'  => ['required'],
            'data.cargo'     => ['nullable'],
        ];
    }

    public function messages()
    {
        return [
            'data.nombres.required'   => 'El nombre es requerido',
            'data.apellidos.required' => 'El apellido es requerido',

            //'data.correo.email'       => 'Ingrese un correo válido',
            //'data.correo.unique'      => 'El correo ingresado ya se encuentra en uso',

            'data.telefono.required'  => 'El teléfono es requerido',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json($validator->errors()->first(), 422)
        );
    }
}


<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ValidateReclamo extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'data' => $this->input('data', []),
        ]);
    }

    public function rules(): array
    {
        return [
            'data.nombres'           => ['required'],
            'data.apellidos'         => ['required'],
            'data.dni'               => ['required'],
            'data.domicilio'         => ['required'],
            'data.correo'            => ['required'],
            'data.telefono'          => ['required'],
            'data.tipobien'          => ['required'],
            'data.tiporeclamo'       => ['required'],
            'data.fechaincidente'    => ['required'],
            'data.lugarincidente'    => ['required'],
            'data.detalle'           => ['required'],
            'data.pedido'            => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'data.nombres.required'          => 'El nombre es requerido',
            'data.apellidos.required'        => 'El apellido es requerido',
            'data.dni.required'              => 'El DNI es requerido',
            'data.domicilio.required'        => 'El domicilio es requerido',
            'data.correo.required'           => 'El correo es requerido',
            //'correo.email'              => 'Ingrese un correo válido',
            'data.telefono.required'         => 'El teléfono es requerido',
            'data.tipobien.required'         => 'Debe seleccionar un bien',
            'data.tiporeclamo.required'      => 'Debe seleccionar el tipo de reclamo',
            'data.fechaincidente.required'   => 'Debe indicar la fecha del incidente',
            'data.lugarincidente.required'   => 'Debe indicar el lugar del incidente',
            'data.detalle.required'          => 'El detalle del incidente es requerido',
            'data.pedido.required'           => 'El pedido es requerido',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json($validator->errors()->first(), 422)
        );
    }
}

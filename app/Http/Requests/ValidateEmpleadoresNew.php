<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Carbon\Carbon;


class ValidateEmpleadoresNew extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $data = $this->input('data', []);

        $usuarioid = $data['usuarioid'] ?? null;
        $telefono = $data['telefono'] ?? null;
        $correo = $data['correo'] ?? null;
        $pais = $data['paisnacimiento'] ?? null;

        // -----------------------------
        // País de nacimiento
        // -----------------------------
        $lugarnacimiento = 'nullable';
        $departamento = 'nullable';

        if (validateCountry($pais)) {
            $lugarnacimiento = 'nullable';
            $departamento = 'nullable';
        } elseif (!validateCountry($pais) && $pais !== '') {
            $lugarnacimiento = 'nullable';
        }

        // -----------------------------
        // Reglas dinámicas según usuario
        // -----------------------------
        if ($usuarioid) {
            $phone = "required|unique:usuarios,telefono,{$usuarioid},id";
            $mail = "required|email|unique:usuarios,correo,{$usuarioid},id";
            $documento = "required|unique:usuarios,numero_documento,{$usuarioid},id";
        } else {
            $phone = 'required|unique:usuarios,telefono';
            $mail = 'nullable|email|unique:usuarios,correo';
            $documento = 'nullable|unique:usuarios,numero_documento';
        }

        return [
            'data.nombres'                 => 'required',
            'data.apellidos'               => 'required',
            'data.telefono'                => $phone,
            'data.correo'                  => $mail,

            'data.departamentodom'         => 'nullable',
            'data.provinciadom'            => 'nullable',
            'data.distritodom'             => 'nullable',
            'data.direcciondom'            => 'nullable',

            'data.tipodocumento'           => 'nullable',
            'data.documento'               => $documento,

            'data.estadocivil'             => 'nullable',
            'data.fechanacimiento'         => 'nullable',
            'data.paisnacimiento'          => 'nullable',
            'data.departamentonacimiento'  => $departamento,
            'data.lugarnacimiento'         => $lugarnacimiento,
        ];
    }

    public function messages(): array
    {
        return [
            'data.nombres.required'                 => 'El nombre es requerido',
            'data.apellidos.required'               => 'El apellido es requerido',

            'data.correo.required'                  => 'El correo es requerido',
            'data.correo.email'                     => 'Ingrese un correo valido',
            'data.correo.unique'                    => 'El correo ya esta registrado. Intente con otro',

            'data.telefono.required'                => 'El teléfono es requerido',
            'data.telefono.unique'                  => 'El teléfono ya esta registrado. Intente con otro',

            'data.departamentodom.required'         => 'El departamento del domicilio es requerido',
            'data.provinciadom.required'            => 'La provincia del domicilio es requerido',
            'data.distritodom.required'             => 'El distrito del domicilio es requerido',
            'data.direcciondom.required'            => 'La direccion del domicilio es requerida',

            'data.tipodocumento.required'           => 'El tipo de documento es requerido',
            'data.documento.required'               => 'El numero de documento es requerido',
            'data.documento.unique'                 => 'El numero de documento ya esta registrado. Intente con otro',

            'data.estadocivil.required'             => 'El estado civil es requerido',
            'data.fechanacimiento.required'         => 'La fecha de nacimiento es requerida',
            'data.departamentonacimiento.required'  => 'El departamento de nacimiento es requerido',
            'data.paisnacimiento.required'          => 'El pais de nacimiento es requerido',
            'data.lugarnacimiento.required'         => 'El lugar de nacimiento es requerido',

            'data.responsable.required'             => 'El responsable es requerido',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json($validator->errors()->first(), 422)
        );
    }
}


<?php

namespace App\Http\Requests;

use App\Rules\AdjuntoEducacion;
use App\Rules\AdjuntoVerificacionesLaborales;
use App\Rules\Modalidades;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ValidatePostulantesNew extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalizamos y preparamos datos ANTES de validar.
     */
    protected function prepareForValidation(): void
    {
        $data = $this->input('data', []);

        // Normalizar hijos
        if (!empty($data['numhijos']) && $data['numhijos'] > 0) {
            $data['edadhijos_required'] = true;
        }

        // Normalizar país de nacimiento
        if (isset($data['paisprocedencia'])) {
            $data['departamento_required'] = validateCountry($data['paisprocedencia']);
        }

        // Normalizar certificado de antecedentes
        if (!empty($data['certificadoantecedente'])) {
            $data['certificado_required'] = true;
        }

        // Merge final
        $this->merge([
            'data' => $data
        ]);
    }

    public function rules(): array
    {
        $data = $this->input('data', []);

        $usuarioid = $data['usuarioid'] ?? null;

        // Reglas dinámicas de teléfono, correo y documento
        $phoneRule = $usuarioid
            ? "required|unique:usuarios,telefono,{$usuarioid},id"
            : "required|unique:usuarios,telefono";

        $phoneWhatsappRule = $usuarioid
            ? "nullable|unique:usuarios,telefono_whatsapp,{$usuarioid},id"
            : "nullable|unique:usuarios,telefono_whatsapp";

        $documentoRule = $usuarioid
            ? "required|unique:usuarios,numero_documento,{$usuarioid},id"
            : "required|unique:usuarios,numero_documento";

        // Reglas dinámicas de certificado
        $certificadoAntecedente = !empty($data['certificado_required']) ? 'required' : 'nullable';
        $certificadoAntecedentePdf = !empty($data['certificado_required']) ? 'required' : 'nullable';
        $fechaEmisionCertificado = !empty($data['certificado_required']) ? 'required' : 'nullable';

        // Reglas dinámicas de hijos
        $edadHijosRule = !empty($data['edadhijos_required']) ? 'required' : 'nullable';

        // Reglas dinámicas de nacimiento
        $departamentoNacimiento = !empty($data['departamento_required']) ? 'required' : 'nullable';
        $lugarNacimiento = empty($data['departamento_required']) ? 'required' : 'nullable';

        // FORM BÁSICO
        if (!empty($data['formbasico'])) {
            return [
                'data.apellidos'       => 'required',
                'data.nombres'         => 'required',
                'data.telefono'        => $phoneRule,
                'data.telefonowhatsapp'=> $phoneWhatsappRule,
                'data.actividad'       => 'required',
                'data.paisprocedencia' => 'required',
                'data.paispostulando'  => 'required',
                'data.modalidad'       => [new Modalidades()],
            ];
        }

        // FORM COMPLETO
        return [
            'data.apellidos'                 => 'required',
            'data.nombres'                   => 'required',
            'data.telefono'                  => $phoneRule,
            'data.telefonowhatsapp'          => $phoneWhatsappRule,
            'data.tipodocumento'             => 'required',
            'data.numerodocumento'           => $documentoRule,
            'data.fechanacimiento'           => 'required',
            'data.numhijos'                  => 'required',
            'data.edadhijos'                 => $edadHijosRule,
            'data.paisprocedencia'           => 'required',
            'data.paispostulando'            => 'required',
            'data.nacionalidad'              => 'required',
            'data.departamentonacimiento'    => $departamentoNacimiento,
            'data.lugarnacimiento'           => $lugarNacimiento,
            'data.distrito'                  => 'required',
            'data.direccion'                 => 'required',
            'data.actividad'                 => 'required',
            'data.modalidad'                 => [new Modalidades()],
            'data.foto'                      => 'nullable',
            'data.fotodnidelantera'          => 'nullable',
            'data.fotodnitrasera'            => 'nullable',
            'data.pruebacovid'               => 'nullable',
            'data.informecovid'              => 'nullable',
            'data.resultadocovid'            => 'nullable',
            'data.fotorecibo'                => 'nullable',
            'data.adjuntoeducacion'          => [new AdjuntoEducacion()],
            'data.certificadoantecedente'    => $certificadoAntecedente,
            'data.certificadoantecedentepdf' => $certificadoAntecedentePdf,
            'data.fechaemisioncertificado'   => $fechaEmisionCertificado,
            'data.verificaciones'            => [new AdjuntoVerificacionesLaborales('new')],
            'data.niveleducativo'            => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'data.nombres.required' => 'El nombre es requerido',
            'data.apellidos.required' => 'El apellido es requerido',
            'data.telefono.required' => 'El teléfono es requerido',
            'data.telefono.unique' => 'El teléfono ingresado ya se encuentra en uso',
            'data.telefonowhatsapp.unique' => 'El teléfono WhatsApp ingresado ya se encuentra en uso',
            'data.fechanacimiento.required' => 'La fecha de nacimiento es requerida',
            'data.niveleducativo.required' => 'El nivel educativo es requerido',
            'data.tipodocumento.required' => 'El tipo de documento es requerido',
            'data.numerodocumento.required' => 'El número de documento es requerido',
            'data.numerodocumento.unique' => 'El número de documento ingresado ya se encuentra registrado',
            'data.departamentonacimiento.required' => 'El departamento de nacimiento es requerido',
            'data.lugarnacimiento.required' => 'El lugar de nacimiento es requerido',
            'data.distrito.required' => 'El distrito donde vive es requerido',
            'data.direccion.required' => 'La dirección donde vive es requerida',
            'data.paisprocedencia.required' => 'El país de nacimiento es requerido',
            'data.paispostulando.required' => 'El país al que postulará es requerido',
            'data.nacionalidad.required' => 'La nacionalidad es requerida',
            'data.actividad.required' => 'La actividad es requerida',
            'data.numhijos.required' => 'La cantidad de hijos es requerida',
            'data.edadhijos.required' => 'La edad de los hijos es requerida',
            'data.certificadoantecedente.required' => 'El certificado de antecedente es requerido',
            'data.certificadoantecedentepdf.required' => 'El certificado de antecedente en pdf es requerido',
            'data.fechaemisioncertificado.required' => 'La fecha de emisión del certificado de antecedente es requerida',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json($validator->errors()->first(), 422)
        );
    }
}


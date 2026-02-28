<?php

namespace App\Http\Requests;

use App\Models\Views\TrabajadorView;
use App\Rules\AdjuntoEducacion;
use App\Rules\AdjuntoVerificacionesLaborales;
use App\Rules\Modalidades;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ValidatePostulantesEdit extends FormRequest
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
        $traID = $this->input('id');

        // Cargar trabajador
        $trabajador = TrabajadorView::find($traID);

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
            'data' => $data,
            'trabajador' => $trabajador,
        ]);
    }

    public function rules(): array
    {
        $data = $this->input('data', []);
        $trabajador = $this->input('trabajador');

        // Reglas dinámicas de teléfono, documento
        $phoneRule = "required|unique:usuarios,telefono,{$trabajador->usuario_id},id";
        $phoneWhatsappRule = "nullable|unique:usuarios,telefono_whatsapp,{$trabajador->usuario_id},id";
        $documentoRule = "required|unique:usuarios,numero_documento,{$trabajador->usuario_id},id";

        // Reglas dinámicas de hijos
        $edadHijosRule = !empty($data['edadhijos_required']) ? 'required' : 'nullable';

        // Reglas dinámicas de nacimiento
        $departamentoNacimiento = !empty($data['departamento_required']) ? 'required' : 'nullable';
        $lugarNacimiento = empty($data['departamento_required']) ? 'required' : 'nullable';

        // Reglas dinámicas de certificado
        $certificadoAntecedente = !empty($data['certificado_required']) ? 'required' : 'nullable';
        $certificadoAntecedentePdf = !empty($data['certificado_required']) ? 'required' : 'nullable';
        $fechaEmisionCertificado = !empty($data['certificado_required']) ? 'required' : 'nullable';

        return [
            'data.apellidos'                 => 'required',
            'data.nombres'                   => 'required',
            'data.telefono'                  => $phoneRule,
            'data.telefonowhatsapp'          => $phoneWhatsappRule,
            'data.tipodocumento'             => 'required',
            'data.numerodocumento'           => $documentoRule,
            'data.fechanacimiento'           => 'required',
            'data.numhijos'                  => 'nullable',
            'data.edadhijos'                 => $edadHijosRule,
            'data.paisprocedencia'           => 'required',
            'data.nacionalidad'              => 'required',
            'data.departamentonacimiento'    => $departamentoNacimiento,
            'data.lugarnacimiento'           => $lugarNacimiento,
            'data.distrito'                  => 'required',
            'data.direccion'                 => 'required',
            'data.edad'                      => 'required',
            'data.modalidad'                 => [new Modalidades()],
            'data.foto'                      => 'required',
            'data.adjuntoeducacion'          => [new AdjuntoEducacion()],
            'data.certificadoantecedente'    => $certificadoAntecedente,
            'data.certificadoantecedentepdf' => $certificadoAntecedentePdf,
            'data.fechaemisioncertificado'   => $fechaEmisionCertificado,
            'data.verificaciones'            => [new AdjuntoVerificacionesLaborales('edit')],
            'data.niveleducativo'            => 'required',
            'data.tienevacuna'               => 'required',
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
            'data.tipodocumento.required' => 'El tipo de documento es requerido',
            'data.numerodocumento.required' => 'El número de documento es requerido',
            'data.numerodocumento.unique' => 'El número de documento ingresado ya se encuentra registrado',
            'data.fechanacimiento.required' => 'La fecha de nacimiento es requerida',
            'data.niveleducativo.required' => 'El nivel educativo es requerido',
            'data.departamentonacimiento.required' => 'El departamento de nacimiento es requerido',
            'data.lugarnacimiento.required' => 'El lugar de nacimiento es requerido',
            'data.paisprocedencia.required' => 'El país es requerido',
            'data.nacionalidad.required' => 'La nacionalidad es requerida',
            'data.distrito.required' => 'El distrito donde vive es requerido',
            'data.direccion.required' => 'La dirección donde vive es requerida',
            'data.modalidad.required' => 'La modalidad es requerida',
            'data.edadhijos.required' => 'La edad de los hijos es requerida',
            'data.foto.required' => 'El retrato del postulante es requerido',
            'data.certificadoantecedente.required' => 'El certificado de antecedente es requerido',
            'data.certificadoantecedentepdf.required' => 'El certificado de antecedente en pdf es requerido',
            'data.fechaemisioncertificado.required' => 'La fecha de emisión del certificado de antecedente es requerida',
            'data.tienevacuna.required' => 'La respuesta a si tiene vacuna es requerida',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json($validator->errors()->first(), 422)
        );
    }
}


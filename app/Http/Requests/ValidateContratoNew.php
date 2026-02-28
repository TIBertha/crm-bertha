<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Rules\PostulanteContrato;


class ValidateContratoNew extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $data = $this->all();

        $this->merge([
            'empleador_id'   => $data['empleador']['value'] ?? null,
            'tipocontrato'   => $data['tipocontrato'] ?? null,
            'formapago'      => $data['formapago'] ?? null,
            'modalidad'      => $data['modalidad'] ?? null,
            'frecuencia'     => $data['frecuencia'] ?? null,
            'montototal'     => $data['montototalcontrato'] ?? null,
            'pago1_input'    => $data['pago1'] ?? null,
        ]);
    }

    public function rules(): array
    {
        $formapago  = (int) $this->formapago;
        $total      = (float) $this->montototal;
        $pago1      = (float) $this->pago1_input;

        // Defaults
        $pago1Rule          = 'nullable';
        $pago2Rule          = 'nullable';
        $modopago1Rule      = 'nullable';
        $modopago2Rule      = 'nullable';
        $fechapagoRule      = 'nullable';
        $adelantoRule       = 'required';
        $debeRule           = 'required';
        $modopagoAdRule     = 'required';
        $modopagoDebeRule   = 'required';
        $fechaAdRule        = 'required';
        $fechaDebeRule      = 'nullable';

        // Forma de pago 1
        if ($formapago === 1) {
            $pago1Rule      = 'required';
            $modopago1Rule  = 'required';
            $fechapagoRule  = 'required';

            $adelantoRule       = 'nullable';
            $debeRule           = 'nullable';
            $modopagoAdRule     = 'nullable';
            $modopagoDebeRule   = 'nullable';
            $fechaAdRule        = 'nullable';
            $fechaDebeRule      = 'nullable';

            if ($pago1 < $total) {
                $pago2Rule     = 'required';
                $modopago2Rule = 'required';
            }
        }

        // Forma de pago 2
        if ($formapago === 2) {
            $adelantoRule       = 'required';
            $debeRule           = 'required';
            $modopagoAdRule     = 'required';
            $modopagoDebeRule   = 'required';
            $fechaAdRule        = 'required';
            $fechaDebeRule      = 'required';
        }

        return [
            'empleador'             => ['required'],
            'requerimiento'         => ['required'],
            'actividad'             => ['required'],
            'domicilio'             => ['required'],
            'postulante'            => ['required', new PostulanteContrato],
            'tipocontrato'          => ['required'],
            'tipocomision'          => ['required'],
            'garantia'              => ['required'],
            'fechainiciogarantia'   => ['required'],
            'fechafingarantia'      => ['required'],
            'fechainiciolabores'    => ['required'],
            'horainiciolabores'     => ['required'],
            'descuentoejecutivo'    => ['required'],
            'totalpago'             => ['required'],
            'montototalcontrato'    => ['required'],
            'formapago'             => ['required'],

            'pago1'                 => [$pago1Rule],
            'pago2'                 => [$pago2Rule],
            'modopago1'             => [$modopago1Rule],
            'modopago2'             => [$modopago2Rule],
            'fechapago'             => [$fechapagoRule],

            'adelanto'              => [$adelantoRule],
            'debe'                  => [$debeRule],
            'modopagoadelanto'      => [$modopagoAdRule],
            'modopagodebe'          => [$modopagoDebeRule],
            'fechapagoadelanto'     => [$fechaAdRule],
            'fechapagodebe'         => [$fechaDebeRule],
        ];
    }

    public function messages(): array
    {
        return [
            'empleador.required' => 'El empleador es requerido',
            'requerimiento.required' => 'El requerimiento es requerido',
            'actividad.required' => 'La actividad es requerida',
            'domicilio.required' => 'El domicilio es requerido',
            'postulante.required' => 'El postulante es requerido',
            'tipocontrato.required' => 'El tipo de contrato es requerido',
            'tipocomision.required' => 'El tipo de comisión es requerido',
            'garantia.required' => 'La garantía es requerida',
            'fechainiciogarantia.required' => 'La fecha de inicio de la garantía es requerida',
            'fechafingarantia.required' => 'La fecha fin de la garantía es requerida',
            'fechainiciolabores.required' => 'La fecha de inicio de labores es requerida',
            'horainiciolabores.required' => 'La hora de inicio de labores es requerida',
            'descuentoejecutivo.required' => 'El monto a pagar es requerido',
            'totalpago.required' => 'El monto total a pagar es requerido',
            'montototalcontrato.required' => 'El monto total del contrato es requerido',
            'formapago.required' => 'La forma de pago es requerida',
            'pago1.required' => 'El pago 1 es requerido',
            'pago2.required' => 'El pago 2 es requerido',
            'modopago1.required' => 'El modo de pago 1 es requerido',
            'modopago2.required' => 'El modo de pago 2 es requerido',
            'fechapago.required' => 'La fecha de pago es requerida',
            'adelanto.required' => 'El adelanto es requerido',
            'debe.required' => 'El campo debe es requerido',
            'modopagoadelanto.required' => 'El modo de pago adelanto es requerido',
            'modopagodebe.required' => 'El modo de pago debe es requerido',
            'fechapagoadelanto.required' => 'La fecha de pago adelanto es requerida',
            'fechapagodebe.required' => 'La fecha de pago debe es requerida',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json($validator->errors()->first(), 422)
        );
    }
}


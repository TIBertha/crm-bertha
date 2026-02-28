<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ValidateTestimonialEmpleador extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalize incoming data before validation.
     */
    protected function prepareForValidation(): void
    {
        $data = $this->input('data', []);

        $poster = $data['poster'] ?? null;

        $this->merge([
            'fecha'   => $data['fecha'] ?? null,
            'poster'  => $poster,
            'is_url'  => $poster && filter_var($poster, FILTER_VALIDATE_URL),
        ]);
    }

    public function rules(): array
    {
        return [
            'fecha'  => ['required'],

            // Poster rule:
            // - If it's a URL → no need to validate dimensions
            // - If it's base64 → must match required dimensions
        ];
    }

    public function messages(): array
    {
        return [
            'fecha.required'  => 'La fecha de publicación es requerida',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json($validator->errors()->first(), 422)
        );
    }
}


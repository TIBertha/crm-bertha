<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestimonialTrabajador extends Model
{
    protected $table = 'testimoniales_new';

    protected $fillable = ['trabajador_id', 'imagen', 'fecha','usuariointerno_id'];

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CredencialPlataforma extends Model
{
    protected $table = 'credenciales_plataformas';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];
}

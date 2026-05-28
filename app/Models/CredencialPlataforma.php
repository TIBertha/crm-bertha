<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CredencialPlataforma extends Model
{
    protected $table = 'credenciales_plataformas';

    protected $fillable = ['nombre_plataforma', 'usuario', 'contra', 'linkPlataforma', 'creado', 'actualizado', 'nivel_credencial', 'nivelCredencial'];

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];
}

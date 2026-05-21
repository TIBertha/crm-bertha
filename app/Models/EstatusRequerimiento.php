<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstatusRequerimiento extends Model
{
    protected $table = 'estatus_requerimientos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';
}

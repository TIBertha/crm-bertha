<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialToken extends Model
{
    protected $table = 'historial_token';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];
}

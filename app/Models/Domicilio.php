<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Domicilio extends Model
{
    protected $table = 'domicilios';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

}

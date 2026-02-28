<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoVivienda extends Model
{
    protected $table = 'tipos_viviendas';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoPersona extends Model
{
    protected $table = 'tipos_personas';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDescanso extends Model
{
    protected $table = 'tipos_descansos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeOrdenar($query){
        return $query->orderBy('orden', 'asc');
    }
}

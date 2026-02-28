<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstadoCivil extends Model
{
    protected $table = 'estados_civiles';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    //scope para buscar por borrado
    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

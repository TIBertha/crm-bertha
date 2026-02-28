<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NivelEducativo extends Model
{
    protected $table = 'niveles_educativos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    //scope para buscar por borrado
    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FrecuenciaServicio extends Model
{
    protected $table = 'frecuencias_servicios';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

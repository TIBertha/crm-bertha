<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequerimientoPostulacion extends Model
{
    protected $table = 'requerimientos_postulaciones_view';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

<?php

namespace App\Models\Views;

use Illuminate\Database\Eloquent\Model;

class RequerimientoPostulacionView extends Model
{
    protected $table = 'requerimientos_postulaciones_view';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}
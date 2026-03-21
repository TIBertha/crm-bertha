<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequerimientoPostulacion extends Model
{
    protected $table = 'requerimientos_postulaciones';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    protected $dates = ['fecha_postulacion'];

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstatusPostulante extends Model
{
    protected $table = 'estatus_postulantes';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    //scope para buscar por borrado
    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}
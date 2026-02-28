<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoReclamo extends Model
{
    protected $table = 'tipos_reclamos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    //scope para buscar por borrado
    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoContrato extends Model
{
    protected $table = 'tipos_contratos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

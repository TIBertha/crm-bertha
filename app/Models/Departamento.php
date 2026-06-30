<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    protected $table = 'departamentos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    //scope para buscar por borrado
    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function pais()
    {
        return $this->belongsTo(Pais::class, 'pais_id', 'id');
    }

}

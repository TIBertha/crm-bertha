<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Baja extends Model
{
    protected $table = 'bajas';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function tipoBaja()
    {
        return $this->belongsTo(\App\Models\TipoBaja::class, 'tipobaja_id');
    }

    public function bajas()
    {
        return $this->hasMany(TransaccionBaja::class, 'trabajador_id', 'id')
            ->with('usuario');
    }

}

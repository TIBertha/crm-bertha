<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaccionBaja extends Model
{
    protected $table = 'transacciones_bajas';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded =['fecha_pago_monto', 'monto_pagado', 'pagado'];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeCulminado($query, $flag) {
        return $query->where('culminado', $flag);
    }

    public function tipoBaja()
    {
        return $this->belongsTo(\App\Models\TipoBaja::class, 'tipobaja_id', 'id');
    }

    public function baja()
    {
        return $this->belongsTo(\App\Models\Baja::class, 'baja_id', 'id');
    }


    public function usuario()
    {
        return $this->belongsTo(\App\Models\Usuario::class, 'usuario_id', 'id');
    }


}

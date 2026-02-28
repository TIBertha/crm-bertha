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

}

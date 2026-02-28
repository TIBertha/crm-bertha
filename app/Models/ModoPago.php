<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModoPago extends Model
{
    protected $table = 'modos_pagos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeContrato($query, $flag) {
        return $query->where('contrato', $flag);
    }

    public function scopeSuscripcion($query, $flag, $tipo) {

        if($tipo == 'empleadores'){
            return $query->where('reserva', $flag);
        }else if($tipo == 'trabajadores'){
            return $query->where('suscripcion', $flag);
        }else{
            return $query->where('suscripcion', $flag);
        }

    }

    public function scopeReserva($query, $flag) {
        return $query->where('reserva', $flag);
    }

    public function scopeDiasTrabajados($query, $flag) {
        return $query->where('diastrabajados', $flag);
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beneficio extends Model
{
    protected $table = 'beneficios';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $dates = ['fecha', 'fecha_ingreso', 'fecha_cese', 'fecha_pago_monto'];

    protected $guarded = [];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

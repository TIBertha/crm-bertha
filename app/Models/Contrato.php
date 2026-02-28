<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contrato extends Model
{

    protected $table = 'contratos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded =[];

    protected $dates = ['fecha', 'fechainiciolabores'];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

    public function scopeCulminado($query, $flag) {
        return $query->where('culminado', $flag);
    }

}

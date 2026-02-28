<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoBaja extends Model
{
    protected $table = 'tipos_bajas';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function baja(){
        return $this->hasMany('App\Models\Baja');
    }

}

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

    public function tipobaja(){
        return $this->belongsTo('App\Models\TipoBaja');
    }

}

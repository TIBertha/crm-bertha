<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parentesco extends Model
{
    protected $table = 'parentescos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    //scope para buscar por borrado
    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

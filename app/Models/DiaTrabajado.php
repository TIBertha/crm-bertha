<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiaTrabajado extends Model
{
    protected $table = 'dias_trabajados';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded =[];

    //scope para buscar por borrado
    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

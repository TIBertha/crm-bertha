<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    protected $table = 'actividades';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeOrdenar($query){
        return $query->orderBy('orden', 'asc');
    }

    public function scopeGenero($query, $genero){

        if($genero == 1){
            $tipogenero = 'masculino';
        }else{
            $tipogenero = 'femenino';
        }

        return $query->where($tipogenero, true);
    }

}

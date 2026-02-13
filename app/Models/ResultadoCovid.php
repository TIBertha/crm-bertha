<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResultadoCovid extends Model
{

    protected $table = 'resultados_covid';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    public function scopeBorrado($query, $flag)
    {
        return $query->where('borrado', $flag);
    }

}
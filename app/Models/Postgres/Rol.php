<?php

namespace App\Models\Postgres;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $connection = 'pgsql';
    protected $table = 'roles';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

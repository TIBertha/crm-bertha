<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CambioEstatusTrabajador extends Model
{
    protected $table = 'cambios_estatus_trabajadores';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded =[];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}
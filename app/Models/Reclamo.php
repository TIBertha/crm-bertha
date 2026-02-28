<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reclamo extends Model
{

    protected $table = 'reclamos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    protected $dates = ['fecha', 'fecha_incidente', 'actualizado', 'fechaactualizado'];

    /*protected $casts = [
        'atendido' => 'boolean'
    ];*/

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequerimientoLink extends Model
{
    protected $table = 'requerimientos_links';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    protected $dates = ['fecha_requerimiento'];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

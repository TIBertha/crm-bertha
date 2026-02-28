<?php

namespace App\Models\Views;

use Illuminate\Database\Eloquent\Model;

class DiaTrabajadoView extends Model
{
    protected $table = 'dias_trabajados_view';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded =[];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

}

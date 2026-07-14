<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SemiModalidades extends Model
{

    protected $table = 'semi_modalidades';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    public function modalidadesHorarios()
    {
        return $this->hasMany(ModalidadesHorarios::class, 'semimodalidad_id', 'id');
    }
}

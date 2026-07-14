<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModalidadesHorarios extends Model
{

    protected $table = 'modalidades_horarios';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    public function semiModalidades()
    {
        return $this->belongsTo(SemiModalidades::class, 'semimodalidad_id', 'id');
    }
}

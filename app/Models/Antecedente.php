<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Antecedente extends Model
{

    protected $table = 'antecedentes';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    protected $dates = ['fecha'];

    public function scopeBorrado($query, $flag)
    {
        return $query->where('borrado', $flag);
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Prensa extends Model
{
    use HasSlug;

    protected $table = 'blogs';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $fillable = ['titulo', 'num', 'fuente', 'contenido', 'usuariointerno_id', 'imagen', 'imagen_detalle', 'medio_id', 'fecha', 'tags', 'slug'];

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

    public function scopeDestacado($query, $flag) {
        return $query->where('destacado', $flag);
    }

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('titulo')
            ->saveSlugsTo('slug');
    }

}

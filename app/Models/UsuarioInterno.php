<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class UsuarioInterno extends Authenticatable
{
    //use HasRoles;
    use \HighIdeas\UsersOnline\Traits\UsersOnlineTrait;

    protected $table = 'usuarios_internos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    public function showCorreo(){
        return formatTextFirstCharacterToUpper($this->correo);
    }

    public function showNombre(){
        //dd($this->nombres);
        return getNombreCorto(formatWordFirstCharacterToUpper($this->nombres), formatWordFirstCharacterToUpper($this->apellidos));
    }

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

    public function scopeOficina($query) {
        return $query->whereIn('rol_id', [4]);
    }

    public function hasRol(array $roles){

        $rol = Rol::find($this->rol_id)->name;

        if($roles){

            foreach ($roles as $r){

                if(strtolower($r) == strtolower($rol)){
                    return true;
                }
            }
        }

        return false;

    }

    public function isChangePassword(){
        return $this->change_password;
    }

    public function showAvatar(){

        $foto = asset('img/user_icon.svg');
        $avatar = $this->foto;

        if($avatar != ''){
            $foto = $avatar;
        }

        return $foto;
    }
}

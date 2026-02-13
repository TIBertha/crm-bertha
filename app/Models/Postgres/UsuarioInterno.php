<?php

namespace App\Models\Postgres;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;

class UsuarioInterno extends Authenticatable
{
    use HasRoles;

    protected $connection = 'pgsql';
    protected $table = 'usuarios_internos';

    const CREATED_AT = 'creado';
    const UPDATED_AT = 'actualizado';

    protected $guarded = [];

    public function showCorreo(){

        return formatTextFirstCharacterToUpper($this->correo);
    }

    public function scopeBorrado($query, $flag) {
        return $query->where('borrado', $flag);
    }

    public function scopeActivo($query, $flag) {
        return $query->where('activo', $flag);
    }

    public function hasRol(array $roles){

        $rol = Rol::find($this->rol_id)->name;

        if($roles){

            foreach ($roles as $r){

                if(strtoupper($r) == $rol){
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

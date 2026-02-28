<?php

namespace App\Http\Controllers;

use App\Http\Requests\ValidateLogin;
use App\Models\UsuarioInterno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }

    public function index(){
        return view('Login.login');
    }

    public function ajaxPostLogin(ValidateLogin $request)
    {
        $telefono = $request->input('telefono');
        $password = $request->input('password');

        $credenciales = [
            'telefono'   => strtoupper($telefono),
            'password'   => $password,
        ];

        $user = UsuarioInterno::where('telefono', $credenciales['telefono'])->first();

        if($user){

            if($user->activo == true){

                if(Hash::check($credenciales['password'], $user->password)){

                    $exito = Auth::login($user);

                    // THIS is the missing piece
                    $request->session()->regenerate();


                    return response()->json(['code' => 200, 'msj' => 'exito', 'rol' => $user->rol_id ]);

                }else{

                    return response()->json(['code' => 600, 'msj' => 'Correo y/o Contraseña incorrectos' ]);

                }

            }else{
                return response()->json(['code' => 600, 'msj' => 'Usuario inactivo' ]);
            }

        }else{

            return response()->json(['code' => 600, 'msj' => 'Usuario no registrado' ]);
        }

    }

    public function logout(Request $request){

        $this->auth->logout();

        return redirect()->route('login');
    }
}

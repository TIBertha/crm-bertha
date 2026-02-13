<?php

return [

    //Url de la web bertha
    'url-web' => env('URL_WEB', 'https://holabertha.com'),

    //valor de antecedentes
    'price-antecedente' => 20,

    //Direccion Empresa
    'direccion-empresa' => 'Av. La Molina 1167. Centro Comercial La Rotonda 1. Oficina 124. La Molina.',

    //Numero Contactos Empresa
    'numeros-empresa' => '999 256 807',

    //Numero Empresa
    'telefono' => '999 256 807',

    //Sitio Web Empresa
    'web-empresa' => 'www.holabertha.com',

    //titulo que aparece en la pestaña
    'title' => 'CRM Bertha Experta en Casa',

    //texto que aparece en el footer
    'footer' => '©'. date('Y') .' Bertha todos los derechos reservados.',

    //texto que aparece en el footer de los correos
    'footer-mail' => '©'. date('Y') .' Bertha todos los derechos reservados.',

    //texto que muestra el numero de la version  del aplicativo
    'version' => 'Version: 1.0.0',

    //Direccion de correo a la que se le envia la solicitud por horas y de los planes temporalmente
    'mail-gerencia' => env('MAIL_GERENCIA', ['GERENCIA@BERTHA.PE', 'gerencia@bertha.pe']),

    'mail-soporte' => env('MAIL_SOPORTE', ['SOPORTE@BERTHA.PE', 'GERENCIA@BERTHA.PE']),

    'mail-desarrollo' => env('MAIL_DESARROLLO', ['FELIPE.PACHERRES@GMAIL.COM']),

    //Habilitar envio de mail
    'send-mail-produccion' => env('SEND_MAIL_PRODUCCION', false),

];

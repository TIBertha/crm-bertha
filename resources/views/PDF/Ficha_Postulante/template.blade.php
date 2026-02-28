<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="theme-color" content="#47187d">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Favicon -->
    <link rel="icon" href="{{ asset('img/favicon.ico') }}" type="image/x-icon">

    <!-- Custom CSS -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    @viteReactRefresh
    @vite(['resources/scss/app.scss', 'resources/js/app.jsx'])

    <title>{{ $ficha['title'] }}</title>
</head>
<body>

@include('PDF.Ficha_Postulante.ficha')

@include('PDF.Ficha_Postulante.documento1')

@include('PDF.Ficha_Postulante.carta-permiso')

@if($ficha['ca'] OR $ficha['cf'] OR $ficha['ph'])
    @include('PDF.CompromisoPostulante.compromiso')
@endif

@include('PDF.Ficha_Postulante.declaracion')

@include('PDF.Ficha_Postulante.declaracion-jurada-salud-fisica-mental')

<script type="text/javascript">
    //window.print();
</script>

</body>
</html>

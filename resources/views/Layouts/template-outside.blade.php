<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Bertha || Login</title>
    <meta name="description" content="webexperta" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="api-base-url" content="{{ url('/') }}" />

    <!-- Favicon -->
    <link rel="icon" href="{{ asset('img/favicon.ico') }}" type="image/x-icon">

   <!-- Prueba  -->

    <!-- Custom CSS -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    

    <!-- Vite React -->
    @viteReactRefresh
    @vite(['resources/scss/app.scss', 'resources/js/app.jsx'])


</head>

<body class="bertha-bg-login">

<!-- HK Wrapper -->
<section class="container">

    <!-- Main Content -->
    <div>
        @yield('content')
    </div>
    <!-- /Main Content -->

    <!-- Footer -->
    <div class="container d-none d-md-block d-lg-block">
        <footer class="footer">
            <div class="row">
                <div class="col-md-12 col-sm-12 text-center">
                    <p class="text-white">{{ config('webexperta.footer') }}</p>
                </div>
            </div>
        </footer>
    </div>
    <!-- /Footer -->

</section>
<!-- /HK Wrapper -->

@yield('javascript')

</body>

</html>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>CRM Bertha</title>

    <!-- Favicon -->
    <link rel="icon" href="{{ asset('img/favicon.ico') }}" type="image/x-icon">

    <!-- Prueba  -->

    <!-- Custom CSS -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">


    <!-- Vite React -->
    @viteReactRefresh
    @vite(['resources/scss/app.scss', 'resources/js/app.jsx'])


</head>

<body class="">

    <!-- HK Wrapper -->
    <section>

        <!-- Navbar -->
        <div id="navbar" data-url="{{ url('/') }}" data-path="{{ request()->path() }}"
            data-profilename="{{ Auth::user()->showNombre() }}" data-profilepic="{{ Auth::user()->showAvatar() }}">
        </div>
        <!-- Navbar -->

        <!-- Main Content -->
        <div id="mc" class="main-content">
            @yield('breadcrumb')
            <!-- Container -->
            <div class="display-area">
                @yield('content')
                <!-- /Container -->
            </div>

            <!-- Footer -->
            @include('Layouts.footer')
            <!-- /Footer -->
        </div>
        <!-- /Main Content -->



    </section>
    <!-- /HK Wrapper -->

    @yield('javascript')

</body>

</html>

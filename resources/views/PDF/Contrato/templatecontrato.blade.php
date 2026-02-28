<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==" crossorigin="anonymous" />

    <link rel="stylesheet" href="{{ asset('css/bootstrap.css') }}">
    <link rel="stylesheet" href="{{ asset('css/vendor.css') }}">
    <link rel="stylesheet" href="{{ asset('css/pagina.css') }}">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/all.min.js"></script>

    <title>{{ $contrato['title'] }}</title>
</head>
<body>

    @include('PDF.Contrato.hoja1')

    @if($contrato['paispedido'] == 54)
        <div class="page">
            <div class="subpage-none contrato2">

                <section class="seccion1 tidal mb-5" >
                    <div class="row mb-2 mt-2">
                        <div class="col-4">
                            <img class="logo-experta" src="{{ asset('img/logo.png') }}" alt="LogoBerthaExpertaEnCasa">
                        </div>
                        <div class="col-8"></div>
                    </div>
                </section>

                @include('PDF.Templates.Condiciones.TiempoCompleto.terminos-new-17-11-21-pagina1')

            </div>

        </div>

        <div class="book"></div>

        <div class="page">
            <div class="subpage-none contrato2">
                @include('PDF.Templates.Condiciones.TiempoCompleto.terminos-new-17-11-21-pagina2')
            </div>
        </div>
    @elseif($contrato['paispedido'] == 11)
        <div class="page">
            <div class="subpage-none contrato2">

                <section class="seccion1 tidal mb-5" >
                    <div class="row mb-2 mt-2">
                        <div class="col-4">
                            <img class="logo-experta" src="{{ asset('img/logo.png') }}" alt="LogoBerthaExpertaEnCasa">
                        </div>
                        <div class="col-8"></div>
                    </div>
                </section>

                @include('PDF.Templates.Condiciones.TiempoCompleto.terminos-chile-pagina1')

            </div>

        </div>

        <div class="book"></div>

        <div class="page">
            <div class="subpage-none contrato2">
                @include('PDF.Templates.Condiciones.TiempoCompleto.terminos-chile-pagina2')
            </div>
        </div>
    @endif
    @if(isset($ficha))

        <div class="book"></div>
        @include('PDF.Ficha_Postulante.template')

    @endif

    @if($contrato['paispedido'] != 54 && $recibo['total'] > 0)
        @include('PDF.Contrato.recibo-pago')
    @endif

    <script type="text/javascript">
        //window.print();
    </script>

</body>
</html>

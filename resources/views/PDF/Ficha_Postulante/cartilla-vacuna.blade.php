@if($ficha['adjuntoCartillaVacuna'])
    @foreach(json_decode($ficha['adjuntoCartillaVacuna'], true) as $f)
        <div class="book"></div>

        <div class="page">
            <div class="subpage-none">

                <section class="container seccion1 tidal mb-5" >
                    <div class="row mb-2 mt-2">
                        <div class="col-4">
                            <span class="logo-experta"></span>
                        </div>
                    </div>
                </section>

                <section class="container titulo text-center mt-4 mb-5">
                    <h3 class="font-weight-bold">Cartilla de Vacunación</h3>
                </section>

                <section class="container text-center" style=" padding-top: 5rem;">
                    <img src="{{$f }}" class="img-adjunto adjunto-cartilla-vacunacion ">
                </section>

            </div>
        </div>
    @endforeach
@endif

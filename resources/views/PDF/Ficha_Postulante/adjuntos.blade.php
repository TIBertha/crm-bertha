@if($ficha['recomendaciones'])
    @foreach($ficha['recomendaciones'] as $d)

        <div class="book"></div>

        <div class="page">
            <div class="subpage-none">
                <section class="container">

                    <div class="container seccion1 tidal mb-5" >
                        <div class="row mb-2 mt-2">
                            <div class="col-4">
                                <span class="logo-experta"></span>
                            </div>
                        </div>
                    </div>

                    <div class="container titulo text-center mt-4 mb-5">
                        <h3 class="font-weight-bold">Recomendación</h3>
                    </div>

                    <img src="{{$d}}" class="img-adjunto adjunto {{ $ficha['restringida'] ? 'difuminado' : '' }}">
                </section>
            </div>
        </div>

    @endforeach
@endif

@if($ficha['ajunto_covid'])

    @foreach(json_decode($ficha['ajunto_covid'], true) as $d)

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
                    <h3 class="font-weight-bold">Prueba de Covid-19</h3>
                </section>

                <section class="container">
                    <span style="color: #FFFFFF">.</span>
                    <img src="{{$d }}" class="img-adjunto adjunto {{ $ficha['restringida'] ? 'difuminado' : '' }}">
                </section>
            </div>
        </div>

        <div class="book"></div>

    @endforeach

@endif

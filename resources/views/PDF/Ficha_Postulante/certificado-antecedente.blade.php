@if($ficha['certificado_antecedente'])

    @foreach(json_decode($ficha['certificado_antecedente'], true) as $d)

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
                    <h3 class="font-weight-bold">Certificado de Antecedentes</h3>
                </section>

                <section class="container">
                    <img src="{{$d }}" class="img-adjunto adjunto {{ $ficha['restringida'] ? 'difuminado' : '' }}">
                </section>
            </div>
        </div>

    @endforeach
@endif

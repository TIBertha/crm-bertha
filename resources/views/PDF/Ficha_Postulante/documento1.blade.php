@if($ficha['foto_documento_delantera'])

    <div class="book"></div>

    @if($ficha['foto_documento_posterior'])

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
                    <h3 class="font-weight-bold">Documento de Identidad</h3>
                </section>

                <section class="container foto-dni">
                    <img class="w-50 {{ $ficha['restringida'] ? 'difuminado' : '' }}" src="{{$ficha['foto_documento_delantera']}}" class="img-adjunto">
                </section>
                <section class="container foto-dni">
                    <img class="w-50 {{ $ficha['restringida'] ? 'difuminado' : '' }}" src="{{$ficha['foto_documento_posterior']}}" class="img-adjunto">
                </section>
            </div>
        </div>

    @else

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
                    <h3 class="font-weight-bold">Documento de Identidad</h3>
                </section>

                <section class="container foto-dni2">
                    <img class="w-100 {{ $ficha['restringida'] ? 'difuminado' : '' }}" src="{{$ficha['foto_documento_delantera']}}" class="img-adjunto">
                </section>
            </div>
        </div>

    @endif

@endif

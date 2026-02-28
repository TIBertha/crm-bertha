@if($ficha['edadpostulante'] < 18 && $ficha['firma_apoderado'])

    <div class="book"></div>

    <div class="page">
        <div class="subpage-none">
            <section class="seccion1 tidal mb-5" >
                <div class="row mb-2 mt-2">
                    <div class="col-4">
                        <img class="logo-experta" src="{{ asset('img/logo.png') }}" alt="LogoBerthaExpertaEnCasa">
                    </div>
                </div>
            </section>

            <section class="text-center mt-4 mb-5" style="padding-top: 5rem;">
                <h2 class="font-weight-bold">PERMISO LABORAL PARA MENOR DE EDAD</h2>
            </section>

            <section class="mb-2">

                <div class="spacing-text">
                    <h4>Yo, <b>{{$ficha['nombre_apoderado']}}</b>, bajo la <b>Ley que promueve el
                        acceso de jóvenes al mercado laboral N° 30288</b>, doy mi
                        consentimiento para que <b>{{$ficha['nombres']}}</b> postule
                        a un puesto de trabajo.</h4>
                </div>

            </section>

            <section class="firma" style="padding-top: 20rem;">
                    <div class="row d-flex justify-content-center">
                        <div class="col-6  font1 text-center">
                            <span style="color: #FFFFFF">.</span>
                            <img class="w-100 mx-auto {{ $ficha['restringida'] ? 'difuminado' : '' }}" src="{{$ficha['firma_apoderado']}}">
                            <hr class="mb-0">
                            <h3><b>Apoderado</b></h3>
                        </div>
                    </div>
                    <div class="datos-postulante font1">
                    <p>Nombre:  {{$ficha['nombre_apoderado']}}</p>
                    <p>N° Documento: {{$ficha['documento_apoderado']}}</p>
                    </div>
            </section>
        </div>
    </div>

@endif

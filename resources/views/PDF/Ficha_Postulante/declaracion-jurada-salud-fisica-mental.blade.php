<div class="book"></div>

<div class="page">
    <div class="subpage-none">

        <section class=" seccion1 tidal mb-5">
            <div class="row mb-2 mt-2">
                <div class="col-4">
                    <img class="logo-experta" src="{{ asset('img/logo.png') }}" alt="LogoBerthaExpertaEnCasa">
                </div>
            </div>
        </section>

        <section class=" titulo mt-4 mb-5">
            <h3>Declaración Jurada de Gozar Buena Salud Física y Mental y Vacuna COVID</h3>
            <h4>(Ley de Procedimiento Administrativo General <strong>N° 27444</strong>)</h4>
        </section>

        <section class=" font1" style="padding-top: 5.5rem;">
            <p><strong>Yo: {{ $ficha['nombres'] }}</strong></p>
            <p class="mt-10">De nacionalidad <strong
                    class="text-uppercase">{{ $ficha['nacionalidaddeclaracion'] }}</strong> con
                <strong>{{ $ficha['tipodocumento'] }}: {{ $ficha['numerodocumento'] }}</strong>
                y domiciliada(o) en <strong class="text-uppercase">{{ $ficha['domiciliodeclaracion'] }}</strong>, en
                pleno uso de mis facultades físicas y mentales, <strong>DECLARO BAJO JURAMENTO</strong>,
                que gozo de buena salud física y mental para realizar las labores domésticas encomendadas. Y
                <strong>DECLARO BAJO JURAMENTO</strong>, que cuento con <strong>{{ $ficha['tienevacunas'] }}</strong>
                vacuna(s) COVID.</p>
            <p class="mt-3">Formulo la presente declaración en virtud del Principio de Presunción de Veracidad
                contemplado en el numeral 1.7 del artículo IV y artículo 42°de la Ley N° 27444 – Ley del Procedimiento
                Administrativo General, sujetándome a las acciones legales y/o penales que correspondan de acuerdo a la
                legislación nacional vigente, en caso de verificarse su falsedad; como, asimismo,
                aceptaré la procedencia de la nulidad del contrato.
            </p>
            <p class="mt-3">Para mayor constancia y validez, firmo al pie del presente documento para fines legales
                correspondientes.
            </p>
        </section>

        <section class=" firma" style="margin-top: 3rem!important;">
            <div class="row d-flex justify-content-center">
                <div class="col-9 font1 text-center pt-5">
                    <h3 class="font-weight-bold pt-5"><u>ACEPTADO Y DECLARADO ELECTRÓNICAMENTE CON ID
                            {{ $ficha['id'] }}</u></h3>
                </div>
            </div>
            <div class="datos-postulante font1">
                <p>Nombre: {{ $ficha['nombres'] }}</p>
                <p>DNI: {{ $ficha['numerodocumento'] }}</p>
            </div>
        </section>
    </div>
</div>

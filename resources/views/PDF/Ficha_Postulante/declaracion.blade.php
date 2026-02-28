@if ($ficha['direccion'])
    <div class="book"></div>

    <div class="page">
        <div class="subpage-none">

            <section class="seccion1 tidal mb-5">
                <div class="row mb-2 mt-2">
                    <div class="col-4">
                        <img class="logo-experta" src="{{ asset('img/logo.png') }}" alt="LogoBerthaExpertaEnCasa">
                    </div>
                </div>
            </section>

            <section class="titulo mt-4 mb-5">
                <h3>Declaración Jurada de Domicilio</h3>
                <h4>(Ley de Simplificación de la Certificación Domiciliaria)</h4>
                <h4><strong>Ley N° 28882</strong></h4>
            </section>

            <section class="font1">
                <p><strong>Yo: {{ $ficha['nombres'] }}</strong></p>
                <p>De nacionalidad <strong class="text-uppercase">{{ $ficha['nacionalidaddeclaracion'] }}</strong> con
                    <strong>{{ $ficha['tipodocumento'] }}: {{ $ficha['numerodocumento'] }}</strong>. En pleno ejercicio
                    de mis derechos constitucionales
                    y de conformidad con lo dispuesto en la Ley Nº 28882 de simplificación de la Certificación
                    Domiciliaria,
                    en su articulo 1º.
                </p>
                <p><strong>DECLARO BAJO JURAMENTO</strong>: que mi domicilio actual se encuentra ubicado en:</p>
                <p><strong class="text-uppercase">{{ $ficha['domiciliodeclaracion'] }}</strong></p>
                <p>Que la dirección que señalo líneas arriba, es mi domicilio actual y verdadero donde tengo vivencia
                    real,
                    física y permanente en caso de comprobarseme falsedad declaro haber incurrido en el delito contra la
                    Fe Pública, falsificación de documentos, (Art. 427º del código penal, en concordancia con el
                    Artículo IV
                    inciso 1.7) principio de presunción de veracidad del Titulo Preliminar de la Ley de procedimiento
                    Administrativo General, Ley Nº 274444.</p>
                <p>Formulo la siguiente declaración Jurada para los fines legales de:</p>
                <br>
                <p><strong>CERTIFICADO DOMICILIARIO SIMPLIFICADO MOTIVO: TRABAJO</strong></p>
                <p>Para mayor constancia y validez en el cumplimiento firmo al pie del presente documento para fines
                    legales correspondientes.</p>
            </section>

            <section class="firma">
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

            <section class="aviso">
                <p><strong>AVISO IMPORTANTE</strong></p>
                <ul>
                    <li>NO PROCEDE SI SE ENCUENTRA DETERIORADO, MANCHADO O BORRONEADO.</li>
                    <li>CARECE DE VALIDEZ SIN SU RESPECTIVA PRESENTACIÓN DE SU COPIA DE {{ $ficha['tipodocumento'] }}.
                    </li>
                    <li>EL FUNCIONARIO PÚBLICO QUE NO CUMPLA CON LA OBLIGACIÓN DE RECIBIR LA D.J.D. INCURRIRÁ EN
                        INFRACCIÓN ADMINISTRATIVA.</li>
                    <li>EXCEPCIONALMENTE PARA FINES JUDICIALES O ELECTORALES SE CUMPLIRÁ EN LAS MUNICIPALIDADES,
                        NOTARIOS PÚBLICOS Y FISCALÍAS. LEY 27839.</li>
                </ul>
            </section>
        </div>
    </div>
@endif

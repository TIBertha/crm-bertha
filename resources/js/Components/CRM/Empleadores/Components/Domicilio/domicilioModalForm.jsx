import React, {useCallback, useRef, useState} from "react";
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api";
import AsyncSelect from "react-select/async";
import Global from '../../../../Helpers/constantes.js';
import usePlacesAutocomplete, {getGeocode, getLatLng, getZipCode} from "use-places-autocomplete";
import {generateUniqueNum} from "../../../../Helpers/helpers.js";
import {showAlert} from "../../../../Helpers/alerts.js";
import {forceInputUppercase} from "../../../../Helpers/strings.js";

const libraries = ["places"];

const mapContainerStyle = {height: "290px", border: "solid 2px #ccc"};

const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

const generateInitialData = () => {
    return { id: generateUniqueNum(), distrito: '', nombredistrito: '', direccion: '', latitud: '', longitud: '', referencia: '', linkOpcional: '' , activo: 1, new: true, delete: true };
};

const processingDataLocation = async (data, type = 'address') => {

    try {

        let distrito = '';
        let results = '';

        if(type == 'address'){
            results = await getGeocode( {address: data} );
        }else if(type == 'location'){
            results = await getGeocode( {location: data} );
        }

        const { lat, lng } = await getLatLng(results[0]);

        if(type == 'address'){
            return {direccion: data.toUpperCase(), latitud: lat, longitud: lng};
        }else if(type == 'location'){
            return {direccion: results[0]['formatted_address'].toUpperCase(), latitud: data.lat, longitud: data.lng};
        }

    } catch (error) {
        console.log("Error: ", error);
    }
};

const loadDistritoOptions = (search, callback) =>{

    if (!search) {
        callback([]);
    } else {

        setTimeout(() => {

            axios.post('/ajax-search-distrito', {search})
                .then(res => {

                    let r = res.data;

                    callback(r.data);

                }).catch((error) => {
                console.log(error);
            });

        });
    }
}

const getNameDistrito = (e) => {

    if(e){

        let distrito = e.label;
        let resultado = distrito.split(" - ");

        return resultado[0];

    }

    return '';
}

export default function DomicilioModalForm({dataEdit, add, edit, close}) {

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: Global.GOOGLE_MAP_API,
        libraries,
    });

    const mapRef = useRef();

    const [domicilio, setDomicilio] = useState(dataEdit ? dataEdit : generateInitialData());

    const [marker, setMarker] = useState('');

    const setValues = (target) => {
        setDomicilio({...domicilio, ...target});
    };

    const validarForm = () => {

        if(!domicilio.direccion){
            showAlert('error', 'Debe agregar una dirección');
            return false;
        }
        if(!domicilio.distrito){
            showAlert('error', 'La dirección indicada no tiene un distrito asociado. Coloque una direccion más específica');
            return false;
        }

        return true;

    };

    const onSubmit = () => {

        if( validarForm() ){

            if(dataEdit){
                edit(domicilio);
            }else{
                add(domicilio);
            }
            close();
        }

    };

    const onMapLoad = (map) => {
        mapRef.current = map;
        currentPosition();
    };

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(16);
        setMarker({ lat: lat, lng: lng });
    }, []);

    const currentPosition = useCallback( ()  => {

        navigator.geolocation.getCurrentPosition(
            async (position) => {

                if(dataEdit){

                    if(dataEdit.latitud && dataEdit.longitud){
                        panTo({lat: parseFloat(dataEdit.latitud), lng: parseFloat(dataEdit.longitud)});

                    }else{

                        let direccionCompleta = dataEdit.direccion + ', ' + dataEdit.nombredistrito;

                        let results = await getGeocode( {address: direccionCompleta} );

                        const { lat, lng } = await getLatLng(results[0]);

                        if(lat && lng){
                            setValues({latitud: lat, longitud: lng});
                            panTo({lat: lat, lng: lng});
                        }else{
                            panTo({lat: position.coords.latitude, lng: position.coords.longitude});
                        }

                    }

                }else{
                    panTo({lat: position.coords.latitude, lng: position.coords.longitude});

                }

            },
            () => null
        );

    }, []);

    if (loadError) return (
        <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-circle"></i> Ocurrio un problema al cargar el mapa. Consulte al administrador.
        </div>
    );

    if (!isLoaded) return (
        <div className="text-center loading-map">
            <i className="fas fa-spinner fa-pulse"></i>
        </div>
    );

    return (

        <div>

            <div className="form-group">
                <label className="col-form-label col-form-label-sm">Distrito</label>

                <AsyncSelect
                    loadOptions={loadDistritoOptions}
                    isClearable
                    noOptionsMessage={() => null}
                    defaultOptions={false}
                    onChange={(e) => setValues({distrito: e, nombredistrito: getNameDistrito(e)}) }
                    value={domicilio.distrito}
                    placeholder={'Seleccione'}
                    theme={theme => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary: 'black',
                        },
                    })}
                />

            </div>

            <Search panTo={panTo} domicilio={domicilio} setValues={setValues} />

            <div className="form-group">
                <label className="col-form-label col-form-label-sm">{'Referencias '}<span>{'(' + (domicilio.referencia ? domicilio.referencia.length : 0) + ' de ' + 70 + ')'}</span></label>
                <textarea name="referencia" value={domicilio.referencia} onChange={(e) => {setValues({referencia: e.target.value.toUpperCase()}); forceInputUppercase(e);  } } className="form-control form-control-sm" placeholder="Nº de Departamento, Altura de la cuadra, Lote, Manzana u otros" rows="2" maxLength={70}></textarea>
            </div>

            <div className="form-group">
                <label className="col-form-label col-form-label-sm">Link (Opcional) <a className="purple-bertha-div" href="https://www.google.com.pe/maps?hl=es" target="_blank">Buscar en Google Maps <i className="fas fa-search ml-1"></i></a></label>
                <input type="text" className="form-control form-control-sm" id="linkOpcional" name="nombres" value={domicilio.linkOpcional} onChange={(e) => {setValues({linkOpcional: e.target.value});  } } placeholder="Link opcional"/>
            </div>

            <GoogleMap
                id="mapDomicilio"
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                options={options}
                onLoad={onMapLoad}
            >
                {marker &&

                    <Marker
                        position={{ lat: marker.lat, lng: marker.lng }}
                        draggable={true}
                        onDragEnd={(e) => {
                            let lati = e.latLng.lat();
                            let lng = e.latLng.lng();
                            let result = processingDataLocation({ lat: lati, lng: lng }, 'location');
                            result.then(
                                result => {
                                    setMarker({ lat: lati, lng: lng });
                                    setValues({direccion: result.direccion.toUpperCase(), latitud: result.latitud, longitud: result.longitud, distrito: result.distrito});
                                }
                            );
                        }
                        }
                    />
                }
            </GoogleMap>

            <hr/>

            <div className="form-group mt-4">
                <button id="btn-buscar" className="btn bertha-purple-button btn-block btn-reset" type="button" onClick={() => onSubmit()}>{dataEdit ? 'Guardar' : 'Agregar'}</button>
            </div>

        </div>

    );
}

const Search = ({ panTo, domicilio, setValues}) => {

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: {
                country: ['PE','CL', 'MX']
            }
        },
    });

    return (

        <div>

            <div className="form-group">
                <label className="col-form-label col-form-label-sm">Dirección</label>
                <AsyncSelect
                    cacheOptions
                    loadOptions={async (inputValue) => {
                        setValue(inputValue);
                        if (status === "OK") {
                            return data.map(({ place_id, description }) => ({
                                value: description,
                                label: description,
                            }));
                        }
                        return [];
                    }}
                    defaultOptions={false}
                    isClearable
                    autoFocus
                    onInputChange={async (inputValue) => {
                        setValue(inputValue);
                        //setValues({ direccion: inputValue.toUpperCase() });

                        if (!domicilio.direccion){
                            setValues({ direccion: inputValue });
                        }
                        return inputValue;
                    }}
                    onChange={ async (selectedOption) => {
                        if (!selectedOption) return;
                        const address = selectedOption.value;
                        setValues(address.value);
                        clearSuggestions();

                        try {
                            const results = await getGeocode({ address });
                            const { lat, lng } = await getLatLng(results[0]);

                            setValues({
                                direccion: address,
                                latitud: lat,
                                longitud: lng,
                            });

                            panTo({ lat, lng });
                        } catch (error) {
                            console.error("Geocoding error:", error);
                        }
                    }}
                    value={
                        domicilio.direccion
                            ? { value: domicilio.direccion, label: domicilio.direccion }
                            : null
                    }
                    placeholder="Ingrese una dirección para buscar"
                    isDisabled={!ready}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary: "black",
                        },
                    })}
                    styles={{
                        control: (base) => ({
                            ...base,
                            minHeight: "38px",
                            fontSize: "0.875rem",
                        }),
                    }}
                />
                <small className="form-text text-muted">
                    Ingrese una dirección para realizar la búsqueda en el mapa.
                </small>
            </div>


        </div>


    );
};

@extends('Layouts.template-inside')


@section('breadcrumb')
    <div id="display-label" data-title="Indicadores"></div>
@endsection

@section('content')
    <div id="indicadores-app" data-url="{{ url('/') }}"></div>
@endsection

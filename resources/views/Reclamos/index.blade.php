@extends('Layouts.template-inside')


@section('breadcrumb')
    <div id="display-label" data-title="Reclamos"></div>
@endsection

@section('content')
    <div id="reclamos-app" data-url="{{ url('/') }}"></div>
@endsection

@extends('Layouts.template-inside')


@section('breadcrumb')
    <div id="display-label" data-title="Prensa"></div>
@endsection

@section('content')
    <div id="prensa-app" data-url="{{ url('/') }}"></div>
@endsection

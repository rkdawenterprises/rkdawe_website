
import Main from './Main.svelte';
import { log, todays_date } from './utilities';

/// <reference types="node" />

/// <reference types="bootstrap" />
declare var bootstrap: any;

let main_target = document.getElementById( "main" );
const main: Main | null = (main_target == null) ? null :
    new Main( { target: main_target, props: { bootstrap: bootstrap} } );

export default main;

document.addEventListener( 'readystatechange', ( event: Event ) =>
{
    log( `+readystate: ${document.readyState}\n` );

    if( document.readyState !== "complete" )
    {
        document.body.style.visibility = "hidden";
        document.getElementById( "loader" )!.style.visibility = "visible";
    }
    else
    {
        document.body.style.backgroundColor = "rgba( 240, 240, 240, 1.0 )";
        document.body.style.visibility = "visible";
        document.getElementById( "loader" )!.style.visibility = "hidden";
    }
} );

window.addEventListener( 'load', ( event: Event ) =>
{
    todays_date();
} );

let dom_content_loaded = ( event: Event | null ) =>
{
    log( "+DOMContentLoaded" );
}

if( document.readyState === 'loading' )
{
    document.addEventListener( "DOMContentLoaded", dom_content_loaded );
}
else
{
    dom_content_loaded( null );
}

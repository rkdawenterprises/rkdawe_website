
"use strict";

function log( string )
{
    console.log( string );
}

function log_object_name( object )
{
    console.log( object.constructor.name );
}

function log_css( sheet )
{
    log( "Styles:" );
    for( let i = 0; i < sheet.cssRules.length; i++ )
    {
        log( "    " + sheet.cssRules[i].cssText );
    }
}

$( document ).ready( function()
{
    $( window ).scrollTop( 0 );

    $( ".menu_item_login_button" ).text( "Log In" );
    $( ".menu_item_login_button" ).css( "display", "block" );

    $( ".menu_item_login_button" ).on( "click", function ( e )
    {
        e.preventDefault();

        $( ".modal_login" ).modal( "show" );

        return false;
    } );
} );

$( document ).on( "readystatechange", ready_state_changed );

function ready_state_changed()
{
    if( document.readyState !== "complete" )
    {
        document.querySelector( "body" ).style.visibility = "hidden";
        document.querySelector( "footer" ).style.visibility = "hidden";
        document.querySelector( "#loader" ).style.visibility = "visible";
    }
    else
    {
        document.querySelector( "#loader" ).style.display = "none";
        document.querySelector( "body" ).style.visibility = "visible";
        document.querySelector( "footer" ).style.visibility = "visible";
    }
}

/**
 * This places the current date in any element with "todays-date" class attribute.
 */
function todays_date()
{
    let date =  new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let all_elements = document.getElementsByClassName( "todays-date" );
    for( let i = 0; i < all_elements.length; i++ )
    {
        let element = all_elements[i];
        element.innerHTML = month + "." + day + "." + year;
    }
}

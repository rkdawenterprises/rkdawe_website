
/// <reference types="jsencrypt" />
declare var JSEncrypt: any;

export function log( text: string )
{
    console.log( text );
}

export function log_error( text: string  )
{
    console.error( text );
}

export function log_object_name( object: any )
{
    console.log( object.constructor.name );
}

export function log_css( sheet: CSSStyleSheet )
{
    log( "Styles:" );
    for( let i = 0; i < sheet.cssRules.length; i++ )
    {
        log( "    " + sheet.cssRules[i].cssText );
    }
}

/**
 * This places the current date in any element with "todays-date" class attribute.
 */
export function todays_date()
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

export function load_style_sheet( path: string, integrity?: string )
{
    var link_element = document.createElement( "link" );

    link_element.rel = "stylesheet";
    link_element.type = "text/css";
    link_element.href = path;

    if( integrity )
    {
        link_element.integrity = integrity;
        link_element.crossOrigin = "anonymous";
    }

    document.head.appendChild( link_element );
}

export function load_script( path: string, integrity?: string )
{
    let script_element = document.createElement( "script" );
    script_element.src = path;

    if( integrity )
    {
        script_element.integrity = integrity;
        script_element.crossOrigin = "anonymous";
    }

    document.head.appendChild( script_element );
}

export function remove_all_child_nodes( parent: HTMLElement )
{
    while( parent.firstChild )
    {
        parent.removeChild( parent.firstChild );
    }
}

export function sleep( milliseconds: number )
{
    return new Promise( resolve => setTimeout( resolve, milliseconds ) );
}

export async function synchronous_delay( milliseconds: number  )
{
    await sleep( milliseconds );
}

export function get_delimited_substring( string: string, start_delimiter: string, end_delimiter: string ): string
{
    if( string.length < 2 ) return "";

    let start = 0;
    if( start_delimiter.length > 0 )
    {
        start = string.indexOf( start_delimiter );
        if( start === -1 ) return "";
        start = start + start_delimiter.length;
    }

    let end = string.length - 1;
    let length = ( end - start ) + 1;
    if( end_delimiter.length > 0 )
    {
        end = string.indexOf( end_delimiter, start );
        if( start === -1 ) return "";
        length = end - start;
    }

    if( length > 0 )
    {
        return string.substr( start, length );
    }
    else
    {
        return "";
    }
}

export function encrypt_RSA_base64( data: string, public_key_base64: string, key_length: number  ): string
{
    let js_encrypt = new JSEncrypt();
    js_encrypt.setPublicKey( public_key_base64 );
    return js_encrypt.encrypt( data );
}

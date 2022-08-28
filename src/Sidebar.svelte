<script lang="ts">
    import { log } from "./utilities";

    export let get_logged_in_URI: string;

    export function get_offcanvas()
    {
        return document.querySelector( ".offcanvas" );
    }

    export let close_sidebar_handler = () => {}

    export let login_dialog_handler = () => {}

    export let logout_handler = () => {}

    export let weather_station_handler = () => {}

    export let weather_history_handler = () => {}

    let login_html = "Log in";

    interface Get_Logged_in_GET_response
    {
        logged_in: string;
        success: string;
        username: string;
    }

    export function update_login_status()
    {
        fetch( get_logged_in_URI )
        .then( ( response: Response ) =>
        {
            if( !response.ok)
            {
                throw new Error( "Could not get logged in status" );
            }

            return response.json()
        } )
        .then( ( data: any ) =>
        {
            const get_Logged_in_GET_response: Get_Logged_in_GET_response = JSON.parse( JSON.stringify( data ) );
            if( get_Logged_in_GET_response.success === "true" && get_Logged_in_GET_response.logged_in === "true" )
            {
                login_html = "Log out";
            }
            else
            {
                login_html = "Log in";
            }
        } )
        .catch( ( error: any ) =>
        {
            log( error );
            login_html = "Log in";
        } );
    }
</script>

<sidebar>
    <div id="sidebar_offcanvas" class="offcanvas offcanvas-start" tabindex="-1" aria-labelledby="sidebar_menu_label">
        <div class="offcanvas-header">
            <button on:click={close_sidebar_handler} type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <div class="offcanvas-body">
            {#if login_html === "Log in"}
                <button on:click={login_dialog_handler} type="button" class="buttons" aria-controls="login_dialog" aria-label="Login" title="Login">
                    <span class="material-icons icons">login</span><span class="labels" contenteditable="false" bind:innerHTML={login_html}></span>
                </button>
            {/if}
            {#if login_html === "Log out"}
                <button on:click={logout_handler} type="button" class="buttons" aria-controls="logout" aria-label="Logout" title="Logout">
                    <span class="material-icons icons">logout</span><span class="labels" contenteditable="false" bind:innerHTML={login_html}></span>
                </button>
            {/if}
            <button on:click={weather_station_handler} type="button" class="buttons" aria-controls="weather_station" aria-label="Weather Station" title="Weather Station">
                <span class="material-icons-outlined icons">water_drop</span><span class="labels">Weather Station</span>
            </button>
            <button on:click|preventDefault={weather_history_handler} type="button" class="buttons" aria-controls="weather_history" aria-label="Weather History" title="Weather History">
                <span class="material-icons-outlined icons">thermostat</span><span class="labels">Weather History</span>
            </button>
        </div>
    </div>
</sidebar>

<style>
    #sidebar_offcanvas .buttons
    {
        padding: 0.5rem;
        transform: none;
        outline: none;
        border: none;
        background: none;
        vertical-align: middle;
        transition-duration: 0.4s;
    }

    #sidebar_offcanvas .buttons:hover
    {
        background-color: #4CAF50;
    }

    #sidebar_offcanvas .icons
    {
        margin: 0.25rem;
        padding: 0;
        color: black;
        opacity: 1;
        transform: none;
        outline: none;
        border: none;
        background: none;
        vertical-align: middle;
        font-size: 1.75rem;
    }

    #sidebar_offcanvas .labels
    {
        margin: 0.25rem;
        vertical-align: middle;
        font-size: 1.1rem;
    }

    #sidebar_offcanvas
    {
        width: 15rem;
    }

    #sidebar_offcanvas .offcanvas-header
    {
        padding: 1rem;
    }

    #sidebar_offcanvas .offcanvas-body
    {
        padding: 0.5rem;
    }
</style>

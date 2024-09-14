<script lang="ts">
    import { log, log_object_name } from "./utilities";

    export let get_logged_in_URI: string;

    export function get_offcanvas()
    {
        return offcanvas_element;
    }

    export let close_sidebar_handler = () => {}

    export let login_dialog_handler = () => {}

    export let logout_handler = () => {}

    export let initialize_weather_station_handler = () => {}

    export let weather_station_handler = () => {}

    export let weather_station_donna_app_info_handler = () => {}

    let login_html = "Log in";

    let offcanvas_element: HTMLDivElement;

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
            const get_Logged_in_GET_response: Get_Logged_in_GET_response =
                JSON.parse( JSON.stringify( data ) );
            if( (get_Logged_in_GET_response.success === "true")
                && (get_Logged_in_GET_response.logged_in === "true") )
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
    <div class="offcanvas offcanvas-start"
         tabindex="-1"
         aria-labelledby="sidebar_menu_label"
         bind:this={offcanvas_element}>
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
            <button on:click={initialize_weather_station_handler} type="button" class="buttons" aria-controls="initialize_weather_station" aria-label="Initialize Weather Station" title="Initialize Weather Station">
                <span class="material-symbols-outlined icons">device_reset</span><span class="labels">Initialize Weather Station</span>
            </button>
            <button on:click={weather_station_handler} type="button" class="buttons" aria-controls="weather_station" aria-label="Weather Station" title="Weather Station">
                <span class="material-icons-outlined icons">water_drop</span><span class="labels">Weather Station</span>
            </button>
            <button on:click={weather_station_donna_app_info_handler} type="button" class="buttons" aria-controls="weather_station_donna_app_info" aria-label="Weather Station Donna App Info" title="Weather Station Donna App Info">
                <img src="images/weather_station_donna_app_24.png" alt="Weather Station Donna App"><span class="labels">WS Donna App Info</span>
            </button>
        </div>
    </div>
</sidebar>

<style>
    .offcanvas .buttons
    {
        padding: 0.5rem;
        transform: none;
        outline: none;
        border: none;
        background: none;
        vertical-align: middle;
        transition-duration: 0.4s;
    }

    .offcanvas .buttons:hover
    {
        background-color: #4CAF50;
    }

    .offcanvas .icons
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

    .offcanvas .labels
    {
        margin: 0.25rem;
        vertical-align: middle;
        font-size: 1.1rem;
    }

    .offcanvas
    {
        width: 20rem;
    }

    .offcanvas .offcanvas-header
    {
        padding: 1rem;
    }

    .offcanvas .offcanvas-body
    {
        padding: 0.5rem;
    }
</style>

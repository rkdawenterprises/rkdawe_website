<script lang="ts">
    import { log } from "./utilities";
    import { onMount } from "svelte";

    export let weather_station_donna_app_info_URI: string;

    let app_information = "Getting Weather Station Donna App Information...";

    function update_weather_station_donna_app_info()
    {
        fetch( weather_station_donna_app_info_URI )
            .then( ( response: Response ) =>
            {
                if ( !response.ok )
                {
                    throw new Error( "Could not get Weather Station Donna App Information" );
                }

	            return response.text();
            } )
            .then( ( html: string ) =>
            {
                var parser = new DOMParser();
                var document = parser.parseFromString( html, "text/html" );
                app_information = document.documentElement.innerHTML;
            } )
            .catch( ( error: any ) =>
            {
                log( error );
                app_information = error;
            } );
    }

    onMount( () =>
    {
        update_weather_station_donna_app_info();
    } );
</script>

<weather_station_donna_app_info>
    <div class="weather_station_donna_app_info">
        <div
            class="table-responsive"
            contenteditable="false"
            bind:innerHTML={app_information}>
        </div>
    </div>
</weather_station_donna_app_info>

<style>
    .weather_station_donna_app_info
    {
        margin-top: 1em;
    }
</style>

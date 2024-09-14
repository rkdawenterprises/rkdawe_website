
<script lang="ts">
    import Header from './Header.svelte'
    import Footer from './Footer.svelte'
    import Sidebar from './Sidebar.svelte'
    import Login_dialog from './Login_dialog.svelte'
    import Information_dialog from './Information_dialog.svelte'
    import Weather_station from './Weather_station.svelte'
    import Weather_station_donna_app_info from './Weather_station_donna_app_info.svelte'
    import { log, log_error, log_object_name } from "./utilities";
    import { afterUpdate, onMount } from "svelte";
    import { fade } from "svelte/transition";

    /**
     * TODO: I've only been able to get bootstrap show/hide programatically to work properly
     * if I implement it all here rather than in the sidebar. But that's ok, it's still mostly modular...
     */
    export let bootstrap: any;

    let showing = "default_page";

    let sidebar: Sidebar | null = null;
    let sidebar_offcanvas: any = null;

    class Get_API_paths
    {
        get_logged_in_path: string = "";
        authenticate_path: string = "";
        authenticate_passwordless_io_path: string = "";
        initialize_weather_station_path: string = "";
        weather_station_data_path: string = "";
        log_out_path: string = "";
        weather_station_donna_app_info_path: string = "";

        constructor(get_logged_in_path: string = "",
                    authenticate_path: string = "",
                    authenticate_passwordless_io_path: string = "",
                    initialize_weather_station_path: string = "",
                    weather_station_data_path: string = "",
                    log_out_path: string = "",
                    weather_station_donna_app_info_path: string = "")
        {
            this.get_logged_in_path = get_logged_in_path;
            this.authenticate_path = authenticate_path;
            this.authenticate_passwordless_io_path = authenticate_passwordless_io_path;
            this.initialize_weather_station_path = initialize_weather_station_path;
            this.weather_station_data_path = weather_station_data_path;
            this.log_out_path = log_out_path;
            this.weather_station_donna_app_info_path = weather_station_donna_app_info_path;
        }

        set_paths_prefix(prefix: string)
        {
            this.get_logged_in_path = prefix + this.get_logged_in_path;
            this.authenticate_path = prefix + this.authenticate_path;
            this.authenticate_passwordless_io_path = prefix + this.authenticate_passwordless_io_path;
            this.initialize_weather_station_path = prefix + this.initialize_weather_station_path;
            this.weather_station_data_path = prefix + this.weather_station_data_path;
            this.log_out_path = prefix + this.log_out_path;
            this.weather_station_donna_app_info_path = prefix + this.weather_station_donna_app_info_path;
        }
    }

    interface Get_API_paths_GET_response
    {
        paths: Get_API_paths;
        success: string;
    }

    export let API_paths: Get_API_paths = new Get_API_paths();

    export function set_paths(paths: Get_API_paths)
    {
        API_paths = new Get_API_paths(paths.get_logged_in_path,
                                      paths.authenticate_path,
                                      paths.authenticate_passwordless_io_path,
                                      paths.initialize_weather_station_path,
                                      paths.weather_station_data_path,
                                      paths.log_out_path,
                                      paths.weather_station_donna_app_info_path);
        API_paths.set_paths_prefix("rkdaweapi");

        //log(JSON.stringify(API_paths));
    }

    onMount(() =>
    {
        fetch("rkdaweapi/v1")
            .then((response: Response): Promise<Get_API_paths_GET_response> =>
            {
                if ( !response.ok )
                {
                    throw new Error( `Could not get API V1 from server: ${response.statusText}` );
                }

                return response.json() as Promise<Get_API_paths_GET_response>
            })
            .then((data: Get_API_paths_GET_response): void =>
            {
                if(data.success !== "true")
                {
                    log("Server returned success = false")
                    return;
                }

                set_paths(data.paths);
            })
            .catch( ( error: any ) =>
            {
                log( error );
            } );
    });

    let open_sidebar_handler = () =>
    {
        if(sidebar == null) return;
        sidebar.update_login_status();
        if(( !sidebar_offcanvas ) || (sidebar_offcanvas == null))
        {
            sidebar_offcanvas = new bootstrap.Offcanvas( sidebar.get_offcanvas() );
        }

        sidebar_offcanvas.show();
    }

    let close_sidebar_handler = () =>
    {
        if((sidebar_offcanvas != null) && sidebar_offcanvas)
        {
            sidebar_offcanvas.hide();
        }
    }

    let login_dialog: Login_dialog | null = null;
    let login_dialog_modal: any = null;

    let login_dialog_handler = () =>
    {
        if(login_dialog == null) return;
        if(( !login_dialog_modal ) || (login_dialog_modal == null))
        {
            login_dialog_modal = new bootstrap.Modal( login_dialog.get_modal_element() );
        }
        else
        {
            login_dialog.clear_status();
        }

        if((sidebar_offcanvas != null) && sidebar_offcanvas)
        {
            sidebar_offcanvas.hide();
        }

        login_dialog_modal.show();
    }

    let close_login_dialog_handler = ( delay_in_milliseconds?: number ) =>
    {
        if(login_dialog == null) return;
        if(login_dialog_modal == null) return;

        if( !delay_in_milliseconds )
        {
            if( login_dialog_modal )
            {
                login_dialog.hide_message();
                login_dialog_modal.hide();
            }
        }
        else
        {
            setTimeout( () =>
            {
                if(login_dialog == null) return;
                if( login_dialog_modal )
                {
                    login_dialog.hide_message();
                    login_dialog_modal.hide();
                }
            },
            delay_in_milliseconds );
        }
    }

    let logout_handler = () =>
    {
        fetch( API_paths.log_out_path )
        .then( ( response: Response ) =>
        {
            if((sidebar_offcanvas != null) && sidebar_offcanvas)
            {
                sidebar_offcanvas.hide();
            }
        } );
    }

    let initialize_weather_station_handler = async () =>
    {
        try
        {
            await fetch( API_paths.initialize_weather_station_path )
            .then( async ( response: Response ) =>
            {
                if((sidebar_offcanvas != null) && sidebar_offcanvas)
                {
                    sidebar_offcanvas.hide();
                }

                if( response.ok )
                {
                    const response_JSON: JSON = await response.json();
                    information_dialog_handler("Success", JSON.stringify( response_JSON, null, 4 ));
                }
                else
                {
                    log_error( `${response.status}` );
                    information_dialog_handler("Error", `${response.status}:${response.statusText}`);
                }
            } );
        }
        catch( error )
        {
            log_error( error );
            information_dialog_handler("Error", `Could not initialize weather station: ${error}`);
        }
    }

    let information_dialog: Information_dialog | null = null;
    let information_dialog_modal: any = null;

    let information_dialog_handler = (message: string, title: string) =>
    {
        if(information_dialog == null) return;
        if(( !information_dialog_modal ) || (information_dialog_modal == null))
        {
            information_dialog_modal = new bootstrap.Modal( information_dialog.get_modal_element() );
        }

        if((sidebar_offcanvas != null) && sidebar_offcanvas)
        {
            sidebar_offcanvas.hide();
        }

        information_dialog.set_message(message, title);

        information_dialog_modal.show();
    }

    let close_information_dialog_handler = ( delay_in_milliseconds?: number ) =>
    {
        if(information_dialog == null) return;
        if(information_dialog_modal == null) return;

        if( !delay_in_milliseconds )
        {
            if( information_dialog_modal )
            {
                information_dialog_modal.hide();
            }
        }
        else
        {
            setTimeout( () =>
            {
                if(information_dialog == null) return;
                if( information_dialog_modal )
                {
                    information_dialog_modal.hide();
                }
            },
            delay_in_milliseconds );
        }
    }

    let weather_station: Weather_station | null = null;
    let weather_station_handler = () =>
    {
        if((sidebar_offcanvas != null) && sidebar_offcanvas)
        {
            sidebar_offcanvas.hide();
        }

        showing = "weather_station";
    }

    let weather_station_donna_app_info: Weather_station_donna_app_info | null = null;
    let weather_station_donna_app_info_handler = () =>
    {
        if((sidebar_offcanvas != null) && sidebar_offcanvas)
        {
            sidebar_offcanvas.hide();
        }

        showing = "weather_station_donna_app_info";
    }
</script>

<main class="container-fluid">
    <Header open_sidebar_handler = { open_sidebar_handler }></Header>

    <Sidebar bind:this={ sidebar }
        close_sidebar_handler = { close_sidebar_handler }
        login_dialog_handler = { login_dialog_handler }
        logout_handler = { logout_handler }
        initialize_weather_station_handler = { initialize_weather_station_handler }
        weather_station_handler = { weather_station_handler }
        weather_station_donna_app_info_handler = { weather_station_donna_app_info_handler }
        get_logged_in_URI = {API_paths.get_logged_in_path}>
    </Sidebar>

    <Login_dialog bind:this={ login_dialog }
        login_URI = {[API_paths.authenticate_path, API_paths.authenticate_passwordless_io_path]}
        close_login_dialog_handler = { close_login_dialog_handler }>
    </Login_dialog>

    <Information_dialog bind:this={ information_dialog }
        close_information_dialog_handler = { close_information_dialog_handler }>
    </Information_dialog>

    <div class="content">
        { #if showing === "weather_station" }
            <Weather_station bind:this={ weather_station }
                weather_station_data_URI = {API_paths.weather_station_data_path}>
            </Weather_station>
        {:else if showing === "weather_station_donna_app_info"}
            <Weather_station_donna_app_info bind:this={ weather_station_donna_app_info }
                weather_station_donna_app_info_URI = {API_paths.weather_station_donna_app_info_path}>
            </Weather_station_donna_app_info>
        {:else}
            <p>This page is under construction as of <span class="todays-date"></span>. Please come back soon! <span class="material-icons-outlined">sentiment_satisfied</span></p>
        { /if }
    </div>

    <Footer></Footer>
</main>


<script lang="ts">
    import Header from './Header.svelte'
    import Footer from './Footer.svelte'
    import Sidebar from './Sidebar.svelte'
    import Login_dialog from './Login_dialog.svelte'
    import Weather_station from './Weather_station.svelte'
    import { log } from "./utilities";

    /**
     * I've only been able to get bootstrap show/hide programatically to work properly
     * if I do it all here. But that's ok, it's still mostly modular...
     */
    export let bootstrap: any;

    let showing = "default_page";

    let sidebar = null;
    let sidebar_offcanvas = null;

    let open_sidebar_handler = () =>
    {
        sidebar.update_login_status();
        if( !sidebar_offcanvas ) sidebar_offcanvas = new bootstrap.Offcanvas( sidebar.get_offcanvas() );
        sidebar_offcanvas.show();
    }

    let close_sidebar_handler = () =>
    {
        if( sidebar_offcanvas ) sidebar_offcanvas.hide();
    }

    let login_dialog = null;
    let login_dialog_modal = null;

    let login_dialog_handler = () =>
    {
        if( !login_dialog_modal ) login_dialog_modal = new bootstrap.Modal( login_dialog.get_modal() );
        sidebar_offcanvas.hide();
        login_dialog_modal.show();
    }

    let close_login_dialog_handler = ( delay_in_milliseconds?: number ) =>
    {
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
                if( login_dialog_modal )
                {
                    login_dialog.hide_message();
                    login_dialog_modal.hide();
                }
            },
            delay_in_milliseconds );
        }
    }

    let log_out_URI = "rkdaweapi/log_out";
    let logout_handler = () =>
    {
        fetch( log_out_URI )
        .then( ( response: Response ) =>
        {
            if( sidebar_offcanvas ) sidebar_offcanvas.hide();
        } );
    }

    let weather_station = null;
    let weather_station_handler = () =>
    {
        sidebar_offcanvas.hide();
        showing = "weather_station";
    }
</script>

<main class="container-fluid">
    <Header open_sidebar_handler = { open_sidebar_handler }></Header>

    <Sidebar bind:this={ sidebar }
        close_sidebar_handler = { close_sidebar_handler }
        login_dialog_handler = { login_dialog_handler }
        logout_handler = { logout_handler }
        weather_station_handler = { weather_station_handler }
        get_logged_in_URI = "rkdaweapi/get_logged_in">
    </Sidebar>

    <Login_dialog bind:this={ login_dialog }
        login_URI = "rkdaweapi/authenticate"
        close_login_dialog_handler = { close_login_dialog_handler }>
    </Login_dialog>

    <div class="content">
        { #if showing === "weather_station" }
            <Weather_station bind:this={ weather_station }
                weather_station_data_URI = "rkdaweapi/weather_station_data">
            </Weather_station>
        {:else}
            <p>This page is under construction as of <span class="todays-date"></span>. Please come back soon! <span class="material-icons-outlined">sentiment_satisfied</span></p>
        { /if }
    </div>

    <Footer></Footer>
</main>

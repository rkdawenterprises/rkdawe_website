<script lang="ts">
    import { log } from "./utilities";
    import { onMount } from "svelte";

    export let weather_station_data_URI: string;

    interface Weather_data
    {
        system_name: string;
        time: string;

        /*
         * Station information acquired during configuration.
         */
        wrd: number;
        total_packets_received: number;
        total_packets_missed: number;
        number_of_resynchronizations: number;
        largest_number_packets_received_in_a_row: number;
        number_of_CRC_errors_detected: number;
        firmware_date_code: string;
        firmware_version: string;
        DID: string;

        /*
         * Measurement units
         */
        barometer_units: string;
        temperature_units: string;
        humidity_units: string;
        wind_speed_units: string;
        wind_direction_units: string;
        rain_units: string;
        rain_rate_units: string;
        bar_trend: string;

        /*
         * Loop2 packet data.
         */
        barometer: number;
        inside_temperature: number;
        inside_humidity: number;
        outside_temperature: number;
        wind_speed: number;
        wind_direction: number;
        ten_min_avg_wind_speed: number;
        two_min_avg_wind_speed: number;
        ten_min_wind_gust: number;
        wind_direction_of_ten_min_wind_gust: number;
        dew_point: number;
        outside_humidity: number;
        heat_index: number;
        wind_chill: number;
        rain_rate: number;
        storm_rain: number;
        start_date_of_current_storm: string;
        daily_rain: number;
        last_fifteen_min_rain: number;
        last_hour_rain: number;
        daily_et: number;
        last_twenty_four_hour_rain: number;

        /*
         * Loop packet data.
         */
        month_rain: number;
        year_rain: number;
        transmitter_battery_status: string;
        console_battery_voltage: number;
        console_battery_voltage_units: string;

        /*
         * HILOWS packet data.
         */
        daily_low_barometer: number;
        daily_high_barometer: number;
        month_low_bar: number;
        month_high_bar: number;
        year_low_barometer: number;
        year_high_barometer: number;
        time_of_day_low_bar: string;
        time_of_day_high_bar: string;

        daily_hi_wind_speed: number;
        time_of_hi_speed: string;
        month_hi_wind_speed: number;
        year_hi_wind_speed: number;

        day_hi_inside_temp: number;
        day_low_inside_temp: number;
        time_day_hi_in_temp: string;
        time_day_low_in_temp: string;
        month_low_in_temp: number;
        month_hi_in_temp: number;
        year_low_in_temp: number;
        year_hi_in_temp: number;

        day_hi_in_hum: number;
        day_low_in_hum: number;
        time_day_hi_in_hum: string;
        time_day_low_in_hum: string;
        month_hi_in_hum: number;
        month_low_in_hum: number;
        year_hi_in_hum: number;
        year_low_in_hum: number;

        day_low_out_temp: number;
        day_hi_out_temp: number;
        time_day_low_out_temp: string;
        time_day_hi_out_temp: string;
        month_hi_out_temp: number;
        month_low_out_temp: number;
        year_hi_out_temp: number;
        year_low_out_temp: number;

        day_low_dew_point: number;
        day_hi_dew_point: number;
        time_day_low_dew_point: string;
        time_day_hi_dew_point: string;
        month_hi_dew_point: number;
        month_low_dew_point: number;
        year_hi_dew_point: number;
        year_low_dew_point: number;

        day_low_wind_chill: number;
        time_day_low_chill: string;
        month_low_wind_chill: number;
        year_low_wind_chill: number;

        day_high_heat: number;
        time_of_day_high_heat: string;
        month_high_heat: number;
        year_high_heat: number;

        day_high_rain_rate: number;
        time_of_day_high_rain_rate: string;
        hour_high_rain_rate: number;
        month_high_rain_rate: number;
        year_high_rain_rate: number;

        day_low_humidity: number;
        day_hi_humidity: number;
        time_day_low_humidity: string;
        time_day_hi_humidity: string;
        month_hi_humidity: number;
        month_low_humidity: number;
        year_hi_humidity: number;
        year_low_humidity: number;

        /*
         * Forecast data
         */
        forecast_location_coordinates: string;
        forecast_location_city: string;
        forecast_location_state: string;
        period_1_forecast_icon: string;
        period_1_short_forecast: string;
    }

    interface Get_Weather_station_data_GET_response
    {
        weather_data: Weather_data;
        success: string;
    }

    let weather_data = "Downloading weather data from server...";

    function update_weather_data()
    {
        if( "geolocation" in navigator )
        {
            navigator.geolocation.getCurrentPosition( ( position ) =>
            {
                let data_URI: string =
                    `${weather_station_data_URI}?forecast_location=${position.coords.latitude},${position.coords.longitude}`;
                update_weather_data_html( encodeURI( data_URI ) );
            },
            ( error ) =>
            {
                log( `Couldn't get users location. Error code: ${error.code}, message: ${error.message}.` );
                update_weather_data_html( weather_station_data_URI );
            } );
        }
        else
        {
            update_weather_data_html( weather_station_data_URI );
        }
    }

    function update_weather_data_html(data_URI: string)
    {
        fetch( data_URI )
            .then( ( response: Response ) =>
            {
                if ( !response.ok )
                {
                    throw new Error( `Could not get weather data from server: ${response.statusText}` );
                }

                return response.json();
            } )
            .then( ( data: any ) =>
            {
                const get_Weather_station_data_GET_response: Get_Weather_station_data_GET_response =
                    JSON.parse( JSON.stringify( data ) );
                if ( get_Weather_station_data_GET_response.success === "true" )
                {
                    let table_html = "<table class=\"table table-striped\">";
                    
                    let weather_data_part = get_Weather_station_data_GET_response.weather_data;
                    for( const key in weather_data_part )
                    {
                        table_html += `<tr><td>${key}</td><td>${weather_data_part[key]}</td></tr>`;
                    }
                    
                    table_html += "</table>"
                    weather_data = table_html;
                }
                else
                {
                    weather_data = "Error parsing weather data from server";
                }
            } )
            .catch( ( error: any ) =>
            {
                log( error );
                weather_data = error;
            } );
    }

    onMount( () =>
    {
        update_weather_data();
    } );
</script>

<weather_station>
    <div class="weather_station">
        <div
            class="table-responsive"
            contenteditable="false"
            bind:innerHTML={weather_data}>
        </div>
    </div>
</weather_station>

<style>
    .weather_station
    {
        margin-top: 1em;
    }
</style>

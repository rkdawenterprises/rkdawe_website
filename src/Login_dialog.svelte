<script lang="ts">
    import { select_multiple_value } from "svelte/internal";
    import { fade } from "svelte/transition";
    import { encrypt_RSA_base64, log, log_error, log_object_name } from "./utilities";

    export let login_URI: string;
    export let close_login_dialog_handler = ( delay_in_milliseconds?: number ) => {}

    interface SubmitEvent extends Event
    {
        submitter: HTMLElement;
        currentTarget: HTMLFormElement;
    }

    interface Authenticate_GET_response
    {
        public_key_base64: string;
        success: string;
        key_length: number;
        algorithm: string;
    }

    interface Authenticate_POST_response
    {
        success: string;
        comment: string;
        username: string;
        last_log_in: string;
        current_log_in: string;
        email: string;
        created_at: string;
        last_invalid_attempt: string;
        invalid_attempts: number;
    }

    export function get_modal()
    {
        return document.querySelector( ".modal" );
    }

    let show_password = false;
    const toggle_show_password = () => { show_password = !show_password; };

    let show_message = false;
    let message_html = "";
    let message_color = "";
    export function hide_message() { show_message = false; }

    const do_form_post = async ( form_element: HTMLFormElement, authenticate_GET_response: Authenticate_GET_response ) =>
    {
        try
        {
            const form_data = new FormData( form_element );

            let password = form_data.get( "password" ) as string;
            let password_encrypted = encrypt_RSA_base64( password,
                                                         authenticate_GET_response.public_key_base64,
                                                         authenticate_GET_response.key_length )
            form_data.set( "password_encrypted", password_encrypted );
            form_data.delete( "password" );

            const form_data_as_JSON_string = JSON.stringify( Object.fromEntries( form_data.entries() ) );
            const fetch_init =
            {
                method: form_element.method,
                headers:
                {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: form_data_as_JSON_string,
            };

            const response = await fetch( form_element.action, fetch_init );
            if( response.ok )
            {
                const response_JSON: JSON = await response.json();
                const response_JSON_as_string = JSON.stringify( response_JSON, null, 4 );
                const authenticate_POST_response: Authenticate_POST_response = JSON.parse( response_JSON_as_string );

                // log( `Login form post response:\n ${response_JSON_as_string}` );

                form_submit_success( authenticate_POST_response );
            }
            else
            {
                log_error( `${response.status}` );
                form_submit_failure( `Server responded with ${response.status} error` );
            }
        }
        catch( error )
        {
            log_error( error );
            form_submit_failure( "Error submitting user information" );
        }
    }

    const handle_form_submit = async ( event: SubmitEvent ) =>
    {
        event.preventDefault();

        const form_element = event.currentTarget;

        try
        {
            const response = await fetch( form_element.action  );
            if( response.ok )
            {
                const response_JSON: JSON = await response.json();
                const authenticate_GET_response: Authenticate_GET_response = JSON.parse( JSON.stringify( response_JSON ) );

                do_form_post( form_element, authenticate_GET_response );
            }
            else
            {
                log_error( `${response.status}` );
                form_submit_failure( `Server responded with ${response.status} error` );
            }
        }
        catch( error )
        {
            log_error( error );
            form_submit_failure( "Error securing communication with server" );
        }
    };

    const form_submit_success = ( response: Authenticate_POST_response ) =>
    {
        if( response.success === "true" )
        {
            message_html = `<span>${response.comment}, last logged in at ${response.last_log_in}</span>`;
            message_color = "green";
            show_message = true;

            close_login_dialog_handler( 2000 );
        }
        else if( ( response.success === "current" ) || ( response.success === "already" ) )
        {
            message_html = `<span>${response.comment}, since ${response.last_log_in}</span>`;
            message_color = "green";
            show_message = true;

            close_login_dialog_handler( 2000 );
        }
        else
        {
            message_html = `<span>${response.comment}</span>`;
            message_color = "red";
            show_message = true;
        }
    };

    const form_submit_failure = ( message: string ) =>
    {
        message_html = `<span>${message}</span>`;
        message_color = "red";
        show_message = true;
    };

    const close_login_dialog_click_handler = () =>
    {
        close_login_dialog_handler();
    }

    let username_input: HTMLInputElement;
    const username_input_focus_select_all = () =>
    {
        username_input.select();
    }

    let password_input: HTMLInputElement;
    const password_input_focus_select_all = () =>
    {
        password_input.select();
    }
</script>

<login_dialog>
    <div class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content" on:click={ hide_message }>
                <div class="modal-header">
                    <h2 class="modal-title">Log In</h2>
                    <button on:click={close_login_dialog_click_handler} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                <form method="post" action="{login_URI}" on:submit|preventDefault={ handle_form_submit }>
                    <table>
                        <tr>
                            <td class="label_cell"><label for="username"><i class="fas fa-user"></i></label></td>
                            <td class="input_cell"><input id="username"
                                                        type="text"
                                                        name="username"
                                                        placeholder="Username"
                                                        bind:this={username_input}
                                                        on:focus={username_input_focus_select_all}
                                                        required></td>
                        </tr>
                    </table>

                    <table>
                        <tr>
                            <td class="label_cell"><label for="password"><i class="fas fa-lock"></i></label></td>
                            <td class="input_cell"><input id="password"
                                                        type={ show_password ? "text" : "password" }
                                                        name="password"
                                                        placeholder="Password"
                                                        bind:this={password_input}
                                                        on:focus={password_input_focus_select_all}
                                                        required></td>
                            <td class="button_cell">
                                <button type="button" on:click={ toggle_show_password }>
                                    <i class="fa fa-fw { show_password ? 'fa-eye-slash' : 'fa-eye' }"></i>
                                </button>
                            </td>
                        </tr>
                    </table>

                    {#if show_message}
                        <div class="message_login" style="color:{message_color};" transition:fade="{{ duration: 250 }}"
                            contenteditable="false" bind:innerHTML={message_html}></div>
                    {/if}

                    <input type="submit" value="Log In">
                </div>
            </div>
        </div>
    </div>
</login_dialog>

<style>
    .modal-content
    {
        max-width: 33%;
        min-width: 27em;
        background-color: white;
        box-shadow: 0 0 9px 0 rgba( 0, 0, 0, 0.3 );
        padding: 0;
    }

    .modal-content h2
    {
        font-size: 1.75em;
    }

    .modal-content .modal-body
    {
        padding: 1.5em;
    }

    .modal-content table
    {
        width: 100%;
        border: none;
        margin-bottom: 20px;
    }

    .modal-content tr
    {
        padding: 0;
        border: 0.075em solid black;
    }

    .modal-content td
    {
        vertical-align: middle;
        padding: 0.5em;
    }

    .modal-content .label_cell
    {
        background-color: rgba( 50, 116, 214, 1.0 );
        text-align: center;
        width: 3.1em;
    }

    .modal-content label
    {
        text-align: center;
        font-size: 1.5em;
        color: white;
    }

    .modal-content .input_cell
    {
        display:flex;
        flex-direction:row;
    }

    .modal-content input
    {
        border: none;
        outline: 0;
        font-size: 1.5em;
        width: 100%;
    }

    .modal-content .button_cell
    {
        background-color: rgba( 230, 230, 230, 1.0 );
        text-align: center;
        width: 3.1em;
    }

    .modal-content .button_cell button
    {
        text-align: center;
        font-size: 1.4em;
        padding: 0;
        border: none;
        background: none;
        outline: none;
        transform: none;
        color: black;
    }

    .modal-content .message_login
    {
        text-align: center;
        font-size: 0.8em;
        color: red;
        margin: auto;
    }

    .modal-content form input[type="submit"]
    {
        width: 100%;
        padding: 0.5em;
        margin-top: 0.5em;
        background-color: rgba( 36, 139, 208, 1.00 );
        border: 0;
        cursor: pointer;
        font-weight: bold;
        font-size: 1.5em;
        color: white;
        transition: background-color 0.2s;
    }

    .modal-content form input[type="submit"]:hover
    {
        background-color: rgba( 63, 184, 39, 1.00 );
        transition: background-color 0.2s;
        color: white;
    }
</style>

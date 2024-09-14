<script lang="ts">
    import { fade } from "svelte/transition";
    import { encrypt_RSA_base64, log, log_error, log_object_name } from "./utilities";

    export let login_URI: string[];
    export let close_login_dialog_handler = (delay_in_milliseconds?: number) => {};

    interface SubmitEvent extends Event {
        submitter: HTMLElement;
        currentTarget: HTMLFormElement;
    }

    interface Authenticate_GET_response {
        public_key_base64: string;
        success: string;
        key_length: number;
        algorithm: string;
    }

    interface Authenticate_POST_response {
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

    let modal_element: HTMLElement;

    export function get_modal_element() {
        return modal_element;
    }

    export function clear_status() {
        message_html = "";
        message_color = "black";
        hide_message();
    }

    let show_password = false;
    const toggle_show_password = () => {
        show_password = !show_password;
    };

    let show_message = false;
    let message_html = "";
    let message_color = "black";
    export function hide_message() {
        show_message = false;
    }

    const do_form_post = async (
        form_element: HTMLFormElement,
        authenticate_GET_response: Authenticate_GET_response
    ) => {
        try {
            const form_data = new FormData(form_element);

            let password = form_data.get("password") as string;
            let password_encrypted = encrypt_RSA_base64(
                password,
                authenticate_GET_response.public_key_base64,
                authenticate_GET_response.key_length
            );
            form_data.set("password_encrypted", password_encrypted);
            form_data.delete("password");

            const form_data_as_JSON_string = JSON.stringify(Object.fromEntries(form_data.entries()));
            const fetch_init = {
                method: form_element.method,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: form_data_as_JSON_string
            };

            const response = await fetch(login_URI[0], fetch_init);
            if (response.ok) {
                const response_JSON: JSON = await response.json();
                const response_JSON_as_string = JSON.stringify(response_JSON, null, 4);
                const authenticate_POST_response: Authenticate_POST_response = JSON.parse(response_JSON_as_string);

                // log( `Login form post response:\n ${response_JSON_as_string}` );

                form_submit_success(authenticate_POST_response);
            } else {
                log_error(`${response.status}`);
                form_submit_failure(`Server responded with ${response.status} error`);
            }
        } catch (error) {
            log_error(error);
            form_submit_failure("Error submitting user information");
        }
    };

    const handle_form_submit = async (event: SubmitEvent) => {
        event.preventDefault();

        const form_element = event.currentTarget;
        const form_data = new FormData(form_element);
        let authentication_type_selected = form_data.get("authentication_type") as string;

        if(authentication_type_selected === authentication_type_values[0].value)
        {
            try {
                const response = await fetch(login_URI[0]);
                if (response.ok) {
                    const response_JSON: JSON = await response.json();
                    const authenticate_GET_response: Authenticate_GET_response = JSON.parse(JSON.stringify(response_JSON));

                    do_form_post(form_element, authenticate_GET_response);
                } else {
                    log_error(`${response.status}`);
                    form_submit_failure(`Server responded with ${response.status} error`);
                }
            } catch (error) {
                log_error(error);
                form_submit_failure("Error securing communication with server");
            }
        }
        else
        {
            try {
                const response = await fetch(login_URI[1]);
                if (response.ok) {
                    log(`>>> login success...`);





                } else {
                    log_error(`${response.status}`);
                    form_submit_failure(`Server responded with ${response.status} error`);
                }
            } catch (error) {
                log_error(error);
                form_submit_failure("Error securing communication with server");
            }
        }
    };

    const form_submit_success = (response: Authenticate_POST_response) => {
        if (response.success === "true") {
            message_html = `<span>${response.comment}, last logged in at ${response.last_log_in}</span>`;
            message_color = "green";
            show_message = true;

            close_login_dialog_handler(2000);
        } else if (response.success === "current" || response.success === "already") {
            message_html = `<span>${response.comment}, since ${response.last_log_in}</span>`;
            message_color = "green";
            show_message = true;

            close_login_dialog_handler(2000);
        } else {
            message_html = `<span>${response.comment}</span>`;
            message_color = "red";
            show_message = true;
        }
    };

    const form_submit_failure = (message: string) => {
        message_html = `<span>${message}</span>`;
        message_color = "red";
        show_message = true;
    };

    const close_login_dialog_click_handler = () => {
        close_login_dialog_handler();
    };

    let username_input: HTMLInputElement;
    const username_input_focus_select_all = () => {
        username_input.select();
    };

    let password_input: HTMLInputElement;
    const password_input_focus_select_all = () => {
        password_input.select();
    };

    const authentication_type_values = [
        { label: "Using Account Username", value: "using_account_username_password" },
        { label: "Using Passwordless.id", value: "using_passwordless_id" }
    ];

    let authentication_type_selected = authentication_type_values[0].value;
    const authentication_type_selected_changed = (event: Event) => {
        log(`>>> ${authentication_type_selected}`);
    };
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
        integrity="sha256-MBffSnbbXwHCuZtgPYiwMQbfE7z+GOZ7fBPCNB06Z98= sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN sha512-b2QcS5SsA8tZodcDtGRELiGv5SaKSk1vDHDaQRda0htPYWZ6046lr3kJ5bAAQdpV2mmA/4v0wQF9MyU6/pDIAg=="
        crossorigin="anonymous" />
</svelte:head>

<login_dialog>
    <div class="modal fade" tabindex="-1" bind:this="{modal_element}">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Log In</h2>
                    <button
                        on:click="{close_login_dialog_click_handler}"
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close">
                    </button>
                </div>

                <div class="modal-body">
                    <form method="post" on:submit|preventDefault="{handle_form_submit}">
                        <table>
                            <tr>
                                <td class="label_cell">
                                    <label for="login_username"><i class="fas fa-user"></i></label>
                                </td>
                                <td class="input_cell">
                                    <input
                                        id="login_username"
                                        class="form-control"
                                        autocomplete="username"
                                        type="text"
                                        name="username"
                                        placeholder="username"
                                        bind:this="{username_input}"
                                        on:focus="{username_input_focus_select_all}"
                                        required="{authentication_type_selected === authentication_type_values[0].value}"
                                        disabled="{authentication_type_selected !== authentication_type_values[0].value}" />
                                </td>
                            </tr>
                        </table>

                        <table>
                            <tr>
                                <td class="label_cell">
                                    <label for="login_password"><i class="fas fa-lock"></i></label>
                                </td>
                                <td class="input_cell">
                                    <input
                                        id="login_password"
                                        class="form-control"
                                        autocomplete="current-password"
                                        type="{show_password ? 'text' : 'password'}"
                                        name="password"
                                        placeholder="password"
                                        bind:this="{password_input}"
                                        on:focus="{password_input_focus_select_all}"
                                        required="{authentication_type_selected === authentication_type_values[0].value}"
                                        disabled="{authentication_type_selected !== authentication_type_values[0].value}" />
                                </td>
                                <td class="button_cell">
                                    <button type="button" on:click="{toggle_show_password}">
                                        <i class="fa fa-fw {show_password ? 'fa-eye-slash' : 'fa-eye'}"></i>
                                    </button>
                                </td>
                            </tr>
                        </table>

                        <div class="authentication_type_radio_group">
                            <div class="form-check form-check-inline">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    name="authentication_type"
                                    id="{authentication_type_values[0].value}"
                                    value="{authentication_type_values[0].value}"
                                    bind:group="{authentication_type_selected}"
                                    on:change="{authentication_type_selected_changed}"
                                    checked="{authentication_type_selected === authentication_type_values[0].value}" />
                                <label class="form-check-label" for="{authentication_type_values[0].value}">
                                    {authentication_type_values[0].label}
                                </label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    name="authentication_type"
                                    id="{authentication_type_values[1].value}"
                                    value="{authentication_type_values[1].value}"
                                    bind:group="{authentication_type_selected}"
                                    on:change="{authentication_type_selected_changed}"
                                    checked="{authentication_type_selected === authentication_type_values[1].value}" />
                                <label class="form-check-label" for="{authentication_type_values[1].value}">
                                    {authentication_type_values[1].label}
                                </label>
                            </div>
                        </div>

                        {#if show_message}
                            <div
                                class="message_login"
                                style="color:{message_color};"
                                transition:fade="{{ duration: 250 }}"
                                contenteditable="false"
                                bind:innerHTML="{message_html}">
                            </div>
                        {/if}

                        <input type="submit" value="Log In" />
                    </form>
                </div>
            </div>
        </div>
    </div>
</login_dialog>

<style>
    @import "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css";
</style>

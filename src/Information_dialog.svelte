<script lang="ts">
    import { fade } from "svelte/transition";
    import { log, log_error, log_object_name } from "./utilities";

    export let close_information_dialog_handler = ( delay_in_milliseconds?: number ) => {}

    let modal_element: HTMLElement;
    let message_html = "<span>set message</span>";
    let message_color = "black";
    let title_html = "<span>set title</span>";
    let title_color = "black";

    export function get_modal_element()
    {
        return modal_element;
    }

    const close_information_dialog_click_handler = () =>
    {
        close_information_dialog_handler();
    }

    export function set_message( title: string,
                                 message: string,
                                 title_color: string = "black",
                                 message_color: string = "black")
    {
        message_html = `<span>${message}</span>`;
        message_color = message_color;
        title_html = `<span>${title}</span>`;
        title_color = title_color;
    }
</script>

<information_dialog>
    <div class="modal fade" tabindex="-1"  bind:this={modal_element}>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title"  style="color:{title_color};" contenteditable="false" bind:innerHTML={title_html}></h2>
                    <button on:click={close_information_dialog_click_handler} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="message_information" style="color:{message_color};" transition:fade="{{ duration: 250 }}"
                        contenteditable="false" bind:innerHTML={message_html}></div>
                </div>
                <div class="modal-footer">
                    <button on:click={close_information_dialog_click_handler} type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>
</information_dialog>

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
        font-size: 2.0em;
    }

    .modal-content .modal-body
    {
        padding: 1.5em;
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

    .modal-content .message_information
    {
        text-align: center;
        font-size: 1.5em;
        color: black;
        margin: auto;
    }
</style>

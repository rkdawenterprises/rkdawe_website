<script lang="ts">
    import { log } from "./utilities";

    export let open_sidebar_handler = () => {}
</script>

<header>
    <div class="container-fluid header">
        <div class="row">
            <div class="col-sm-1">
                <button on:click={open_sidebar_handler} type="button" class="menu" aria-controls="menu" aria-label="Menu" title="Menu">
                    <i class="material-icons">menu</i>
                </button>
            </div>
            <div class="col-sm-11 d-flex justify-content-center">
                <a href="index.html"><img class="header" src="images/site_banner.png" alt="Site banner"></a>
            </div>
        </div>
    </div>
</header>

<style>
    .header
    {
        margin-bottom: 1em;
    }

    .menu
    {
        margin: 0.75rem;
        padding: 0;
        color: grey;
        opacity: 1;
        transform: none;
        outline: none;
        border: none;
        background: none;
    }

    .menu:hover
    {
        color: black;
    }

    .menu i
    {
        vertical-align: middle;
        font-size: 1.75rem;
    }
</style>

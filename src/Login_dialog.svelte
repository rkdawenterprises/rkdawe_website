
<script lang="ts">
	import { fade } from 'svelte/transition';

	export let login_URI: string;

	let show_password = false;
	const toggle_show_password = () => { show_password = !show_password; }

	let show_message = false;

	const handle_submit = async ( event: { target: HTMLFormElement; } ) =>
	{
		const options =
		{
    		method: "POST",
    		body: JSON.stringify( new FormData( event.target ) ),
    		headers: { "Content-Type": "application/json" }
  		};

		fetch( login_URI, options ).then( ( result ) => result.json() ).then( ( result ) => console.log( result ) );
	}
</script>

<div class="modal fade modal_login">
	<div class="modal-dialog modal_dialog_login">
		<div class="modal-content modal_content_login">
			<div class="modal-header">
				<h2 class="modal-title">Log In</h2>

				<button type="button"
						class="close"
						data-dismiss="modal"><i class="material-icons close_italic">close</i></button>
			</div>
		    <div class="modal-body">
				<form id="form_login" method="post" on:submit|preventDefault={ handle_submit }>
					<table>
						<tr>
							<td class="label_cell"><label for="username"><i class="fas fa-user"></i></label></td>
							<td class="input_cell"><input id="username"
														type="text"
														name="username"
														placeholder="Username"
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
														required></td>
							<td class="button_cell">
								<button type="button" on:click={ toggle_show_password }>
									<i class={ show_password ? "fa fa-fw fa-eye-slash" : "fa fa-fw fa-eye" }></i>
								</button>
							</td>
						</tr>
					</table>

					{#if show_message}
						<div class="message_login" transition:fade></div>
					{/if}

					<input type="submit" value="Log In">
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.modal_content_login
	{
		max-width: 33%;
		min-width: 27em;
		background-color: white;
		box-shadow: 0 0 9px 0 rgba( 0, 0, 0, 0.3 );
		padding: 0;
		display: flex;
	}

	.modal_content_login .modal-header
	{
		border-bottom: none;
		margin:auto;
		align-items: center;
	}

	.modal_content_login h2
	{
		font-size: 1.75em;
	}

	.modal_content_login .close
	{
		position: absolute;
		top: 0.75em;
		right: 0.75em;
		color: black;
		opacity: 1;
		transform: none;
		padding: 0.25em;
		outline:none;
	}

	.modal_content_login .close_italic
	{
		font-size:1.25em;
	}

	.modal_content_login .modal-body
	{
		padding: 1.5em;
	}

	.modal_content_login table
	{
		width: 100%;
		border: none;
		margin-bottom: 20px;
	}

	.modal_content_login tr
	{
		padding: 0;
		border: 0.075em solid black;
	}

	.modal_content_login td
	{
		vertical-align: middle;
		padding: 0.5em;
	}

	.modal_content_login .label_cell
	{
		background-color: rgba( 50, 116, 214, 1.0 );
		text-align: center;
		width: 3.1em;
	}

	.modal_content_login label
	{
		text-align: center;
		font-size: 1.5em;
		color: white;
	}

	.modal_content_login .input_cell
	{
		display:flex;
		flex-direction:row;
	}

	.modal_content_login input
	{
		border: none;
		outline: 0;
		font-size: 1.5em;
		width: 100%;
	}

	.modal_content_login .button_cell
	{
		background-color: rgba( 230, 230, 230, 1.0 );
		text-align: center;
		width: 3.1em;
	}

	.modal_content_login .button_cell button
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

	.modal_content_login .message_login
	{
		text-align: center;
		font-size: 0.8em;
		color: red;
		margin: auto;
		display: none;
	}

	.modal_content_login form input[type="submit"]
	{
		width: 100%;
		padding: 0.5em;
		margin-top: 0.5em;
		background-color: rgba( 36, 139, 208, 1.00 );
		border: 0;
		cursor: pointer;
		font-weight: bold;
		font-size: 1.5em;
		color: qhite;
		transition: background-color 0.2s;
	}

	.modal_content_login form input[type="submit"]:hover
	{
		background-color: rgba( 63, 184, 39, 1.00 );
		transition: background-color 0.2s;
		color: white;
	}
</style>

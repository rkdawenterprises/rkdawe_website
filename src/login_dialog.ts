
import Login_dialog from './Login_dialog.svelte';

( window as any ).login_dialog_component = ( options: any ) =>
{
	return new Login_dialog( options );
};


import Main_menu from './Main_menu.svelte';

( window as any ).main_menu_component = ( options: any ) =>
{
	return new Main_menu( options );
};

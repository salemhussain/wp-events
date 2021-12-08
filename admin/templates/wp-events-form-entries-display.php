<?php
/**
 * Provide a Form Entries view for the plugin.
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       //allmarketingsolutions.co.uk
 * @since      1.0.0
 *
 * @package    Wp_Events
 * @subpackage Wp_Events/admin/templates
 */
?>
<h1><?php
	_e( 'WP Events Entries', 'wp-events' ) ?>
</h1> 
<?php wpe_go_back_link(); ?>
<div class="wrapper">
	<?php
	global $wpe_entries_tab;
	$wpe_entries_tab = isset( $_GET['tab'] ) ? $_GET['tab'] : 'registrations'; 
	?>
    <form id="wpe-list-form" method="get">
        <input type="hidden" name="post_type" class="post_type_page" value="wp_events">
        <input type="hidden" name="page" value="<?php
		echo $_REQUEST['page'] ?>">
		<input type="hidden" name="tab" value="<?php
		echo $wpe_entries_tab; ?>">
        <input type="hidden" name="display" value="<?php
	    echo isset( $_GET['display'] ) ? $_GET['display'] : 'all'; ?>">
        <h2 class="nav-tab-wrapper">
			<?php
			//To hook function wpe_admin_entries_tab.
			do_action( 'wp_events_entries_tab' );
			?>
        </h2>
		<?php
		//To hook function wpe_display_entries_table.
		do_action( 'wp_events_entries_table' ); ?>
    </form>
</div>

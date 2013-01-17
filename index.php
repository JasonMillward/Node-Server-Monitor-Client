<?php
/**
 * Simple config file for jCode Lab
 *
 *
 * Released under the MIT license
 *
 * @copyright  2012 jCode
 * @category   config
 * @version    $Id$
 * @author     Jason Millward <jason@jcode.me>
 * @license    http://opensource.org/licenses/MIT
 * @package    jCode Lab
 */

require_once( dirname( __FILE__ ) . '/../config.php' );
require_once( COMMON_PHP . '/jCode_Custom/jTPL.php');

// New jTPL class
$smarty = new jTPL( TEMPLATE_DIR );

// Time to do some grunt work
try {

} catch ( Exception $e ) {

}

$footers = array(
    '<script src="http://code.highcharts.com/highcharts.js"></script>',
    '<script src="http://code.highcharts.com/modules/exporting.js"></script>​',
    '<script src="../assets/js/serverStatus-front.js"></script>'
);

// Assign the variables
$smarty->assign('host',    $_SERVER['HTTP_HOST']);
$smarty->assign('footers', $footers);

// Display the page
$smarty->display('header.tpl');
$smarty->display('serverStatus/status.tpl');
$smarty->display('footer.tpl');

?>

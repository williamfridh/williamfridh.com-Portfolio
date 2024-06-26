<?php

// Get the requested URI
$request_uri = $_SERVER['REQUEST_URI'];

// Check if the request is for Yoast SEO sitemap
if (strpos($request_uri, 'sitemap.xml') !== false) {
    // Allow WordPress to handle the request
    require_once( ABSPATH . 'wp-load.php' );
    $wp->init();
    $wp->parse_request();
    $wp->query_posts();
    $wp->register_globals();
    $wp->send_headers();
    $wp->main();
    exit;
} else {
    // Display 404 error message
    status_header( 404 );
    echo '<h1>404 Not Found</h1>';
    echo '<p>Don\'t be a bad banana! The page you are looking for does not exist.</p>';
    exit;
}
?>

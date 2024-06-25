<?php
/**
 * Redirection Theme functions and definitions.
 * This is only required for making the theme compatible with the WordPress REST API.
 * 
 * SRC: https://github.com/wp-graphql/wp-graphql/issues/2103
 */

add_action('after_setup_theme', 'theme_setup');
function theme_setup() {
	// Add support for post thumbnails
	add_theme_support('post-thumbnails');
}

add_filter('graphql_data_is_private', function ($is_private, $model_name, $data, $visibility, $owner, $current_user) {

	if ('MenuObject' === $model_name || 'MenuItemObject' === $model_name) {
		return false;
	}

  	return $is_private;
}, 10, 6);

/*
 * Replacing domain for sitemap index if youre using WP headless 
 * and WP_SITEURL & WP_HOME are not the same domain.
 * 
 * SRC: https://gist.github.com/jordanmaslyn/7e28423ef43cdb6af068f5f192077746#file-functions-php-L8-L11
 */
function filter_wpseo_sitemap_index_links( $links ) {
	$home = parse_url(get_option('home'));
	$site = parse_url(get_option('siteurl'));
	foreach($links as $i => $link)
	  $links[$i]['loc'] = str_replace($home, $site, $link['loc']);
	return $links; 
  }; 
  add_filter( 'wpseo_sitemap_index_links', 'filter_wpseo_sitemap_index_links', 10, 1 );


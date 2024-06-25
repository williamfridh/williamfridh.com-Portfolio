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

    // Add support for custom logo
    add_theme_support('custom-logo', array(
        'height'      => 512,
        'width'       => 512,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // Add support for site icon (favicon)
    add_theme_support('site_icon');
	
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

/**
 * Add custom field for logo to the REST API.
 */
add_action('graphql_register_types', 'register_custom_logo_graphql_field');
function register_custom_logo_graphql_field() {
    register_graphql_field('RootQuery', 'customLogoUrl', [
        'type' => 'String',
        'description' => 'URL of the custom logo.',
        'resolve' => function() {
            $custom_logo_id = get_theme_mod('custom_logo');
            if (!$custom_logo_id) {
                return null;
            }
            $logo = wp_get_attachment_image_src($custom_logo_id, 'full');
            if (!is_array($logo) || !isset($logo[0])) {
                return null;
            }
            return $logo[0];
        },
    ]);
}

/**
 * Add custom field for site icon to the REST API.
 */
add_action('graphql_register_types', 'register_site_icon_graphql_field');
function register_site_icon_graphql_field() {
	register_graphql_field('RootQuery', 'siteIconUrl', [
		'type' => 'String',
		'description' => 'URL of the site icon.',
		'resolve' => function() {
			$site_icon_id = get_option('site_icon');
			if (!$site_icon_id) {
				return null;
			}
			$icon = wp_get_attachment_image_src($site_icon_id, 'full');
			if (!is_array($icon) || !isset($icon[0])) {
				return null;
			}
			return $icon[0];
		},
	]);
}
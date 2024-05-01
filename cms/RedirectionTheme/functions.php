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


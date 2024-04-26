<?php
/**
 * Redirection Theme functions and definitions.
 * This is only required for makeing the theme compatible with the WordPress REST API.
 * 
 * SRC: https://github.com/wp-graphql/wp-graphql/issues/2103
 */
add_filter('graphql_data_is_private', function ($is_private, $model_name, $data, $visibility, $owner, $current_user) {

	if ('MenuObject' === $model_name || 'MenuItemObject' === $model_name) {
		return false;
	}

	return $is_private;
}, 10, 6);


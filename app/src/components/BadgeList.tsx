import React from 'react'
import PropTypes from 'prop-types'
import Icon from './icon'

interface BadgeListProps {
	badgeList: string
}

const BadgeList: React.FC<BadgeListProps> = ({ badgeList }) => {
	if (typeof badgeList !== 'string')
		return null

	const badges = badgeList.split(/, |,/).sort()

	return (
		<div className='text-zero leading-none'>
			{badges.map((name) => (
				<span className='inline-block mr-2 mt-2' key={name}>
					<Icon name={name} />
				</span>
			))}
		</div>
	)
}

BadgeList.propTypes = {
	badgeList: PropTypes.string.isRequired,
}

export default BadgeList
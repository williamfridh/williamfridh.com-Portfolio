import React from 'react';
import Icon from './icon';

interface BadgeListProps {
  badgeList: string;
}

const BadgeList: React.FC<BadgeListProps> = ({ badgeList }) => {
  return (
    <div className='text-zero leading-none'>
      {badgeList.split(/, |,/).sort().map((name, key) => (
        <span className='inline-block mr-2 mt-2' key={key}>
          <Icon name={name} />
        </span>
      ))}
    </div>
  );
};

export default BadgeList;


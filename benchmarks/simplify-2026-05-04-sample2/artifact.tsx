// UserCard.tsx - over-abstracted React component, ~10 simplifications
// DO NOT FIX

import React, { useMemo, useCallback, FC } from 'react';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onSelect?: (id: string) => void;
}

// over-engineered factory for a single component
function createUserCardComponent(): FC<UserCardProps> {
  return function UserCard({ user, onSelect }) {
    // useMemo for trivial concat
    const displayName = useMemo(() => {
      return user.name + ' (' + user.email + ')';
    }, [user.name, user.email]);

    // useCallback for one-line handler that's never passed to memoized child
    const handleClick = useCallback(() => {
      if (onSelect) {
        onSelect(user.id);
      }
    }, [onSelect, user.id]);

    // unnecessary wrapper functions
    const renderAvatar = () => {
      return user.avatar ? <img src={user.avatar} alt="avatar" /> : null;
    };

    const renderName = () => {
      return <span className="name">{displayName}</span>;
    };

    return (
      <div className="user-card" onClick={handleClick}>
        {renderAvatar()}
        {renderName()}
      </div>
    );
  };
}

// only one place uses this, factory pattern unnecessary
export const UserCard = createUserCardComponent();

// dead helper — never imported
export function userCardClassName(active: boolean): string {
  return active ? 'user-card user-card-active' : 'user-card';
}

// over-typed: this just returns its arg
export function passThroughUser<T extends { id: string }>(u: T): T {
  return u;
}

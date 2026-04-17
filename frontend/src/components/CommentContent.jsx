import React from 'react';
import { Link } from 'react-router-dom';
import UserTooltip from './UserTooltip';

/**
 * Render comment content với @mentions clickable → navigate tới profile + UserTooltip
 */
const CommentContent = ({ content, mentions = [], className = '' }) => {
  if (!content) return null;

  // Build map username (lowercase) → mention data
  const mentionMap = {};
  mentions.forEach(m => {
    if (m.username) {
      mentionMap[m.username.toLowerCase()] = m;
    }
  });

  // Parse content: split by @username patterns
  const parts = [];
  const regex = /@([a-zA-Z0-9_-]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }

    const username = match[1];
    const mentionData = mentionMap[username.toLowerCase()];

    if (mentionData) {
      const userId = mentionData.userId?._id || mentionData.userId;
      parts.push({
        type: 'mention',
        username,
        userId,
        profile: mentionData.userId && typeof mentionData.userId === 'object' ? mentionData.userId : null
      });
    } else {
      parts.push({ type: 'text', value: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (part.type === 'mention') {
          const mentionLink = (
            <Link
              key={i}
              to={`/profile/${part.userId}`}
              className="text-yellow-500 dark:text-yellow-400 font-semibold hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              @{part.username}
            </Link>
          );

          if (part.profile) {
            return (
              <UserTooltip key={i} profile={part.profile} placement="top">
                {mentionLink}
              </UserTooltip>
            );
          }

          return mentionLink;
        }
        return <span key={i}>{part.value}</span>;
      })}
    </p>
  );
};

export default CommentContent;

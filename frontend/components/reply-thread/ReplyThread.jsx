import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Reply from './Reply';

export default function ReplyThread({ postId }) {
  const allRootIds = useSelector(state => state.thread.replyTree.rootIds);
  const repliesById = useSelector(state => state.thread.repliesById);
  
  // Use useMemo to memoize the filtered results
  const rootIds = useMemo(() => {
    return allRootIds.filter(id => repliesById[id].postId === postId);
  }, [allRootIds, repliesById, postId]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Replies</h2>
      {rootIds.map(replyId => (
        <Reply key={replyId} replyId={replyId} />
      ))}
    </div>
  );
}
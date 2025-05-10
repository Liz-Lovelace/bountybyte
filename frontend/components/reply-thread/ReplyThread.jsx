import React from 'react';
import { useSelector } from 'react-redux';
import Reply from './Reply';

export default function ReplyThread({ postId }) {
  const allRootIds = useSelector(state => state.thread.replyTree.rootIds);
  const repliesById = useSelector(state => state.thread.repliesById);

  // Directly filter in render, no useMemo
  const rootIds = allRootIds.filter(id => repliesById[id].postId === postId);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Replies</h2>
      {rootIds.map(replyId => (
        <Reply key={replyId} replyId={replyId} />
      ))}
    </div>
  );
}
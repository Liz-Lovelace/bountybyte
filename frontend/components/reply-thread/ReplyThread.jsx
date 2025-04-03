import React from 'react';
import { useSelector } from 'react-redux';
import Reply from './Reply';
import { selectReplyTree } from '../../store/threadSlice';

function RenderReplyTree({ reply }) {
  const childReplies = reply.children.map(childReply => (
    <RenderReplyTree key={childReply.id} reply={childReply} />
  ));

  return (
    <Reply 
      key={reply.id} 
      reply={reply} 
      childReplies={childReplies}
    />
  );
}

export default function ReplyThread() {
  const replyTree = useSelector(selectReplyTree);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Replies</h2>
      {replyTree.map(reply => (
        <RenderReplyTree key={reply.id} reply={reply} />
      ))}
    </div>
  );
} 
import axios from 'axios';
import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleCommentt(props) {
  const [openReply, setOpenReply] = useState(false);
  const [commentValue, setCommentValue] = useState('');

  const onHandleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const variable = {
      content: commentValue,
      writer: localStorage.getItem('userId'),
      postId: props.videoId,
      responseTo: props.comment._id,
    };
    axios.post('/api/comment/saveComment', variable).then((res) => {
      if (res.data.success) {
        setCommentValue('');
        setOpenReply(!openReply);

        props.refreshFunction(res.data.result);
      } else {
        alert('comment 저장 실패');
      }
    });
  };
  const openReplyFn = () => {
    setOpenReply(!openReply);
  };
  const actions = [
    <LikeDislikes
      userId={localStorage.getItem('userId')}
      commentId={props.comment._id}
    />,
    <span onClick={openReplyFn} key="comment-basic-reply-to">
      Reply to
    </span>,
  ];
  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="image" />}
        content={<p>{props.comment.content}</p>}
      />
      {openReply && (
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
          <TextArea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={onHandleChange}
            value={commentValue}
            placeholder="코멘트를 작성해주세요."
          ></TextArea>
          <br />
          <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleCommentt;

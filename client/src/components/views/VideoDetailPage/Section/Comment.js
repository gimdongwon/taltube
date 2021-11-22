import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import { Button, Input } from 'antd';
import ReplyComment from './ReplyComment';

const { TextArea } = Input;

function Comment(props) {
  const user = useSelector((state) => state.user);
  const videoId = props.postId;
  const [commentValue, SetCommentValue] = useState('');
  const handleChange = (e) => {
    SetCommentValue(e.currentTarget.value);
  };
  const onSubmit = (e) => {
    e.preventDefault(); // refresh 안하기 위한 장치.
    const variable = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId,
    };
    axios.post('/api/comment/saveComment', variable).then((res) => {
      if (res.data.success) {
        SetCommentValue('');
        props.refreshFunction(res.data.result);
      } else {
        alert('comment 저장 실패');
      }
    });
  };
  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />
      {/* CommentLists */}
      {props.commentLists &&
        props.commentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <React.Fragment key={index}>
                <SingleComment
                  comment={comment}
                  postId={videoId}
                  refreshFunction={props.refreshFunction}
                />
                <ReplyComment
                  commentLists={props.commentLists}
                  postId={props.postId}
                  parentCommentId={comment._id}
                  refreshFunction={props.refreshFunction}
                />
              </React.Fragment>
            )
        )}
      {/* Root comment Form */}
      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <TextArea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleChange}
          value={commentValue}
          placeholder="코멘트를 작성해주세요."
        ></TextArea>
        <br />
        <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Comment;

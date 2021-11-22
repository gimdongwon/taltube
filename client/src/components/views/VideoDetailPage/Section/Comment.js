import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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
      writer: localStorage.getItem('userId'),
      postId: videoId,
    };
    axios.post('/api/comment/saveComment', variable).then((res) => {
      if (res.data.success) {
        console.log(res.data.result);
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
      {/* Root comment Form */}
      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleChange}
          value={commentValue}
          placeholder="코멘트를 작성해주세요."
        ></textarea>
        <br />
        <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;

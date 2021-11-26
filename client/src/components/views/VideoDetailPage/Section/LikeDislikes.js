import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import axios from 'axios';

const LikeDislikes = (props) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDisLikes] = useState(0);
  const [likesAction, setLikesAction] = useState(null);
  const [disLikesAction, setDisLikesAction] = useState(null);
  let variable = {};
  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    axios.post('/api/like/getLikes', variable).then((res) => {
      if (res.data.success) {
        // console.log(res.data.likes);

        // 얼마나 많은 좋아요를 받앗는지
        setLikes(res.data.likes.length);
        // 내가 이미 좋아요를 눌렀는지
        res.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikesAction('liked');
          }
        });
      } else {
        alert('likes정보를 가져오지 못했다리');
      }
    });

    axios.post('/api/like/getDisLikes', variable).then((res) => {
      if (res.data.success) {
        // console.log(res.data.likes);

        // 얼마나 많은 좋아요를 받앗는지
        setDisLikes(res.data.dislikes.length);
        // 내가 이미 좋아요를 눌렀는지
        res.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDisLikesAction('disliked');
          }
        });
      } else {
        alert('dislikes정보를 가져오지 못했다리');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLike = () => {
    if (likesAction === null) {
      axios.post('/api/like/upLike', variable).then((res) => {
        if (res.data.success) {
          setLikes(likes + 1);
          setLikesAction('liked');
          if (disLikesAction) {
            setDisLikesAction(null);
            setDisLikes(dislikes - 1);
          }
        } else {
          alert('like action 실패');
        }
      });
    } else {
      axios.post('/api/like/unLike', variable).then((res) => {
        if (res.data.success) {
          setLikes(likes - 1);
          setLikesAction(null);
        } else {
          alert('unlike action 실패');
        }
      });
    }
  };
  const onDisLike = () => {
    if (disLikesAction === null) {
      axios.post('/api/like/upDisLike', variable).then((res) => {
        if (res.data.success) {
          setDisLikes(dislikes + 1);
          setDisLikesAction('disliked');
          if (likesAction) {
            setLikesAction(null);
            setLikes(likes - 1);
          }
        } else {
          alert('like action 실패');
        }
      });
    } else {
      axios.post('/api/like/unDisLike', variable).then((res) => {
        if (res.data.success) {
          setDisLikes(dislikes - 1);
          setDisLikesAction(null);
        } else {
          alert('unDislike action 실패');
        }
      });
    }
  };

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={likesAction === 'liked' ? 'filled' : 'outlined'}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{likes}</span>
      </span>
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={disLikesAction === 'disliked' ? 'filled' : 'outlined'}
            onClick={onDisLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{dislikes}</span>
      </span>
    </div>
  );
};

export default LikeDislikes;

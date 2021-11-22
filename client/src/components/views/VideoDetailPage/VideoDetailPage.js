import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';
import SideVideo from './Section/SideVIdeo';
import Subscriber from './Section/Subscriber';
import Comment from './Section/Comment';

function VideoDetailPage(props) {
  const [videoDetail, setVideoDetail] = useState([]);

  const [commentLists, setCommentLists] = useState([]);

  const videoId = props.match.params.videoId;
  const variable = { videoId };
  useEffect(() => {
    axios.post('/api/video/getVideoDetail', variable).then((res) => {
      if (res.data.success) {
        setVideoDetail(res.data.videoDetail);
      } else {
        alert('failed get videos info');
      }
    });
    axios.post('/api/comment/getComments', variable).then((res) => {
      if (res.data.success) {
        setCommentLists(res.data.comments);
      } else {
        alert('comment 불러오기 실패');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateComment = (newComment) => {
    setCommentLists(commentLists.concat(newComment));
  };
  if (videoDetail.writer) {
    const subscribeButton = videoDetail.writer._id !==
      localStorage.getItem('userId') && (
      <Subscriber
        userTo={videoDetail.writer._id}
        userFrom={localStorage.getItem('userId')}
      />
    );
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: '100%', padding: '3rem 4rem' }}>
            <video
              style={{ width: '100%' }}
              src={`http://localhost:5000/${videoDetail.filePath}`}
              controls
            />
            <List.Item actions={[subscribeButton]}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={videoDetail.writer && videoDetail.writer.image}
                  />
                }
                title={videoDetail.title}
                description={videoDetail.description}
              />
            </List.Item>
            {/* comments */}
            <Comment
              postId={videoDetail._id}
              commentLists={commentLists}
              refreshFunction={updateComment}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>...loading</div>;
  }
}

export default VideoDetailPage;

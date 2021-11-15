import React, { useEffect, useState } from 'react';
import { Row, Col, List } from 'antd';
import axios from 'axios';

function VideoDetailPage(props) {
  const [videoDetail, setVideoDetail] = useState([]);
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
  });
  if (videoDetail.writer) {
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: '100%', padding: '3rem 4rem' }}>
            <video
              style={{ width: '100%' }}
              src={`http://localhost:5000/${videoDetail.filePath}`}
              controls
            />
            <List.Item actions>
              <List.Item.Meta
                avatar={videoDetail.writer.image}
                title={videoDetail.writer.name}
                description={videoDetail.description}
              />
            </List.Item>
            {/* comments */}
          </div>
        </Col>
        <Col lg={6} xs={24}>
          Side
        </Col>
      </Row>
    );
  } else {
    return <div>...loading</div>;
  }
}

export default VideoDetailPage;

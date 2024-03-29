import axios from 'axios';
import React, { useEffect, useState } from 'react';

function SideVideo() {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    axios.get('/api/video/getVideos').then((res) => {
      if (res.data.success) {
        setVideos(res.data.videos);
      } else {
        alert('faild to get side videos');
      }
    });
  }, []);
  const renderSideVideo = videos.map((video, idx) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);
    return (
      <div
        style={{ display: 'flex', marginTop: '1rem', padding: '0 2rem' }}
        key={idx}
      >
        <div style={{ width: '40%', marginRight: '1rem' }}>
          <a href={`/video/${video._id}`} style={{ color: 'gray' }}>
            <img
              style={{ width: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
          </a>
        </div>

        <div style={{ width: '50%' }}>
          <a href={`/video/${video._id}`} style={{ color: 'gray' }}>
            <span style={{ fontSize: '1rem', color: 'black' }}>
              {video.title}{' '}
            </span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views} views</span>
            <br />
            <span>
              {minutes} : {seconds}
            </span>
            <br />
          </a>
        </div>
      </div>
    );
  });
  return <>{renderSideVideo}</>;
}

export default SideVideo;

import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Subscribe(props) {
  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(0);
  useEffect(() => {
    const variable = {
      userTo: props.userTo,
    };
    axios.post('/api/subscribe/subscribeNumber', variable).then((res) => {
      if (res.data.success) {
        setSubscribeNumber(res.data.subscribeNumber);
      } else {
        alert('구독자 정보를 가져오지 못했습니다.');
      }
    });
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem('userId'),
    };
    axios.post('/api/subscribe/subscribed', subscribedVariable).then((res) => {
      if (res.data.success) {
        setSubscribed(res.data.subscribed);
      } else {
        alert('구독 정보를 받아오지 못했습니다.');
      }
    });
  }, [props.userFrom, props.userTo]);
  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribe ? '#CC0000' : '#CC0000'}`,
          color: 'white',
          borderRadius: '4px',
          padding: '10px 16px',
          fontWeight: '500',
          fontSize: '1rem',
          textTransform: 'uppercase',
        }}
        onClick
      >
        {subscribeNumber} {setSubscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
}

export default Subscribe;

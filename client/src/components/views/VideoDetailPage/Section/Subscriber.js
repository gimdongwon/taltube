import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Subscriber(props) {
  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const userTo = props.userTo;
  const userFrom = props.userFrom;

  useEffect(() => {
    const variable = {
      userTo: userTo,
      userFrom: userFrom,
    };

    axios.post('/api/subscribe/subscribeNumber', variable).then((res) => {
      if (res.data.success) {
        setSubscribeNumber(res.data.subscribeNumber);
      } else {
        alert('구독자 정보를 가져오지 못했습니다.');
      }
    });

    axios.post('/api/subscribe/subscribed', variable).then((res) => {
      if (res.data.success) {
        setSubscribed(res.data.subscribed);
      } else {
        alert('구독 정보를 받아오지 못했습니다.');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubscribe = () => {
    const subscribeVariable = {
      userTo: userTo,
      userFrom: userFrom,
    };
    if (subscribed) {
      axios
        .post('/api/subscribe/unSubscribe', subscribeVariable)
        .then((res) => {
          if (res.data.success) {
            setSubscribeNumber(subscribeNumber - 1);
            setSubscribed(!subscribed);
          } else {
            alert('구독 취소하기에 실패하였습니다.');
          }
        });
    } else {
      axios.post('/api/subscribe/subscribe', subscribeVariable).then((res) => {
        if (res.data.success) {
          setSubscribeNumber(subscribeNumber + 1);
          setSubscribed(!subscribed);
        } else {
          alert('구독하기에 실패하였습니다.');
        }
      });
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${subscribed ? '#CC0000' : '#CC0000'}`,
          color: 'white',
          borderRadius: '4px',
          padding: '10px 16px',
          fontWeight: '500',
          fontSize: '1rem',
          textTransform: 'uppercase',
        }}
        onClick={onSubscribe}
      >
        {subscribeNumber} {setSubscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
}

export default Subscriber;

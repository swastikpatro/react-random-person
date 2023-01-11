import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  FaEnvelopeOpen,
  FaUser,
  FaCalendarTimes,
  FaMap,
  FaPhone,
  FaLock,
} from 'react-icons/fa';

interface personType {
  name: string;
  email: string;
  birthday: string;
  address: string;
  phone: string;
  image: string;
  password: string;
}

const buttons = [
  {
    label: 'name',
    icon: <FaUser />,
  },
  {
    label: 'email',
    icon: <FaEnvelopeOpen />,
  },
  {
    label: 'birthday',
    icon: <FaCalendarTimes />,
  },
  {
    label: 'address',
    icon: <FaMap />,
  },
  {
    label: 'phone',
    icon: <FaPhone />,
  },
  {
    label: 'password',
    icon: <FaLock />,
  },
];

const url = 'https://randomuser.me/api/';
const defaultImg =
  'https://tse4.explicit.bing.net/th?id=OIP.gTxm3MVzU8c1CHrdAa6jrQHaHa&pid=Api&P=0';

function App() {
  // const [person, setPerson] = useState(null);
  const [title, setTitle] = useState<string>('name');

  async function getPerson() {
    const {
      data: { results },
    } = await axios(url);

    const {
      name: { first, last },
      phone,
      email,
      picture: { large: image },
      location: {
        street: { number: streetNum, name: streetName },
      },
      login: { password },
    } = results[0];

    let {
      dob: { date },
    } = results[0];

    date = date.slice(0, 10).split('-').reverse().join('/');

    const newPerson = {
      name: `${first} ${last}`,
      email,
      birthday: date,
      address: `${streetNum} ${streetName}`,
      phone,
      image,
      password,
    };

    return newPerson;
  }

  const queryObj = useQuery({
    queryKey: ['randomPersonInfo'],
    queryFn: getPerson,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const { data: person, isLoading, refetch, isRefetching } = queryObj;

  console.log({ person, isLoading });

  function handleContainerClick(e: React.MouseEvent<HTMLDivElement>): void {
    const targetEle = e.target as HTMLElement;
    const iconClickedEle = targetEle.closest('.icon') as HTMLButtonElement;
    if (!iconClickedEle) {
      return;
    }

    const iconTitle = iconClickedEle.dataset.label!;

    // console.log(personObj);

    setTitle(iconTitle);
  }

  if (isLoading || isRefetching) {
    return (
      <main>
        <div className='block bcg-black'></div>
        <div className='block'></div>
        <div className='container'>
          <img src={defaultImg} alt='random user' className='user-img' />
          <div className='loading-container'>
            <div className='loader'></div>
          </div>
          <div className='values-list'>
            {buttons.map((singleBtn) => {
              return (
                <button
                  className='icon'
                  key={singleBtn.label}
                  data-label={singleBtn.label}
                >
                  {singleBtn.icon}
                </button>
              );
            })}
          </div>

          <button className='styled-btn'>Loading...</button>
        </div>
      </main>
    );
  }

  // @ts-ignore
  const value = person && person[title];

  return (
    <main>
      <div className='block bcg-black'></div>
      <div className='block'></div>
      <div className='container'>
        <img
          src={person?.image ?? defaultImg}
          alt='random user'
          className='user-img'
        />
        <p className='user-title'>My {title} is</p>

        <p className='user-value'>{value}</p>
        <div className='values-list' onClick={handleContainerClick}>
          {buttons.map((singleBtn) => {
            return (
              <button
                className={singleBtn.label === title ? 'icon active' : 'icon'}
                key={singleBtn.label}
                data-label={singleBtn.label}
              >
                {singleBtn.icon}
              </button>
            );
          })}
        </div>

        <button
          className='styled-btn'
          onClick={() => {
            setTitle('name');
            refetch();
          }}
        >
          Random User
        </button>
      </div>
    </main>
  );
}

export default App;

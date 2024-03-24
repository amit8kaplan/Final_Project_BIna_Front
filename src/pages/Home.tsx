import React, { useEffect, useState, useRef } from 'react';
import {  homepagephoto } from '../services/rest_api_photos';
import 'bootstrap/dist/css/bootstrap.min.css';

export function Home() {
  const [randomPhoto, setRandomPhoto] = useState<string>('');
  const isMounted = useRef<boolean>(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      getPhoto();
    }
  }, []);

  const getPhoto = async () => {
    console.log('Getting photo');
    try {
      const photo = await homepagephoto("book,library,study,education,learning");
      setRandomPhoto(photo);
    } catch (error) {
      console.error('Error fetching random photo:', error);
    }
  }

  return (
    <div className="container-fluid p-0 position-relative vh-100">
      {randomPhoto && (
        <div className="position-absolute top-0 start-0 h-100 w-100">
          <img src={randomPhoto} alt="Random" className="img-fluid position-absolute top-0 start-0 h-100 w-100 blur" style={{ objectFit: 'cover' }} />
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
            <div className="bg-transparent text-body" style={{ backdropFilter: 'blur(60px)' }}>
              <h1>Welcome to our course platform!</h1>
              <p className="lead">Here you can find a variety of courses to enhance your knowledge.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

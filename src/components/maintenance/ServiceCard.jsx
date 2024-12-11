import React from 'react';
import { useNavigate } from 'react-router-dom';
import mold_shop from '../../img/mold_shop.jpg'
import slide3 from '../../img/slide3.jpg'
import slide4 from '../../img/slide4.jpg'
const ServiceCard = () => {
  const cardData = [
    {
      image: mold_shop,
      title: 'คุณภาพดี',
      description: ' สร้างสรรค์นวัตกรรม เทคโนโลยีทันสมัย ใส่ใจคุณภาพ',
      updatedTime: ''
    },
    {
      image: slide3,
      title: 'ตรงต่อเวลา',
      description: 'รวดเร็วและแม่นยำ ',
      updatedTime: 'Last updated 10 mins ago'
    },
    {
      image: slide4,
      title: 'ราคาประหยัด',
      description: 'มีวินัย ใส่ใจปัญหา และราคาย่อมเยาน์',
      updatedTime: 'Last updated 15 mins ago'
    }
  ];

  return (
    <div className="row   px-0 justify-content-center align-items-center  " style={{gap:'3rem'}}  >
      {cardData.map((card, index) => (
        <div key={index} className="card  col-10 col-md-3  p-0 rounded-4" style={{ height: '18rem', minHeight:'12rem', background:'none', color:'white' }}>
          <img
            src={card.image}
            className="card-img rounded-4"
            alt={card.title}
            style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%',overflow:'hidden' }}
          />
          <div className="card-img-overlay p-4">
            <h5 className="card-title">{card.title}</h5>
            <p className="card-text">{card.description}</p>
            <p className="card-text"><small>{card.updatedTime}</small></p>
          </div>
        </div>
      ))}
        <style>{`
    
    .card:hover img {
          animation: zoom-out ;
           animation-duration: 1.5s;
          animation-fill-mode: both;
        }

        /* Keyframes สำหรับ zoom out */
        @keyframes zoom-out {
          from {
            opacity:0.5;
            transform: scale(1.5); /* เริ่มจาก zoom in */
          }
          to {
           opacity:1;
            transform: scale(1); /* กลับมาขนาดปกติ */
          }

        }
     .card{
     overflow:hidden;}

 
  `}</style>
    </div>
  );

};

export default ServiceCard;
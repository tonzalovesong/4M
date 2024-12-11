import logo_snc from '../../img/logo_snc.jpg';
import logo_snc2 from '../../img/logo_snc2.jpg';

const HeroSlider = ({darkMode}) => {
  const fadeInDownKeyframes = `
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: scale(3);
    }
    to {
      opacity: ${darkMode ? 0.5 : 1};
      transform: scale(1);
    }
  }
`;

const fadeInUpKeyframes = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }
    to {
      opacity: ${darkMode ? 0.5 : 1};
      transform: translate3d(0, 0, 0);
    }
  }
`;
  const slidesConfig = [
    {
      image: logo_snc,
      title: "SNC B2",
      subtitle: "บริการซ่อมบำรุงครบวงจร",
      engSubtitle: "Complete Maintenance Services",
    },
    {
      image: logo_snc2,
      title: "SNC ",
      subtitle: "ทีมงานมืออาชีพ",
      engSubtitle: "Expert Maintenance Staff",
    },
  ];

  return (
    <div id="carouselExampleCaptions" className="carousel slide rounded" data-bs-ride="carousel">
    {/* Indicators */}
    <div className="carousel-indicators">
      {slidesConfig.map((_, index) => (
        <button key={index} type="button" data-bs-target="#carouselExampleCaptions"data-bs-slide-to={index} className={index === 0 ? "active" : ""}
          aria-current={index === 0 ? "true" : "false"}
          aria-label={`Slide ${index + 1}`}
        ></button>
      ))}
    </div>

    {/* Slides */}
    <div className="carousel-inner">
      {slidesConfig.map((slide, index) => (
        <div
          className={`carousel-item ${index === 0 ? "active" : ""}`}
          key={index}
        >
          <img src={slide.image} className={`d-block w-100 ${index === 0 ? 'animate-fade-in-down' : 'animate-fade-in-up'}`} alt={slide.title}
            style={{objectFit: "cover",  
              objectPosition: "center"  }}
          />
          <div className="carousel-caption  "   style={{
    backdropFilter: "blur(3px)", // ความเบลอของพื้นหลัง
    // เพิ่มสีพื้นหลังพร้อมความโปร่งแสง
    borderRadius: "15px", // ทำให้มุมโค้งมน
    
  }}>
            <h5 className='fs-1 ' style={{color: darkMode ? "white" : "#3C3D37",}}>
           {slide.title}</h5>
            <p  className='fs-3'  style={{color: darkMode ? "white" : "#3C3D37",}}>{slide.subtitle}</p>
            <p  className='fs-3'  style={{color: darkMode ? "white" : "#3C3D37",}}>{slide.engSubtitle}</p>
          </div>
        </div>
      ))}
    </div>
<button className="carousel-control-prev" type="button"data-bs-target="#carouselExampleCaptions"data-bs-slide="prev" >
      <span className="carousel-control-prev-icon" aria-hidden="true" style={{width:'3rem',height:'3rem',color: darkMode ? "white" : "#3C3D37",}}></span>
      <span className="visually-hidden">Previous</span>
</button>
    <button className="carousel-control-next" type="button"data-bs-target="#carouselExampleCaptions"data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true" style={{width:'3rem',height:'3rem'}}></span>
      <span className="visually-hidden">Next</span>
    </button>
    <style>{`
    img{
    height:85vh
    
    }
    
    @media only screen and  (max-width: 768px) {
    img {
      height: 50vh; 
      object-fit: contain; 
    }
    }

    ${fadeInDownKeyframes}
    ${fadeInUpKeyframes}
    
    .animate-fade-in-down {
      animation-name: fadeInDown;
      animation-duration: 1s;
      animation-fill-mode: both;
    }
     .animate-fade-in-up {
      animation-name: fadeInUp;
      animation-duration: 1s;
      animation-fill-mode: both;
    }
      .carousel-inner {
  height: auto;
 
}
   
  
   `}</style>
  </div>
  );

};
export default HeroSlider;

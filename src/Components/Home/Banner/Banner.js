import React from 'react';
import "./Banner.css";

const Banner = () => {
    const fadeImages = [
        {
            url: 'https://i.ibb.co/dJ6xtHS/Samsung-Galaxy-S23-Ultra-Camera-top-slider2.jpg',
            caption: "Capture your moments with samsung"

        },
        {
            url: "https://i.ibb.co/T1vcyMv/Samsung-top-slider1-1.jpg",
            caption: "Unleash your power with samsung"

        },
        {
            url: "https://i.ibb.co/kxT206F/oppo-top-slider2.png",
            caption: "Increase productivity with oppo reno"

        },
        {
            url: "https://i.ibb.co/ZJD9WDw/oppo-top-slider1.jpg",
            caption: "Live with next generation smartphone oppo"
        }
    ]
    return (
        <div className='container-fluid p-3 bg-dark'>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <div className='sliderDiv'>
                        <div id="carouselExampleDark" className="carousel carousel-dark slide">
                            <div className="carousel-indicators">
                                {
                                    fadeImages.map((item, index)=><button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to={index} key={index} className={index===0? "active":""}></button>)
                                }
                            </div>
                            <div className="carousel-inner">
                                
                                {
                                    fadeImages.map((item, index)=><div className={`carousel-item ${index===0 && "active"}`} data-bs-interval="10000" key={index}>
                                    <img src={item.url} className="d-block w-100" alt="" />
                                    <div className="carousel-caption d-md-block">
                                        <h5 className='text-white fw-bold'>{item.caption}</h5>
                                    </div>
                                </div>)
                                }
                                
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
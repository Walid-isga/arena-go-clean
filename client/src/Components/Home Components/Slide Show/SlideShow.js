import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { Carousel } from 'bootstrap';
import soccerField from "../Assets/soccer.png";
import basketballField from "../Assets/basketball.png";
import tennisField from "../Assets/tennis.png";
import rugbyField from "../Assets/rugby.png";
import "./SlideShow.css";

export default function SlideShow(){

    useEffect(() => {
        const carousel = new Carousel(document.getElementById('carouselExampleCaptions'), {
          interval: 5000, 
        });
    }, []);

    return(
        <>
            <div id="carouselExampleCaptions" className="carousel slide slideshow" data-bs-ride="carousel" data-bs-interval="5000">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
                </div>
                <div className="carousel-inner">
                    <div class="carousel-item active">
                        <img src={soccerField} className="d-block w-100 slideshowimage" alt="Soccer Fields" />
                        <div class="carousel-caption d-none d-md-block">
                            <h5 className="fieldtype">Soccer</h5>
                    
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={basketballField} className="d-block w-100 slideshowimage" alt="Basketball Fields"/>
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="fieldtype">Basketball</h5>
                            
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={tennisField} className="d-block w-100 slideshowimage" alt="Tennis Fields"/>
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="fieldtype">Tennis</h5>
                            
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src={rugbyField} class="d-block w-100 slideshowimage" alt="Rugby Fields"/>
                        <div className="carousel-caption d-none d-md-block">
                            <h5 className="fieldtype">Rugby</h5>
                        
                        </div>
                    </div>
    
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </>
    );
}

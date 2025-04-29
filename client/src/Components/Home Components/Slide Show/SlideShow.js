// src/Components/Home Components/Slide Show/SlideShow.js

import React, { useEffect } from "react";
import { Carousel } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import soccerField from "../Assets/soccer.png";
import basketballField from "../Assets/basketball.png";
import tennisField from "../Assets/tennis.png";
import rugbyField from "../Assets/rugby.png";

import "./SlideShow.css"; // ✅ important

export default function SlideShow() {

  useEffect(() => {
    const carousel = new Carousel(document.getElementById('carouselExampleCaptions'), {
      interval: 5000,
      pause: "hover",
      ride: "carousel",
    });
  }, []);

  return (
    <div id="carouselExampleCaptions" className="carousel slide slideshow" data-bs-ride="carousel">
      <div className="carousel-inner">

        <div className="carousel-item active">
          <div className="slide-overlay">
            <img src={soccerField} className="d-block w-100 slideshowimage" alt="Soccer" />
            <div className="carousel-caption d-none d-md-block">
              <h5 className="fieldtype">Soccer</h5>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <div className="slide-overlay">
            <img src={basketballField} className="d-block w-100 slideshowimage" alt="Basketball" />
            <div className="carousel-caption d-none d-md-block">
              <h5 className="fieldtype">Basketball</h5>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <div className="slide-overlay">
            <img src={tennisField} className="d-block w-100 slideshowimage" alt="Tennis" />
            <div className="carousel-caption d-none d-md-block">
              <h5 className="fieldtype">Tennis</h5>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <div className="slide-overlay">
            <img src={rugbyField} className="d-block w-100 slideshowimage" alt="Rugby" />
            <div className="carousel-caption d-none d-md-block">
              <h5 className="fieldtype">Rugby</h5>
            </div>
          </div>
        </div>

      </div>

      {/* Fleches */}
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./GameStatistics.css";

export default function GameStatistics(props) {
    
    const { sportType, sportIcon, playedGames, width } = props;
    //const formattedWidth = width.toFixed(2);


    return (
        <>
            <div className="game-statistics">
                <div className="header">
                    <h5 className="title">{sportType}</h5>
                    <img className="icon" src={sportIcon} alt="icon" />
                </div>

                <div className="played-games">
                    <p className="labels">Played Games :</p>
                    <p className="data">{playedGames}</p>
                </div>

                <div className="progress-barr">
                    <div className="progress" role="progressbar" aria-label="Example with label" aria-valuenow={width} aria-valuemin="0" aria-valuemax="100">
                        <div className="progress-bar" style={{ width: `${width}%` }}>{width}%</div>
                    </div>
                </div>
            </div>
        </>
    );
}

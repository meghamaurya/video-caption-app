"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState([{ text: "", time: 0 }]);
  const [currentCaption, setCurrentCaption] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [captionError, setCaptionError] = useState("");
  const [timestampError, setTimestampError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const addCaption = () => {
    if (!currentCaption) {
      setCaptionError("Caption text is required.");
      return;
    }
    if (!timestamp) {
      setTimestampError("Timestamp is required.");
      return;
    }
    setCaptions([
      ...captions,
      { text: currentCaption, time: parseFloat(timestamp) },
    ]);
    setCurrentCaption("");
    setTimestamp("");
    setCaptionError("");
    setTimestampError("");
  };

  const setCurrentTimeAsTimestamp = () => {
    if (
      playerRef.current &&
      typeof playerRef.current.getCurrentTime === "function"
    ) {
      const time = playerRef.current.getCurrentTime();
      if (typeof time === "number" && !isNaN(time)) {
        setTimestamp(time.toFixed(2));
      }
    }
  };

  return (
    <div
      className="m-auto flex flex-col gap-5 justify-center items-center bg-gradient-to-r from-teal-100 to-yellow-50"
      style={{ height: "100vh" }}
    >
      <h2 className="py-5 text-blue-700 text-3xl font-bold">
        Video Caption App
      </h2>

      <div className="flex gap-5">
        <div className="flex flex-col gap-5 ">
          {/* Video URL Input */}
          <div>
            <input
              type="text"
              placeholder="Enter video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              style={{ width: "300px", marginRight: "10px" }}
              className="h-10 px-5 py-2 border-amber-300 border-2 rounded-xl text-blue-900 placeholder:text-blue-400"
            />
            <button
              onClick={() => setVideoUrl(videoUrl)}
              className=" text-md px-5 py-2 cursor-pointer rounded-xl text-white bg-blue-500 hover:bg-blue-600"
            >
              Load Video
            </button>
          </div>

          {/* Video Player */}
          {videoUrl && (
            <div style={{ marginTop: "20px", position: "relative" }}>
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                controls
                width="100%"
                style={{ maxWidth: "640px" }}
                height="360px"
              />
              {/* Display Caption */}
              {captions.map((cap, index) =>
                Math.abs(currentTime - cap.time) < 1 ? (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    {cap.text}
                  </div>
                ) : null
              )}
            </div>
          )}

          {/* Caption Input */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter caption"
                  value={currentCaption}
                  onChange={(e) => setCurrentCaption(e.target.value)}
                  style={{ width: "300px", marginRight: "10px" }}
                  className={`${`h-10 px-5 py-2  border-2 rounded-xl text-blue-900  ${
                    captionError
                      ? "border-red-500 placeholder:text-red-500"
                      : "border-amber-300 placeholder:text-blue-400"
                  }`}`}
                  disabled={videoUrl ? false : true}
                />
                {captionError && (
                  <p className="text-red-500 text-xs pt-0.5">{captionError}</p>
                )}
              </div>
              <button
                onClick={addCaption}
                className={`${`text-md px-5 py-2 max-h-10 rounded-xl bg-blue-500  ${
                  videoUrl
                    ? "cursor-pointer hover:bg-blue-600"
                    : "cursor-not-allowed"
                }`}`}
              >
                Add Caption
              </button>
            </div>
            <div className="flex gap-4">
              <div>
                <input
                  type="number"
                  placeholder="Timestamp (seconds)"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  style={{ width: "300px", marginRight: "10px" }}
                  className={`${`h-10 px-5 py-2  border-2 rounded-xl text-blue-900  ${
                    timestampError
                      ? "border-red-500 placeholder:text-red-500"
                      : "border-amber-300 placeholder:text-blue-400"
                  }`}`}
                  disabled={videoUrl ? false : true}
                />
                {timestampError && (
                  <p className="text-red-500 text-xs pt-0.5">
                    {timestampError}
                  </p>
                )}
              </div>
              <button
                onClick={setCurrentTimeAsTimestamp}
                className={`${`text-md px-5 py-2 rounded-xl bg-blue-500  ${
                  videoUrl
                    ? "cursor-pointer hover:bg-blue-600"
                    : "cursor-not-allowed"
                }`}`}
              >
                Set Current Play Time
              </button>
            </div>
          </div>
        </div>
        {/* Display Captions List */}
        {captions.length > 1 && (
          <div
            style={{
              textAlign: "left",
              maxWidth: "640px",
              color: "black",
            }}
            className=""
          >
            <h3 className="text-xl py-5 text-blue-600">All Captions:</h3>
            <ul>
              {captions.map((cap, index) =>
                cap.text ? (
                  <li key={index}>
                    <span className="text-lg py-5 text-amber-400">
                      {cap.time}s
                    </span>{" "}
                    <span className="text-lg py-5 text-blue-600">
                      {" "}
                      - {cap.text}
                    </span>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

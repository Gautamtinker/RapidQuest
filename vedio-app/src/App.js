import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
const { VTTCue } = window;

const App = () => {
  const [video, setVideo] = useState(null);
  const [subtitles, setSubtitles] = useState([]);
  const [vedioid, setvideoid] = useState("");
  const [newSubtitle, setNewSubtitle] = useState({
    start: 0,
    end: 0,
    text: "",
  });
  const playerRef = useRef(null);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setVideo(URL.createObjectURL(file));
  };

  const handleSubtitleAdd = () => {
    setSubtitles((prevSubtitles) => [...prevSubtitles, { ...newSubtitle }]);
    setNewSubtitle({ start: 0, end: 0, text: "" });
  };

  const renderSubtitles = () => {
    if (playerRef.current) {
      const videoElement = playerRef.current.getInternalPlayer();
      const textTrack = videoElement.addTextTrack("captions", "English", "en");

      subtitles.forEach((subtitle) => {
        const cue = new VTTCue(subtitle.start, subtitle.end, subtitle.text);
        textTrack.addCue(cue);
      });
    }
  };

  useEffect(() => {
    renderSubtitles();
  }, [subtitles]);

  const handleSubmit = async () => {
    if (!video || !subtitles) {
      alert("Please first upload video and subtitles");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    const subtitlesJSON = JSON.stringify(subtitles);
    formData.append(
      "subtitles",
      new Blob([subtitlesJSON], { type: "application/json" })
    );

    try {
      const response = await axios.post(
        "http://localhost:3001/uploadVideoAndSubtitles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data.videoId);
      setvideoid(response.data.videoId);
    } catch (error) {
      console.error("Error uploading video and subtitles:", error);
    }
  };
  useEffect(async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/getVideoAndSubtitles",
        {
          params: {
            videoId: vedioid,
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setVideo(response.data.videoFile);
      setSubtitles(response.data.subtitles);
    } catch (e) {
      console.error("Error uploading video and subtitles:", e);
    }
  }, [vedioid]);

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      {video && (
        <>
          <ReactPlayer
            ref={playerRef}
            url={video}
            controls
            config={{
              file: {
                attributes: {
                  crossOrigin: "anonymous",
                },
              },
              tracks: subtitles.map((subtitle, index) => ({
                key: index,
                kind: "captions",
                src: "",
                srcLang: "en",
                label: "English",
                default: index === 0,
                cues: [
                  new VTTCue(
                    subtitle.start,
                    subtitle.start + 120,
                    subtitle.text
                  ),
                ],
              })),
            }}
          />
          <SubtitleEditor
            subtitles={subtitles}
            onSubtitleAdd={handleSubtitleAdd}
            newSubtitle={newSubtitle}
            setNewSubtitle={setNewSubtitle}
          />
          <button onClick={handleSubmit}>Submit</button>
        </>
      )}
    </div>
  );
};

const SubtitleEditor = ({
  subtitles,
  onSubtitleAdd,
  newSubtitle,
  setNewSubtitle,
}) => {
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Subtitle text"
          value={newSubtitle.text}
          onChange={(e) =>
            setNewSubtitle({ ...newSubtitle, text: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Start time (seconds)"
          value={newSubtitle.start}
          onChange={(e) =>
            setNewSubtitle({
              ...newSubtitle,
              start: parseFloat(e.target.value),
            })
          }
        />
        <input
          type="number"
          placeholder="End time (seconds)"
          value={newSubtitle.end}
          onChange={(e) =>
            setNewSubtitle({
              ...newSubtitle,
              end: parseFloat(e.target.value),
            })
          }
        />
        <button onClick={onSubtitleAdd}>Add Subtitle</button>
      </div>
      <div>
        <h3>Existing Subtitles:</h3>
        <ul>
          {subtitles.map((subtitle, index) => (
            <li key={index}>
              {subtitle.start}s - {subtitle.end}s: {subtitle.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

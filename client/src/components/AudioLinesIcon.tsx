// AudioLinesIcon.jsx
const AudioLinesIcon = ({size=48, infinite=false}) => {
  return (
    <>
      <style>
        {`
        .audio-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        ${!infinite ? `.audio-icon:hover .bar` : `.audio-icon .bar`} {
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          transform-origin: center;
          animation: wave 1.2s infinite ease-in-out;
        }

        ${!infinite ? `.audio-icon:hover .bar:nth-child(1)` : `.audio-icon .bar:nth-child(1)`} { animation-delay: 0s; }
        ${!infinite ? `.audio-icon:hover .bar:nth-child(2)` : `.audio-icon .bar:nth-child(2)`} { animation-delay: 0.1s; }
        ${!infinite ? `.audio-icon:hover .bar:nth-child(3)` : `.audio-icon .bar:nth-child(3)`} { animation-delay: 0.2s; }
        ${!infinite ? `.audio-icon:hover .bar:nth-child(4)` : `.audio-icon .bar:nth-child(4)`} { animation-delay: 0.3s; }
        ${!infinite ? `.audio-icon:hover .bar:nth-child(5)` : `.audio-icon .bar:nth-child(5)`} { animation-delay: 0.4s; }
        ${!infinite ? `.audio-icon:hover .bar:nth-child(6)` : `.audio-icon .bar:nth-child(6)`} { animation-delay: 0.5s; }

        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.0); }
        }
        `}
      </style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="audio-icon"
      >
        <path className="bar" d="M2 10v3" />
        <path className="bar" d="M6 6v11" />
        <path className="bar" d="M10 3v18" />
        <path className="bar" d="M14 8v7" />
        <path className="bar" d="M18 5v13" />
        <path className="bar" d="M22 10v3" />
      </svg>
    </>
  );
};

export default AudioLinesIcon;

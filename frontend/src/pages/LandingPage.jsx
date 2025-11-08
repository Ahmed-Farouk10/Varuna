import '../App.css';
import Spline from '@splinetool/react-spline';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="w-full h-screen fixed inset-0 overflow-hidden">
      <Spline
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        scene="https://prod.spline.design/l0-CxSgB4Tm9Qxyz/scene.splinecode"
      />
      <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center z-10 px-4 sm:px-6">
        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-header text-[#A49FFF]/90 drop-shadow-lg font-cool m-0 text-center">
          Varuna
        </h1>
        <Link
          to="/home"
          className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-[#A49FFF] font-bold text-white no-underline hover:text-black font-cool rounded-full text-base sm:text-lg md:text-xl lg:text-2xl hover:bg-[#B8E6D8] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
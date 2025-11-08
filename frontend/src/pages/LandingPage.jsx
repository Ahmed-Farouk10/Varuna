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
      <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center z-10 px-4">
        <h1 className="text-6xl sm:text-8xl md:text-header text-[#A49FFF]/90 drop-shadow-lg font-cool m-0 text-center">
          Varuna
        </h1>
        <Link
          to="/home"
          className="mt-8 px-8 py-4 bg-[#A49FFF] font-bold text-white no-underline hover:text-black font-cool rounded-full text-lg sm:text-xl md:text-2xl hover:bg-[#B8E6D8] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
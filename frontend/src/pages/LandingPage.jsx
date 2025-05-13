import '../App.css';
import Spline from '@splinetool/react-spline';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="w-full h-screen fixed">
      <Spline
        className="absolute w-full h-full pointer-events-none z-0"
        scene="https://prod.spline.design/l0-CxSgB4Tm9Qxyz/scene.splinecode"
      />
      <div className="absolute w-full h-full flex flex-col justify-center items-center z-10">
        <h1 className="text-header text-[#A49FFF]/80 drop-shadow-md  shadow-black  font-cool m-0">Varuna</h1>
        <Link
          to="/home"
          className="mt-6 px-6 py-2 bg-[#A49FFF] font-bold text-white  no-underline mr-10 hover:text-black font-cool rounded-full text-3xl hover:bg-[#B8E6D8] transition-all "
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
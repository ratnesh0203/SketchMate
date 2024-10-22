"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "./context/authContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Page() {
  const { user, googleSignIn, logOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  //const canvasRef = useRef(null);
  //const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
      if (user) {
        router.push("/homepage"); // Redirect to homepage if authenticated
      }
    };
    checkAuthentication();
  }, [user, router]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //   const ctx = canvas.getContext('2d');
  //   if (!ctx) return;
  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;

  //   ctx.fillStyle = 'black';
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);

  //   const draw = (e:MouseEvent) => {
  //     ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  //     ctx.fillRect(0, 0, canvas.width, canvas.height);
  //     ctx.fillStyle = 'white';
  //     ctx.beginPath();
  //     ctx.arc(e.clientX, e.clientY, 4, 0, Math.PI * 2);
  //     ctx.fill();
  //   };

  //   document.addEventListener('mousemove', draw);

  //   return () => {
  //     document.removeEventListener('mousemove', draw);
  //   };
  // }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-900 via-purple-400   to-pink-100 z-10">
      {/* <canvas ref={canvasRef} className="absolute top-0 left-0 z-0"></canvas> */}
      <div className="flex justify-between items-center p-4 z-10 relative">
        <div className="text-white font-bold text-4xl font-serif px-4">
          <p>SketchMate</p>
        </div>
      </div>
      <div className="p-10 flex justify-center items-center space-x-44  ">
        <div className="flex flex-col border border-white rounded-xl  w-[100vh] p-4 bg-gradient-to-br from-purple-900 via-purple-920 to-purple-950 space-y-4">
          <div className="py-4 px-4">
            <h1 className="text-5xl font-bold text-center">
              A new place for Creativity
            </h1>
          </div>
          <div className="flex-1 px-4 py-4">
            <p>
              Welcome to SketchMate, where your artistic ideas come to life. Our
              platform offers a dynamic and interactive canvas where you can
              draw, sketch, and create stunning visuals. Whether you are an
              artist, designer, or just exploring your creative side, SketchMate
              provides you with the tools and space to express yourself.
            </p>
            <div className="text-white font-bold font-serif space-y-4   flex flex-col items-center justify-center border border-white rounded-lg bg-gradient-to-br from-purple-900 via-purple-700   to-purple-500 z-10">
              <div className="px-4 py-3 text-3xl">
                <p>please Login first !</p>
              </div>
              <div className="flex space-x-2 py-2">
                {loading ? null : !user ? (
                  <ul className="flex space-x-2 ml-auto">
                    <li
                      onClick={handleSignIn}
                      className="p-2 cursor-pointer font-bold text-white border border-white rounded-md bg-white"
                    >
                      <Image
                        src="/google.png"
                        alt="google"
                        width={36}  
                        height={36}
                      />
                    </li>
                  </ul>
                ) : (
                  <div className="flex items-center space-x-4 ml-auto">
                    <p className="font-bold cursor-pointer p-2 text-white border border-white rounded-md">
                      Welcome!!, {user.displayName}
                    </p>
                    <p
                      onClick={handleSignOut}
                      className="font-bold cursor-pointer p-2 text-white border border-white rounded-md"
                    >
                      log out
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">&copy; 2024 SketchMate</p>
          <p className="text-sm">Bringing Creativity to Life</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-white hover:text-pink-200">
              About
            </a>
            <a href="#" className="text-white hover:text-pink-200">
              Contact
            </a>
            <a href="#" className="text-white hover:text-pink-200">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;

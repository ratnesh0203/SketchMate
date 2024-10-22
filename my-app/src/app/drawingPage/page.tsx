"use client";
import { useDraw } from "../components/hooks/useDraw";
import ChromePickerWrapper from "../components/ChromePickerWrapper";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { drawLine } from "../utils/drawLine";
import Modal from '../modals/link'
import { storage } from '../firebase'; // Import Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";


const socket = io("http://localhost:3001");

interface Props {}

type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};

export default function Home() {
  const [color, setColor] = useState("#000");
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [inviteLink, setInviteLink] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const generateInviteLink = () => {
    const link = `${window.location.origin}/drawing-page`; 
    setInviteLink(link);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handletogglemenu = (menuId: string) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const handleClickOutside = (event: any) => {
    if (openMenu && !event.target.closest(".dropdown-container")) {
      setOpenMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      console.log("sending canvas state");
      socket.emit("canvas-state", canvasRef.current?.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      console.log("received canvas state");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on(
      "draw-line",
      ({ prevPoint, currentPoint, color }: DrawLineProps) => {
        if (!ctx) return console.log("ctx is null");
        drawLine({ prevPoint, currentPoint, ctx, color });
      }
    );

    socket.on("clear", clear);

    return () => {
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("draw-line");
      socket.off("clear");
    };
  }, [canvasRef,clear]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currentPoint, color });
    drawLine({ prevPoint, currentPoint, ctx, color });
  }

  
  const saveDrawing = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const storageRef = ref(storage, `drawings/${new Date().toISOString()}.png`);
    canvas.toBlob(async (blob) => {
      if (blob) {
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Drawing uploaded successfully! URL:', downloadURL);
        alert('Drawing uploaded successfully!');
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-500 via-purple-350   to-purple-200">
      <div className="text-black border border-black py-4 px-6 mt-2 rounded-lg w-screen mx-auto flex justify-between items-center 
      bg-gradient-to-br from-purple-300 via-purple-200   to-purple-100">
        <div className="text-2xl font-bold text-black">SketchMate</div>

        <div className="relative dropdown-container">
          <button
            className="px-4 py-2 bg-gray-200 rounded border border-black hover:bg-blue-400"
            onClick={() => handletogglemenu("toolbar-menu")}
          >
            Toolbar
          </button>
          {openMenu === "toolbar-menu" && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg">
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Pen
              </button>
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Color
              </button>
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Eraser
              </button>
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Undo
              </button>
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Redo
              </button>
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Clear
              </button>
            </div>
          )}
        </div>
        <div className="relative dropdown-container">
          <button
            className="px-4 py-2 bg-gray-200 rounded border border-black hover:bg-blue-400"
            onClick={() => handletogglemenu("file-menu")}
          >
            Files
          </button>
          {openMenu === "file-menu" && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg">
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={saveDrawing}>
                Save
              </button>
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Load
              </button>
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Export
              </button>
            </div>
          )}
        </div>

        <div className="">
        <button onClick={generateInviteLink} className="px-4 py-2 bg-gray-200 rounded border border-black hover:bg-blue-400">
        Invite Link
      </button>

      <Modal isVisible={isModalVisible} onClose={closeModal} inviteLink={inviteLink}>
        <p className="mb-2">Invite your friends with this link:</p>
        <a href={inviteLink} className="text-blue-500 underline">
          {inviteLink}
        </a>
      </Modal>
        </div>

        <div className="relative dropdown-container">
          <button
            className="px-4 py-2 bg-gray-200 rounded border border-black hover:bg-blue-400 transition transform duration-150 ease-in-out active:scale-95"
            
          >
            <Link href="/homepage">Back</Link>
          </button>
          
        </div>
      </div>
      <div className="flex justify-center items-center w-screen h-screen px-1 ">
        <div className=" flex flex-1 ">
          <div className="flex flex-col  border-black border px-1 h-[81vh] justify-center bg-gradient-to-br from-purple-300 via-purple-200   to-purple-100 rounded-lg">
            <div className="text-black items-center justify-center mb-4 text-center text-xl font-bold ">
              Choose Colors
            </div>
            <ChromePickerWrapper
              color={color}
              onChange={(e) => {
                setColor(e.hex);
              }}
            />
            <button
              type="button"
              onClick={clear}
              className="py-2 rounded-md border border-black text-black mt-5 hover:bg-blue-400 transition transform duration-150 ease-in-out active:scale-95"
            >
              Clear
            </button>
            <button type="button" className="py-2 rounded-md border border-black text-black mt-5 hover:bg-blue-400 transition transform duration-150 ease-in-out active:scale-95">
              Download
            </button>
          </div>
        </div>

        <div className="flex-1 mx-1">
          <canvas
            onMouseDown={onMouseDown}
            ref={canvasRef}
            width={990}
            height={460}
            className="border-2 border-black  rounded-md bg-white"
          ></canvas>
        </div>
      </div>
    </div>
  );
}

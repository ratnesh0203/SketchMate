import { on } from "events";
import { useState } from "react";
import { useEffect,useRef } from "react";

export const useDraw = (onDraw: ({ctx, currentPoint, prevPoint}: Draw)=>void) => {
   
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPointRef = useRef<Point | null>(null);

  const onMouseDown = ()=>setMouseDown(true);

  const clear=()=>{
      const canvas=canvasRef.current;
      if(!canvas) return;

    const ctx=canvasRef.current?.getContext("2d");
    if(!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
        if(!mouseDown) return;
        const currentPoint = computePointInCanvas(e);

        const ctx=canvasRef.current?.getContext("2d");
        if(!ctx || !currentPoint) return;

        onDraw({ctx, currentPoint, prevPoint: prevPointRef.current});
        prevPointRef.current = currentPoint;
    }

    const computePointInCanvas = (e: MouseEvent) => {
        const canvas=canvasRef.current;
        if(!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return {x, y};
        }

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPointRef.current = null;
    }
    const canvas = canvasRef.current;
    //event listener
    canvas?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);
  
    //remove event listener
    return () => {
      canvas?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [onDraw,mouseDown]);

  return {canvasRef, onMouseDown, clear};
};
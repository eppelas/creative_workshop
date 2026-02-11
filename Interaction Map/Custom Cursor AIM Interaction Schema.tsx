import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setHidden(false);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(${clicked ? 0.8 : 1})`;
      }
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [clicked]);

  if (hidden) return null;

  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 bg-[#e2e8f0] rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 ease-out will-change-transform"
      />
      <style>{`
        body, a, button, input, textarea {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};
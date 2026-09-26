import { useRef } from 'react';
export default function Magnetic({ children, className = 'btn', ...p }) {
  const ref = useRef();
  const move = (e) => { const b = ref.current.getBoundingClientRect(); ref.current.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * 0.25}px,${(e.clientY - b.top - b.height / 2) * 0.25}px)`; };
  return <a ref={ref} className={className.includes('btn') ? className : 'btn ' + className} onMouseMove={move} onMouseLeave={() => (ref.current.style.transform = '')} {...p}>{children}</a>;
}

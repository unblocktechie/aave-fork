import {useEffect, useRef} from "react";

export const useOutsideClick = (outsideClickHandler: any) => {
  const elementRef: any = useRef();

  const handleOutsideClick = (event: any) => {
    if (elementRef.current && !elementRef.current.contains(event.target)) {
      if (typeof outsideClickHandler === 'function') outsideClickHandler(event);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleOutsideClick);

    return () => {
      document.removeEventListener('mouseup', handleOutsideClick);
    };
  }, []);

  return elementRef;
};

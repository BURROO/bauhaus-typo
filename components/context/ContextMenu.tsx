// import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

interface IContext {
  screenWidth: number|null;
  screenHeight: number|null;
}

export const ContextMenu = React.createContext<IContext>({
  screenWidth: null,
  screenHeight: null,
});



export const ContextMenuProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // console.log('props', props);
  // Set the initial mode
  const [screenWidth, setScreenWidth] = useState<number|null>(null);
  const [screenHeight, setScreenHeight] = useState<number|null>(null);
  

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
      setScreenHeight(window.innerHeight)
    };

    handleResize()

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // const [filteredProjects, setFilteredProjects] = useState([]);


  // Set the initial mode
  const value = useMemo(
    () => ({
      screenWidth,
      screenHeight
    }),
    [
      screenWidth,
      screenHeight
    ]
  );

  return <ContextMenu.Provider value={value}>{children}</ContextMenu.Provider>;
};
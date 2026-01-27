'use client'

// import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

interface IContext {
  screenWidth: number|null;
  screenHeight: number|null;
  rowHeight: number|null;
}

export const ContextMenu = React.createContext<IContext>({
  screenWidth: null,
  screenHeight: null,
  rowHeight: null
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


  const divider = screenHeight !== null ? Math.floor( screenHeight / 15) :  1
  // const divider = screenHeight !== null ? Math.floor( 40 - screenHeight * 0.03) :  1

  const rowHeight = screenHeight !== null ? (screenHeight / divider) : 0
  

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
      screenHeight,
      rowHeight
    }),
    [
      screenWidth,
      screenHeight,
      rowHeight
    ]
  );

  return <ContextMenu.Provider value={value}>{children}</ContextMenu.Provider>;
};
'use client'

// import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

interface IContext {
  screenWidth: number|null;
  screenHeight: number|null;
  rowHeight: number|null;
  setActiveIndex: (valie: number|null) => void;
  activeIndex: null|number;
  fontSize: null|number;
}

export const ContextMenu = React.createContext<IContext>({
  screenWidth: null,
  screenHeight: null,
  rowHeight: null,
  setActiveIndex: () => {},
  activeIndex: null,
  fontSize: null
});


export const ContextMenuProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Set the initial mode
  const [screenWidth, setScreenWidth] = useState<number|null>(null);
  const [screenHeight, setScreenHeight] = useState<number|null>(null);
  const [activeIndex, setActiveIndex] = useState<number|null>(null)


  // const divider = screenHeight !== null ? Math.floor( screenHeight / 15) :  1
  const projectCount = 46
  const header = 1
  const footer = 3
  const multiLineRows = 5
  const divider = projectCount + header + footer + multiLineRows
  // const divider = screenHeight !== null ? Math.floor( 40 - screenHeight * 0.03) :  1

  const rowHeight = screenHeight !== null ? (screenHeight / divider) : 0
  const fontSize = rowHeight * 0.8
  

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
      rowHeight,
      activeIndex,
      setActiveIndex,
      fontSize
    }),
    [
      screenWidth,
      screenHeight,
      rowHeight,
      activeIndex,
      setActiveIndex,
      fontSize
    ]
  );

  return <ContextMenu.Provider value={value}>{children}</ContextMenu.Provider>;
};
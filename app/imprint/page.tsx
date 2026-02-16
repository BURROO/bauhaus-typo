'use client'


import { useContext } from "react";
import styles from "./page.module.css";
import ButtonLink from "@/components/general/ButtonLink";
import { ContextMenu } from "@/components/context/ContextMenu";
import BackgroundSVG from "@/components/landing/svg/BackgroundSVG";


export default function Imprint() {


  const { fontSize } = useContext(ContextMenu)

  return (
    <div className={styles.page}>
      {/* <div style={{ position: "absolute", zIndex: -1}}>
        <BackgroundSVG />
      </div> */}
      <div>
      <ButtonLink href="/" text="Go Back" />
      <main className={styles.main} style={{
        padding: 4,
      }}>
        <p style={{ fontSize : fontSize || ''}}>
          Design:<br/>
          Mona kerntke <a target="_blank" href="https://instagram.com/mona.kerntke">@mona.kerntke</a><br/>
          Yasmina Khalil <a target="_blank" href="https://instagram.com/khalillifee">@khalillifee</a><br/>
          Lea Sailer <a target="_blank" href="https://instagram.com/byleasailer">@byleasailer</a><br/>
          Anna-lena Welz <a target="_blank" href="https://instagram.com/annaa.leenaa">@annaa.leenaa</a><br/>
          <br/>
          Supervision & Development: <br/>
          Philipp Koller <a target="_blank" href="https://instagram.com/burrowlab">@burrowlab</a><br/>
          <br/>
          Typeface in use: <br/>
          Ufficio Mono kindly provided by Giulia Boggio <a target="_blank" href="https://instagram.com/bojjoe">@bojjoe</a><br/>
        </p>
      </main>
      </div>
    </div>
  );
}


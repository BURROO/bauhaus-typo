import { TypeProject } from '@/types/project-type';
import styles from './Overlay.module.css'
import ParametricBook from '../slug/inOrderOfMeaning/ParametricBook';



const thumbnails: { [key: string]: string } = {
    'Yuqing Liu': `yuqing_liu_thumbnail.mov`,
    'Alice Aydin': `alice_aydin_thumbnail.mp4`,
    'Florian Meisner': `florian_meisner_thumbnail.gif`,
    'Helene Dennewitz': `helene_dennewitz_thumbnail.mp4`,
    'Sophia Boni': `sofia_boni_thumbnail.mp4`, // Falsch geschrieben!! --> Sofia!
    'Difei Song': `difei_song_thumbnail.mp4`,
    'Yu Ji': `yu_ji_thumbnail.mp4`,
    'Sophia Rhein': `sophia_rhein_thumbnail.mp4`,
    'Hannes Altmann': `hannes_altmann_thumbnail.mov`,
    'Phuong Mai Do': `phuong_mai_do_thumbnail.mp4`
}


const Overlay = ({ item }: {item: TypeProject; }) => {

    // console.log("item", item)

    if(typeof item === "undefined") return <></>


    return (
            <div 
            className={styles.overlay}
            >
                {item["Kurs"] === "Transcoding Typography" && <OverlayTranscoding item={item} />}
                {item["Kurs"] === "In Order Of Meaning " && <OverlayOrderOfMeaning item={item} />}
                {/* {item["Kurs"] === "Transcoding Typography" && <OverlayTranscoding item={item} />} */}
            </div>
    )
}

export default Overlay


const OverlayTranscoding = ({ item }: { item: TypeProject }) => {
    // Handle

    const img = thumbnails[item.Studierende] && `/images/tt/thumbnail/${thumbnails[item.Studierende]}` || null

    if(!img) return <div className={styles.overlay} />

    const split = img.split(".")
    const type = split.pop()
    const isMovie = type?.match(/mov|mp4/ig)



    return (
            <div 
            className={styles.overlay}
            >
                {
                    isMovie ?
                    <video
                    key={img}
                    src={img}
                    autoPlay={true}
                    loop={true}
                    muted={true}
                    />
                    :
                    <img
                    src={img}
                    />

                }
            </div>
    )
}


const OverlayOrderOfMeaning = ({ item }: { item: TypeProject }) => {
    // Handle

    return (
        <div style={{ height: 400, padding: 50 }}>
            <ParametricBook type="orbit" onClick={() => {}} item={item} />
        </div>
    )
}
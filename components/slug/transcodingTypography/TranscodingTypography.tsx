import { TypeProject } from '@/types/project-type'
import styles from './TranscodingTypography.module.css'
import { useEffect, useState } from 'react'

interface Props {
    item: TypeProject
}




const TranscodingTypography = ({ item }: Props) => {

    // 1. Build local path
    const cleanedSnippet = item.Link
        ?.split('.')[0]
        ?.split('/')
        ?.pop()


    const [src, setSrc] = useState<string>(`/websites/tt/${cleanedSnippet}/index.html`)
    const [isLocal, setIsLocal ] = useState(true)

    const [prefereLocal, setPrefereLocal] = useState(true)


    useEffect(() => {
        let cancelled = false


        if(!prefereLocal){

            setIsLocal(true)
            setSrc(item.Link);

            return 
        }else{
            async function resolveSource() {
                if (!src) {
                    setSrc(item.Link)
                    setIsLocal(false)
                    return
                }

                try {
                    // 2. Check if local file exists
                    const res = await fetch(src, { method: 'HEAD' })

                    if (!cancelled) {
                        setSrc(res.ok ? src : item.Link)
                        if(!res.ok) setIsLocal(false)
                    }
                } catch {
                    if (!cancelled) {
                        setSrc(item.Link)
                        setIsLocal(false)
                    }
                }
            }

            resolveSource()

        }


        return () => {
            cancelled = true
        }
    }, [item.Link, src, prefereLocal])

    return (
        <div className={styles.transcodingTypography}>
            <div
            onClick={() => setPrefereLocal(!prefereLocal)}
            className={styles.type}
            style={{
                background: isLocal ? 'green' : 'red'
            }}>{isLocal ? 'Local' : 'Remote'}</div>
            <iframe 
            src={src}
            ></iframe>
        </div>
    )
}


export default TranscodingTypography
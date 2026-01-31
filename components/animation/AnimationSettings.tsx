import { TypeAnimation } from "../hook/useAnimation";

interface Props{
    selectedCourse: 'TT'|'OM'|'PZ'|'TG';
    setSelectedCourse: (value: 'TT'|'OM'|'PZ'|'TG') => void;
    showSettings: boolean;
    setShowSettings: (value: boolean) => void;
    background: string;
    setBackground: (value: string) => void;
    radius: number;
    setRadius: (value: number) => void;
    scale: number;
    setScale: (value: number) => void;
    animation: TypeAnimation[];
    setAnimation: any;
}

const AnimationSettings = ({
    selectedCourse,
    setSelectedCourse,
    showSettings,
    setShowSettings,
    background,
    setBackground,
    radius,
    setRadius,
    scale,
    setScale,
    animation,
    setAnimation
}: Props) => {


    return (

        <div style={{ 
        position: "fixed", 
        top: 0,
        left: 0,
        padding: 5,
        background: "white"
        }}>
        <button onClick={() => setShowSettings(!showSettings)}>{showSettings ? "Hide" : "Show"} Settings</button>

        {showSettings && <div>
            <div  style={{ 
                border: "1px solid black",
                borderRadius: 4
            }}>

        <br/>
        <label>
            Select Course: 
            <select defaultValue={selectedCourse}  onChange={(e) => {

                const value: string = e.currentTarget.value
                
                // @ts-ignore
                setSelectedCourse(value)
            }}>
                <option value="TT">TT</option>
                <option value="OM">OM</option>
                <option value="PZ">PZ</option>
                <option value="TG">TG</option>
            </select>
        </label>
        <br/>
        <br/>
        <label>Background: </label>
        <input type="color" defaultValue={background} onChange={(e) => setBackground(e.currentTarget.value)}/>
        <label>
            Radius 
            {/* @ts-ignore */}
            <input
            type="range"
            defaultValue={radius}
            // @ts-ignore
            onChange={(e) => setRadius(Number(e.currentTarget.value))} 
            min={0.1}
            max={1}
            step={0.01}
            />
        </label>
        <label>
            Scale 
            {/* @ts-ignore */}
            <input
            type="range"
            defaultValue={scale}
            // @ts-ignore
            onChange={(e) => setScale(Number(e.currentTarget.value))} 
            min={0.1}
            max={2}
            step={0.1}
            />
        </label>
        <br/>
        <br/>
            {
                animation.map((item, i) => (
                    <div key={i} style={{ 
                        padding: 5, 
                        // padding: 10, 
                        // margin: 4,
                        borderTop:  "1px solid black",
                        // borderRadius: 4
                    }}>
                        <h2>Animation {i}</h2>
                        <select defaultValue={item.axis}  onChange={(e) => {

                            // @ts-ignore
                            const value: 'x'|'y'|'z' = e.currentTarget.value
                            
                
                            setAnimation((prev: TypeAnimation[]) =>
                                prev.map((a: TypeAnimation, idx: number) =>
                                idx === i ? { ...a, axis: value } : a
                                )
                            )
                        }}>
                            <option value="x">X</option>
                            <option value="y">Y</option>
                            <option value="z">Z</option>
                        </select>
                        <label>
                            Speed:
                            <input
                            style={{ width: 50}}
                            type="number"
                            value={item.speed}
                            step={1}
                            onChange={(e) => {

                                // @ts-ignore
                                const value: number = e.currentTarget.value
                                
                                setAnimation((prev: TypeAnimation[]) =>
                                    prev.map((a: TypeAnimation, idx: number) =>
                                    idx === i ? { ...a, speed: value } : a
                                    )
                                )
                            }} />
                        </label>
                        <label>
                            Ofst Per Item:
                            <input
                            style={{ width: 50}}
                            type="number"
                            value={item.ofstPerItem}
                            step={0.01}
                            onChange={(e) => {

                                // @ts-ignore
                                const value: number = e.currentTarget.value
                                
                                setAnimation((prev: TypeAnimation[]) =>
                                    prev.map((a: TypeAnimation, idx: number) =>
                                    idx === i ? { ...a, ofstPerItem: value } : a
                                    )
                                )
                            }} />
                        </label>
                        <button onClick={() => {
                            
                            setAnimation((prev:any) => prev.filter((_: any, idx: number) => idx !== i))

                        }}>Delete</button>


                    </div>
                ))
            }
            </div>
            <br/>
            <select onChange={(e) => {

                // @ts-ignore
                const [attribute, axis]: ['position'|'rotation', 'x', 'y', 'z'] = e.currentTarget.value.split("-")

                setAnimation((prev: any) => [
                    ...prev,
                    {
                        attribute,
                        axis,
                        ofstPerItem: 2,
                        speed: 2
                    }
                ])

            }}>
                <option value="rotation-x">Add Rotation X</option>
                <option value="rotation-y">Add Rotation Y</option>
                <option value="rotation-z">Add Rotation Z</option>
                {/* <option value="position-x">Add Position X</option>
                <option value="position-y">Add Position Y</option>
                <option value="position-z">Add Position Z</option> */}

            </select>
        </div>}
        </div>
    )
}

export default AnimationSettings
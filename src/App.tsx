import React, { useEffect, useRef, useState } from "react";
import { fetchGIF } from "./Utils";
import gif from "./gif_demo.gif";
import { GifParase } from "./gifParse";

function App() {
    const [gifParase, setGifParase] = useState<GifParase | null>(null);
    const canvasDOM = useRef<HTMLCanvasElement>(null);

    const readGIFDate = async (): Promise<undefined | GifParase> => {
        if (canvasDOM.current === null) {
            return;
        }

        const buffer = (await fetchGIF(gif)) as Buffer;
        const ctx = canvasDOM.current.getContext("2d") as CanvasRenderingContext2D;

        setGifParase(new GifParase(buffer, ctx));
    };

    useEffect(() => {
        readGIFDate();
    }, [canvasDOM]);

    useEffect(() => {
        gifParase?.draw();

        return () => {
            gifParase?.destroy();
        };
    }, [gifParase]);

    return (
        <>
            <canvas ref={canvasDOM}></canvas>
        </>
    );
}

export default App;

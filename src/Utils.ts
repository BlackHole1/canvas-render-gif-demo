export const fetchGIF = async (url: string) => {
    return await fetch(url, {
        cache: "no-cache",
        headers: {
            "Content-Type": "text/plain",
        },
    }).then(async resp => {
        return new Uint8Array(await resp.arrayBuffer());
    });
};

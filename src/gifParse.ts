import { Frame, GifReader } from "omggif";

export class GifParase {
    private readonly reader: GifReader;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly options: Options;
    private readonly readerConfig: ReaderConfig;

    private readonly tempCtx: CanvasRenderingContext2D;
    private readonly tempImage: HTMLImageElement;

    private timeoutID: number = NaN;

    constructor(buffer: Uint8Array, ctx: CanvasRenderingContext2D, options?: DeepPartial<Options>) {
        // @ts-ignore
        this.reader = new GifReader(buffer);
        this.ctx = ctx;
        this.options = {
            ctx: {
                width: this.ctx.canvas.width,
                height: this.ctx.canvas.height,
                ...options?.ctx,
            },
            reader: {
                loopCount: -1,
                ...options?.reader,
            },
        };

        this.tempCtx = document
            .createElement("canvas")
            .getContext("2d") as CanvasRenderingContext2D;

        this.tempImage = new Image();

        this.readerConfig = {
            frameNumber: 0,
            previousImageData: null,
            previousFrameInfo: null,
        };
    }

    public draw(): void {
        if (this.readerConfig.frameNumber === this.originalFrameNumber) {
            this.readerConfig.frameNumber = 0;

            if (this.loopCount !== -1) {
                // 如果是有限循环，并且当前已经是最后一次循环时，结束绘制
                if (--this.loopCount === 0) {
                    this.destroy();
                    return;
                }
            }
        }

        const { frameNumber } = this.readerConfig;
        const ctx = this.ctx;

        const frameInfo = this.reader.frameInfo(frameNumber);

        // 总是在第一帧清除整个画布
        if (frameNumber === 0) {
            ctx.clearRect(0, 0, this.options.ctx.width, this.options.ctx.height);
        }

        if (this.readerConfig.previousFrameInfo) {
            const { disposal, x, y } = this.readerConfig.previousFrameInfo;

            switch (disposal) {
                // 0: 没有指定的处理，所以什么也不做
                // 1: 不要处理
                case 0:
                case 1: {
                    break;
                }

                // 恢复背景色
                // 因浏览器忽略背景颜色，所以它始终是：还原为透明
                case 2: {
                    ctx.clearRect(x, y, this.options.ctx.width, this.options.ctx.height);
                    break;
                }

                // 恢复到上一帧
                case 3: {
                    if (this.readerConfig.previousImageData) {
                        ctx.putImageData(this.readerConfig.previousImageData, 0, 0);
                    }
                    break;
                }
                default:
                    break;
            }
        }

        // 保存当前数据，以备后面需要
        if (frameNumber === 0 || frameInfo.disposal < 2) {
            this.readerConfig.previousImageData = ctx.getImageData(
                0,
                0,
                this.reader.width,
                this.reader.height,
            );
        }

        const imageDate = ctx.getImageData(0, 0, this.reader.width, this.reader.height);
        this.reader.decodeAndBlitFrameRGBA(frameNumber, imageDate.data);

        this.tempCtx.canvas.width = frameInfo.width;
        this.tempCtx.canvas.height = frameInfo.height;
        this.tempCtx.putImageData(
            imageDate,
            0,
            0,
            frameInfo.x,
            frameInfo.y,
            frameInfo.width,
            frameInfo.height,
        );

        this.tempImage.src = this.tempCtx.canvas.toDataURL("image/png", 1);

        ctx.drawImage(this.tempImage, 0, 0, this.options.ctx.width, this.options.ctx.height);

        this.readerConfig.previousFrameInfo = frameInfo;

        this.timeoutID = window.setTimeout(() => {
            this.draw();
        }, frameInfo.delay * 10);

        this.readerConfig.frameNumber++;
    }

    public get loopCount(): number {
        return this.options.reader.loopCount;
    }

    public set loopCount(count) {
        this.options.reader.loopCount = count;
    }

    public get originalLoopCount(): number {
        return this.reader.loopCount();
    }

    public get originalFrameNumber(): number {
        return this.reader.numFrames();
    }

    public destroy(): void {
        clearTimeout(this.timeoutID);
    }
}

interface ReaderOptions {
    loopCount: number;
}

interface CtxOptions {
    width: number;
    height: number;
}

interface Options {
    ctx: CtxOptions;
    reader: ReaderOptions;
}

interface ReaderConfig {
    frameNumber: number;
    previousImageData: null | ImageData;
    previousFrameInfo: null | Frame;
}

type DeepPartial<T> = T extends Function
    ? T
    : T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;

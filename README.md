## 调研在 `canvas` 上绘制 `gif`

目前前端在 `canvas` 上绘制 `gif` 的方案主要有两种:

1. 在前端进行解析 `gif`，并进行绘制
2. 在后端分割 `gif` 的 `frame`，返回给前端进行解析

第二种方案需要额外的 server 成本，故放弃。

## packages

第一种的方案，目前市面上主流的有以下 package，后文将描述各个 `package` 的优缺点

### [libgif-js](https://github.com/buzzfeed/libgif-js)

根据 [jsgif](https://github.com/shachaf/jsgif) `Fork` 而来，因 [jsgif](https://github.com/shachaf/jsgif) 上次 commit 时间为 `10` 年前

而 [libgif-js](https://github.com/buzzfeed/libgif-js) 在 `Fork` 之后，维护了几年，但是后续也不在维护了，上一次维护时间为 `5` 年前，并且也没有发到 `npm` 上

虽然有人对此进行了 `Fork`，并发布到 `npm` 上去，但是并没有解决下面的问题:

而且根据 [libgif-js/pull/26](https://github.com/buzzfeed/libgif-js/pull/26) 的讨论，此 `package` 居有严重的性能问题

### [aframe-gifsparser](https://github.com/gtk2k/gtk2k.github.io/blob/master/animation_gif/gifsparser.js)

性能特别好，但是有以下问题:

1. 此 `package` 只是一个项目的部分代码，而且依赖了 `aframe` 这个 `package`
2. 只支持 `GIF89a` 标准，不支持 `GIF87a` 标准
3. 代码完全没有可维护性

### [omggif](https://github.com/deanm/omggif)

目前采用的是此 `package`

虽然此 `package` 的 `README` 描述文档里没有提到说兼容: `GIF87a` 标准，但是其内部代码是支持的

### [gifler](https://github.com/themadcreator/gifler)

此 `package` 是基于 `omggif` 二次封装，提供了完善的 `API` 支持，但是此 `package` 依赖的是很早之前 `omggif` 不支持 `GIF87a` 的版本

### [doimg-gif](https://github.com/JuneAndGreen/doimg/blob/master/src/gif.js)

此 `package` 是 [JuneAndGreen](https://github.com/JuneAndGreen) 在 [gif 的故事：解剖表情动图的构成 | AlloyTeam](http://www.alloyteam.com/2017/09/13121/) 一文中编写的代码

经过实际测试，发现此项目代码没有很好的处理 gif 的边界问题，导致在处理有些 `gif` 的时候，会直接卡死不动。

但此文写的很棒，可以根据此文以及: [庖丁解牛：GIF 图片原理和储存结构](https://www.techug.com/post/gif-image-structure-intro.html) 一起观看，可以加深对 `gif 结构` 及 `gif 处理逻辑`

## 文献:

十分感谢以下 `package` 和 `文章`：

1. [庖丁解牛：GIF 图片原理和储存结构](https://www.techug.com/post/gif-image-structure-intro.html)
2. [gif 的故事：解剖表情动图的构成 | AlloyTeam](http://www.alloyteam.com/2017/09/13121/)
3. [doimg-gif](https://github.com/JuneAndGreen/doimg/blob/master/src/gif.js)
4. [omggif](https://github.com/deanm/omggif)
5. [libgif-js](https://github.com/buzzfeed/libgif-js)
6. [What's In A GIF - Bits and Bytes](http://giflib.sourceforge.net/whatsinagif/bits_and_bytes.html)
7. [What's In A GIF - Animation and Transparency](http://giflib.sourceforge.net/whatsinagif/animation_and_transparency.html)
8. [GIF: Graphics Interchange Format(sm) - 89a](https://tronche.com/computer-graphics/gif/)

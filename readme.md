



# JS的业务范围

## 打包文件

`npm init` 后设置rollup脚本文件路径，并且将type设置为module。

```json
{
  "name": "my-axios",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "type": "module",
  "bin": {
    "rollup":"./node_modules/.bin/rollup"
  },
  "scripts": {
    "build":"rollup -c"
  },
  "dependencies": {
    "rollup": "^3.27.2"
  }
}

```

配置rollup.config.js

```js
export default {
  input:'src/index.js',
  output: {
    file: "bundle.js",
    format: "cjs",
  },
}
```

## 打包加入外面的库



当我们尝试去引入外面的库，然后进行打包的时候，这时会出现报错：无法解析依赖。虽然打包时不会报错，但是运行时就会被你报了。

![image-20230808105843856](https://fatjun-file.oss-accelerate.aliyuncs.com/uPic/image-20230808105843856.png)

官方解释https://rollupjs.org/troubleshooting/#warning-treating-module-as-external-dependency

能通过两种方式解决

- 手动配置：将依赖的库，设置到rollup.config.js中的`external`属性上 (没什么卵用，因为他只是抑制了警告，并没有把`lodash-es`打包进去)


```js
export default {
  input:'src/index.js',
  output: {
    file: "bundle.js",
    format: "cjs",
  },
  external: ['lodash-es']
}
```



- 自动：[@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)

  使用`yarn add @rollup/plugin-node-resolve -d`来安装依赖，并在`rollup.cnfig.js`中使用他。

```javascript
import resolve from '@rollup/plugin-node-resolve'

export default {
  input:'src/index.js',
  output: {
    file: "bundle.js",
    format: "cjs",
  },
  plugins:[resolve()]
  // external: ['lodash-es']
}
```





## 引入commentJs支持

很大一部份的NPM包都是使用`commentJs`的方式进行开发的。而`rollup`只是支持`ESM`的格式，所以会导致很多依赖的`NPM`包无法正常打包。

[官方解释](https://cn.rollupjs.org/troubleshooting/#error-name-is-not-exported-by-module)

安装`@rollup/plugin-commonjs`

`yarn add @rollup/plugin-commonjs`



rollup.config.js

```javascript
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input:'src/index.js',
  output: {
    file: "bundle.js",
    format: "cjs",
  },
  plugins:[resolve(),commonjs()]
  // external: ['lodash-es']
}
```



## 压缩打包后的代码体积

使用`rollup-plugin-terser`



`yarn add rollup-plugin-terser -D`



Rollup.config.js

```js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnanoPlugin from 'cssnano'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import { terser } from 'rollup-plugin-terser'

export default {
  // 入口
  input: 'src/index.ts',
  output: {
    // file: 'bundle.js',
    dir: path.dirname('dist/bundle.js'),
    format: 'es',
    exports: 'named', // 指定导出模式（自动、默认、命名、无）
    preserveModules: true, // 保留模块结构
    preserveModulesRoot: 'src', // 将保留的模块放在根级别的此路径下
  },
  plugins: [
    // 处理ts
    typescript({
      outDir: 'dist',
      declaration: true,
      declarationDir: 'dist',
    }),
    // 打包的时候会把NPM包也打包进去
    resolve(),
    // 处理NPM包中可能存在commonJS导出方式
    commonjs(),
    // 处理css
    postcss({
      plugins: [
        // 加css前缀的
        autoprefixer(),
        // 压缩css的
        cssnanoPlugin(),
      ],
      // 提取css到一个单独的文件中的
      extract: 'css/index.css',
    }),
    terser(),
  ],
  // external: ['lodash-es']
}

```



# CSS的业务范围



## 引入css、less、sass、stylus 

正常来说rollup是不会处理样式文件的，当我们插件处理，直接打包时，他会报错。

![image-20230808114855655](https://fatjun-file.oss-accelerate.aliyuncs.com/uPic/image-20230808114855655.png)



`rollup-plugin-postcss`这个插件会将所有的 样式文件进行处理。



安装

```
yarn add postcss rollup-plugin-postcss --dev
```



rollup.config.js

```javascript
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

export default {
  input:'src/index.js',
  output: {
    file: "bundle.js",
    format: "cjs",
  },
  plugins:[resolve(),commonjs(),postcss()]
  // external: ['lodash-es']
}
```



效果：

![image-20230808121056469](https://fatjun-file.oss-accelerate.aliyuncs.com/uPic/image-20230808121056469.png)

## **注意⚠️：如果项目中使用到sass、less、stylus，记得安装额外的预处理**

安装对应的依赖:

- For `Sass` install `node-sass`: `yarn add node-sass --dev`
- For `Stylus` Install `stylus`: `yarn add stylus --dev`
- For `Less` Install `less`: `yarn add less --dev`

That's it, you can now import `.styl` `.scss` `.sass` `.less` files in your library.





## 添加css的前缀



安装

`yarn add autoprefixer -D`



更新package.json



效果

![image-20230808121515267](https://fatjun-file.oss-accelerate.aliyuncs.com/uPic/image-20230808121515267.png)





## 提取到单独的css文件中



postcss插件能把项目中的css提取到单独的一个css文件中。

通过修改rollup.config.js中关于postcss的配置就能实现。



![image-20230808125351055](https://fatjun-file.oss-accelerate.aliyuncs.com/uPic/image-20230808125351055.png)

![image-20230808125337168](https://fatjun-file.oss-accelerate.aliyuncs.com/uPic/image-20230808125337168.png)





## 压缩css的体积



单独提取的css文件可以看到有很多不必要的换行。这也是一个可以优化文件体积的点。

安装

`yarn add cssnano -D`

修改rollup.config.js

```javascript
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnanoPlugin from 'cssnano'

export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs',
  },
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      plugins: [autoprefixer(), cssnanoPlugin()],
      extract: 'css/index.css',
    }),
  ],
  // external: ['lodash-es']
}

```



![image-20230808125835494](https://fatjun-file.oss-accelerate.aliyuncs.com/uPic/image-20230808125835494.png)







# 引入ts



## 引入@rollup/pulgin-typescript



安装ts

`yarn add typescript tslib -d`

安装rollup的插件

`yarn add @rollup/plugin-typescript -d`



修改rollup.config.js

```javascript
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnanoPlugin from 'cssnano'
import typescript from '@rollup/plugin-typescript'

export default {
  // 入口
  input: 'src/index.ts',
  output: {
    file: 'bundle.js',
    format: 'cjs',
  },
  plugins: [
    // 处理ts
    typescript(),
    // 打包的时候会把NPM包也打包进去
    resolve(),
    // 处理NPM包中可能存在commonJS导出方式
    commonjs(),
    // 处理css
    postcss({
      plugins: [
        // 加css前缀的
        autoprefixer(),
        // 压缩css的
        cssnanoPlugin(),
      ],
      // 提取css到一个单独的文件中的
      extract: 'css/index.css',
    }),
  ],
  // external: ['lodash-es']
}

```





## 导出类型声明文件



修改rollup.config.js

```js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnanoPlugin from 'cssnano'
import typescript from '@rollup/plugin-typescript'

export default {
  // 入口
  input: 'src/index.ts',
  output: {
    file: 'bundle.js',
    format: 'cjs',
  },
  plugins: [
    // 处理ts
    typescript({
      outDir: 'dist',
      declaration: true,
      declarationDir: 'dist',
    }),
    // 打包的时候会把NPM包也打包进去
    resolve(),
    // 处理NPM包中可能存在commonJS导出方式
    commonjs(),
    // 处理css
    postcss({
      plugins: [
        // 加css前缀的
        autoprefixer(),
        // 压缩css的
        cssnanoPlugin(),
      ],
      // 提取css到一个单独的文件中的
      extract: 'css/index.css',
    }),
  ],
  // external: ['lodash-es']
}

```





## 修正项目打包输出路径

这时我们能看到导出的类型和打包后生成的文件都不在这个地方的？这显然是不对的。所以我们要修正，让他们在同一个地方

![image-20230808135929347](https://fatjun-file.oss-accelerate.aliyuncs.com/uPic/image-20230808135929347.png)





rollup.config.js

```js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnanoPlugin from 'cssnano'
import typescript from '@rollup/plugin-typescript'
import path from 'path'

export default {
  // 入口
  input: 'src/index.ts',
  output: {
    // file: 'bundle.js',
    dir: path.dirname('dist/bundle.js'),
    format: 'es',
    exports: 'named', // 指定导出模式（自动、默认、命名、无）
    preserveModules: true, // 保留模块结构
    preserveModulesRoot: 'src', // 将保留的模块放在根级别的此路径下
  },
  plugins: [
    // 处理ts
    typescript({
      outDir: 'dist',
      declaration: true,
      declarationDir: 'dist',
    }),
    // 打包的时候会把NPM包也打包进去
    resolve(),
    // 处理NPM包中可能存在commonJS导出方式
    commonjs(),
    // 处理css
    postcss({
      plugins: [
        // 加css前缀的
        autoprefixer(),
        // 压缩css的
        cssnanoPlugin(),
      ],
      // 提取css到一个单独的文件中的
      extract: 'css/index.css',
    }),
  ],
  // external: ['lodash-es']
}

```


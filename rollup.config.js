import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnanoPlugin from 'cssnano'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'

import path from 'path'

// import { readFileSync } from 'fs'
// const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

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
  // output: [
  //   {
  //     file: pkg.main,
  //     format: 'cjs',
  //   },
  //   {
  //     file: pkg.module,
  //     format: 'esm',
  //   },
  // ],
  plugins: [
    json(),
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

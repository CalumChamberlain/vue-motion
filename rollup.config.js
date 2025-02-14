import vue from 'rollup-plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/vue-motion.umd.js',
      format: 'umd',
      name: 'VueMotion',
      exports: 'named',
      globals: {
        vue: 'Vue'
      }
    },
    {
      file: 'dist/vue-motion.esm.js',
      format: 'es',
      exports: 'named'
    }
  ],
  external: ['vue'],
  plugins: [
    vue(),
    nodeResolve(),
    commonjs(),
    terser()
  ]
}

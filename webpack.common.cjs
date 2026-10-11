const path = require('node:path');
const { container: { ModuleFederationPlugin } } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Executed in the shell browser when it first imports an exposed module.
const runtimeRemote = `promise new Promise((resolve, reject) => {
  const url = window.__MICROFE_CONFIG__?.exampleUrl;
  if (!url || !/^https?:$/.test(new URL(url, window.location.href).protocol)) {
    reject(new Error('Invalid example remote URL')); return;
  }
  const script = document.createElement('script');
  const timer = setTimeout(() => { script.remove(); reject(new Error('Remote timed out')); }, 10000);
  script.src = url;
  script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('Remote failed to load')); };
  script.onload = () => {
    clearTimeout(timer);
    if (!window.example) { reject(new Error('Remote container missing')); return; }
    resolve(window.example);
  };
  document.head.appendChild(script);
})`;

module.exports = (name, directory) => {
  const { dependencies } = require(path.join(directory, 'package.json'));
  return {
    entry: path.join(directory, 'src/index.ts'),
    output: { path: path.join(directory, 'dist'), filename: '[name].[contenthash].js', publicPath: 'auto', uniqueName: name, clean: true },
    resolve: { extensions: ['.tsx', '.ts', '.js'] },
    module: { rules: [
      { test: /\.tsx?$/, exclude: /node_modules/, use: { loader: 'ts-loader', options: { configFile: path.join(__dirname, 'tsconfig.json'), transpileOnly: true, compilerOptions: { noEmit: false } } } },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ] },
    plugins: [
      new HtmlWebpackPlugin({ template: path.join(directory, 'index.html') }),
      ...(name === 'shell' ? [new CopyWebpackPlugin({ patterns: [{ from: path.join(directory, 'public'), to: '.' }] })] : []),
      new ModuleFederationPlugin({
        name,
        ...(name === 'example' ? { filename: 'remoteEntry.js', exposes: { './Widget': path.join(directory, 'src/Widget.tsx'), './Screen': path.join(directory, 'src/Screen.tsx') } } : { remotes: { example: runtimeRemote } }),
        shared: {
          react: { singleton: true, strictVersion: true, requiredVersion: dependencies.react },
          'react-dom': { singleton: true, strictVersion: true, requiredVersion: dependencies['react-dom'] },
          'react-dom/client': { singleton: true, strictVersion: true, packageName: 'react-dom', requiredVersion: dependencies['react-dom'] },
        },
      }),
    ],
    devServer: { host: '127.0.0.1', port: name === 'shell' ? 3000 : 3001, headers: { 'Access-Control-Allow-Origin': '*' }, hot: true, historyApiFallback: true },
  };
};

/*
  File: webpack.config.js

  This file is generated by Emacs with configurations from Salt Ho for Webpack.

  About configuration for webpack: https://webpack.js.org/configuration/.

  You can find loaders here: https://webpack.js.org/loaders/.

  And find plugins here: https://webpack.js.org/plugins/.

  There are three ways of building sources,

  1. for development, the images will be inlined to avoid the bugs caused by file-loader, which will resolve the relative urls within css files

  2. for being static, you can view the files throught filesystem without backend support

  3. for backend depolyment, any urls of files are prefix "/", as "/css", "/js", "/html" "/img"

  The 'dist' structure will be same as 'src'.
*/
const Fs = require('fs');
const Path = require('path');
const WebPack = require('webpack');
// package html files to dist directory: https://github.com/jantimon/html-webpack-plugin#options
const HtmlWebpackPlugin = require('html-webpack-plugin');
// package css files from html files: https://webpack.js.org/plugins/mini-css-extract-plugin/
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// build a api mocker: https://github.com/jaywcjlove/webpack-api-mocker/tree/master/example/webpack
const ApiMocker = require('mocker-api');

const { VueLoaderPlugin } = require('vue-loader');
const AutoPrefixer = require('autoprefixer');

const DIST = '../dist',
      SRC = 'src',
      JS = 'js',
      HTML = 'html',
      CSS = 'css',
      MODULE = module,
      FORDEV = 0,
      FORSTAIC = 1,
      FORBACKEND = 2;

var entry = {
    index: `./${SRC}/${JS}/index.js`,
};

var output = {
    path: Path.resolve(__dirname, DIST),
    filename: `${JS}/[name].js?[hash]`,
};

var devServer = {
    before(app) {
        ApiMocker(
            app,
            Path.resolve('./mocker/index.js'),
            /*
              {
              proxy: {
              '/repos/*': 'https://api.github.com',
              },
              changeHost: true,
              }
              ...
            */
            // We can put options here instead of putting them in './mocker/index.js'
        );
    },
    port: 8080,
    host: '0.0.0.0', // needed if it was accessed from nginx container
    disableHostCheck: true, // this is needed because I have my docker container (Nginx) accesses the port
    contentBase: Path.resolve( __dirname, DIST),
    compress: true,
    inline: true,
    index: "/html/index.html",
    hot: true,
    historyApiFallback: {
        index: "/html/index.html",
    }
};

function moduleProxy(
    fileInlined=true, publicPaths={
        imgPublicPath: '/img',
        fontPublicPath: '/font',
        audioPublicPath: '/audio',
        videoPublicPath: '/video',
    }){
    var module = {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    // about 'options' key
                    // https://webpack.js.org/configuration/module/#rule-options-rule-query
                    options: {
                        // about babel-present-env
                        // https://babeljs.io/docs/en/babel-preset-env
                        presets: [
                            '@babel/preset-react',
                            [
                                '@babel/preset-env',
                                {
                                    // about browserslist reference
                                    // https://github.com/browserslist/browserslist
                                    // 'targets' : {
                                    //     'browsers': ['> 5%', 'not dead, last 2 versions'],
                                    // }
                                    'targets': '> 5%, not dead, last 2 versions',
                                },
                            ],
                        ],
                        plugins: [
                            ['@babel/plugin-proposal-decorators', {"legacy": true}],
                            ['@babel/plugin-proposal-class-properties']
                        ]
                    },
                },
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                AutoPrefixer
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                    }
                ]
            },
            {
                test: /\.(?:jpeg|png|gif|jpg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: fileInlined ? undefined : 1000,
                            fallback: 'file-loader',
                            outputPath: Path.relative(
                                Path.resolve(__dirname, DIST),
                                Path.resolve(__dirname, DIST, 'img')),
                            publicPath: publicPaths.imgPublicPath,
                            name: '[name].[ext]?[hash]',
                        }
                    },
                ]
            },
            {
                test: /\.(mp3|ogg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: Path.relative(
                                Path.resolve(__dirname, DIST),
                                Path.resolve(__dirname, DIST, 'audio')),
                            publicPath: publicPaths.audioPublicPath,
                            name: '[name].[ext]?[hash]'
                        }
                    }
                ]
            },
            {
                test: /\.(mp4)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: Path.relative(
                                Path.resolve(__dirname, DIST),
                                Path.resolve(__dirname, DIST, 'video')),
                            publicPath: publicPaths.videoPublicPath,
                            name: '[name].[ext]?[hash]'
                        }
                    }
                ]
            },

            {
                test: /\.(ttf|eot|svg|woff)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: Path.relative(
                                Path.resolve(__dirname, DIST),
                                Path.resolve(__dirname, DIST, 'font')),
                            publicPath: publicPaths.fontPublicPath,
                            name: '[name].[ext]?[hash]'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':src', ':data-src'],
                        // attrs: ['img:src', 'audio:src', 'source:src'] // no need to import images/audio/video in js files any more
                    }
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ],
    };

    return module;
}

var plugins = [
    // module hot reload, refresh module automatically while saving modifications.
    new MiniCssExtractPlugin({
        filename: Path.relative(
            Path.resolve(__dirname, DIST),
            Path.resolve(__dirname, DIST, 'css', '[name].css?[hash]')),
        chunkFilename: '[id].css'
    }),

    new WebPack.HotModuleReplacementPlugin(),

    new VueLoaderPlugin(),
];

var resolve = {
    alias: {
        'vue$': 'vue/dist/vue.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
};



MODULE.exports = function(env, argv) {

    let entry = MODULE.exports.entry,
        plugins = MODULE.exports.plugins,
        devServer = MODULE.exports.devServer,
        module = MODULE.exports.module,
        output = MODULE.exports.output,
        resolve = MODULE.exports.resolve,
        mode,
        forwhat;

    // to avoid the lexical error raised by ternjs
    for (var prop in env) {
        if (prop === 'forwhat')
        {
            forwhat = env[prop];
            break;
        }
    }

    if (forwhat === FORDEV) {

        module = moduleProxy(
            fileInlined=true,
            {
                imgPublicPath: "/img",
                fontPublicPath: '/font',
                audioPublicPath: '/audio',
                videoPublicPath: '/video',
            });
        output.publicPath = '/';
        mode = 'development';
    }
    else if (forwhat === FORSTAIC){
        module = moduleProxy(
            fileInlined=false,
            {
                imgPublicPath: "../img",
                fontPublicPath: '../font',
                audioPublicPath: '../audio',
                videoPublicPath: '../video'
            }
        );
        mode = 'production';
    }
    else if (forwhat === FORBACKEND){
        module = moduleProxy(
            fileInlined=false,
            {
                imgPublicPath: "/img",
                fontPublicPath: '/font',
                audioPublicPath: '/audio',
                videoPublicPath: '/video'
            });
        output.publicPath = '/';
        mode = 'production';
    }

    return {
        mode: mode,
        entry: entry,
        output: output,
        devServer: devServer,
        module: module,
        plugins: plugins,
        resolve: resolve
    };
};

MODULE.exports.plugins = plugins;
MODULE.exports.entry = entry;
MODULE.exports.module = moduleProxy();
MODULE.exports.output = output;
MODULE.exports.devServer = devServer;
MODULE.exports.resolve = resolve;

/*
  Every time to build a new page will be annoying for creating a html file and related javascript files,
  so I wrote this function to do these dirty works for me automatically.

  The only thing left is to configure your HtmlWebpackplugin list.
*/
function confHtmlPage(confs, htmlPath=HTML) {

    // if (!Fs.existsSync(Path.resolve(__dirname, DIST, htmlPath)))
    //     Fs.mkdirSync(Path.resolve(__dirname, DIST, htmlPath))

    MODULE.exports.plugins = MODULE.exports.plugins.concat(
        confs.map(
            conf => {
                let tpl = Path.resolve(__dirname, SRC, HTML, conf.template);
                conf.template = `./${SRC}/${HTML}/${conf.template}`;
                if (!Fs.existsSync(tpl))
                    Fs.writeFileSync(
                        tpl,
                        '<!DOCTYPE html>\n<html>\n    <head></head>\n    <body></body>\n</html>');
                for(let chunk of conf.chunks || []) {
                    if (!MODULE.exports.entry[chunk]) {
                        MODULE.exports.entry[chunk] = `./${SRC}/${JS}/${chunk}.js`;
                        let entry = Path.resolve(__dirname, MODULE.exports.entry[chunk]);
                        if (!Fs.existsSync(entry))
                            Fs.writeFileSync(entry, `console.log('Find me here: ${tpl}');`);
                    }

                }
                if (!conf.filename)
                    conf.filename = `${conf.template.match(/(?:.*\/)*(.+).html$/)[1]}.html`;
                conf.filename = `${htmlPath}${htmlPath.endsWith('/') ? '' : '/'}${conf.filename}`;
                if (!conf.inject === undefined) conf.inject = true;
                return new HtmlWebpackPlugin(conf);
            },
            confs)
    );
}

// Example for confHtmlPage
confHtmlPage(
    [
        {
            inject: true,
            filename: 'index.html',
            chunks: ['index'],
            template: 'index.html',
        }
    ]
);
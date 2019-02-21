const gulp = require("gulp");
const fs = require('fs');
const path = require('path');

const concat = require('gulp-concat');

const webpack = require('webpack');
const webpackConfigName = './webpack.config.js';
const webpackConfig = require(webpackConfigName);

const webpackStream = require('webpack-stream');

const pixiPath = 'node_modules/pixi.js/dist';
const howlerPath = 'node_modules/howler/dist';
const tweenLitePath = 'node_modules/gsap/src/minified';
const easePackPath = 'node_modules/gsap/src/minified/easing';

const BUILD_DATA_FILES = "data/**/*";
const BUILD_DIR = "dist";


gulp.task('addLibs',['copy:data'], () => {
    const indexPath = `./dist/index.html`;
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    const libFileName = 'lib.js';
    const script = `<script src="${libFileName}"></script>`;

    if (indexHtml.indexOf(script) === -1) {
        fs.writeFile(indexPath, indexHtml.replace('</head>', `${script}</head>`), err => {
            if (err) {
                console.log(err);
            }
        });
    }

    return gulp.src([`${howlerPath}/howler.js`,`${pixiPath}/pixi.js`,`${tweenLitePath}/plugins/BezierPlugin.min.js`,`${easePackPath}/EasePack.min.js`,`${tweenLitePath}/TweenLite.min.js`]).pipe(concat(libFileName)).pipe(gulp.dest("./dist/"));
});

gulp.task('copy:data', () => gulp.src(BUILD_DATA_FILES).pipe(gulp.dest(BUILD_DIR)));


gulp.task("default",['copy:data','addLibs'], ()=>gulp.src('src/Main.ts').pipe(webpackStream(webpackConfig, webpack)).pipe(gulp.dest("./")));

gulp.task("server", () => {
    const liteServer = require('lite-server');

process.chdir(path.resolve(BUILD_DIR));
liteServer.server();
});
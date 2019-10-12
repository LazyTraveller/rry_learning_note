1.预处理器
babel-loader 将es6编译成es5, 解决不同平台的兼容性问题 label-code  搭配使用
ty-loader  typescript预处理
html-loader  
file-loader  文件资源预处理
url-loader   
vue-loader  vue组件预处理
css-loader   style-loader  搭配使用
extract-text-webpack-plugin   将style标签中的样式提取到css文件中  
升级版   mini-css-extract-plugin  按需加载

sass-loader  sass-node  less-loader

css Modules  不需要安装模块， 只要开启css-loader中的modules的配置
{
    loader: 'css-loader',
    options: {
        modules: true,
        localIdentName: '[name]__[local]__[hash:base64:5]',
    }
}

style.css
.title{
    color: #f877944
}
import styles from './style.css'
document.write(`<h1 class="${styles.title}"></h1>`)



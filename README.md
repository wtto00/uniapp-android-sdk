# uniapp-android-sdk

lib files in uniapp android SDK.

- `files.json`: md5 索引，防止重复的文件
- `copy.mjs`: 处理 lib 文件的脚本。
- `index.mjs`: 部署脚本

## 提交新版本

1. 下载 [UniApp Android 离线 SDK](https://nativesupport.dcloud.net.cn/AppDocs/download/android.html) 到本地磁盘上，并解压，但是不要保存到本项目中。
1. 在 [NPM](https://www.npmjs.com/package/@dcloudio/uni-app-plus?activeTab=versions) 上查找对应的 UniApp SDK 版本号。比如:

   - `4.29` 对应 `3.0.0-4020920240930001`
   - `4.28` 对应 `3.0.0-4020820240925001`

1. 在本项目根目录，执行下面命令，处理保存的 SDK，使之有效的文件自动复制到本项目。

   ```shell
   node copy.mjs <本地保存解压后的SDK中SDK/libs目录的完整位置> <所对应的UniApp SDK版本号>
   ```

1. 提交 Git。

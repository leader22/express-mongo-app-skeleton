### Express x Mongodb でつくるログイン機能つきアプリのスケルトン

他に作りたいものができてしまったので、汎用的なカタチでとりあえずコミット。  

#### 実装済みの機能
- Mongodbによるセッション
- MongodbとMongooseによるユーザー/ログイン
- フォームのValidation
- Handlebarsによるテンプレート
- configファイルを実行環境によって判別

```sh
NODE_ENV=development supervisor app.js
```

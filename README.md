## LIX について
このアプリはHTML ビルダーです。
Next.js, Typescript, Postgresql で作成されています。
Docker で Node と Postgresql 環境を用意しています。
TailwindCSS, Sass でスタイリングをしています。
Eslint, Prettier でコードチェック・整形をしています。

## 認証について

### ログインページ

ユーザーがログイン情報を入力するためのインターフェースを提供します。ログインフォームの送信時に、ユーザーのメールアドレスとパスワードが API エンドポイント/api/login に POST リクエストとして送信されます。

### API エンドポイント

ログインリクエストを処理します。Prisma を使用してデータベースからユーザーを検索し、提供されたメールアドレスとパスワードが一致するユーザーが存在するかどうかを確認します。ユーザーが見つかった場合、ユーザーのメールアドレスがレスポンスとして返されます。

### ログイン状態の管理

Zustand という状態管理ライブラリを使用して、アプリケーション全体でユーザーのログイン状態を管理します。ログインが成功すると、ユーザーのメールアドレスがストアに保存され、isLoggedIn フラグが true に設定されます。また、ログイン状態はローカルストレージにも保存され、ページのリロード後も状態が保持されます。

### エディタ機能について

- 初期状態について
  ユーザーが新しいページを作成した際には、初めは空の HTML ボード（キャンバス）が表示されます。これは、ユーザーが自由に要素を追加、配置、編集できる空のスペースを提供するためのものです。
  この空の HTML ボードは、ユーザーがドラッグ＆ドロップやツールバーの操作を通じて新たな HTML 要素（例えば、<h1>, <p>, <img>など）を追加すると、その要素はこの空の HTML ボード上に配置されます。
  また、各要素は独自の状態（例えば、位置、サイズ、スタイルなど）を持ち、これらの状態は React の状態管理機能や Redux などを用いて管理されます。ユーザーが要素を移動したり、スタイルを変更したりすると、これらの状態が更新され、それに応じて HTML ボード上の要素の表示も動的に更新されます。

  - キャンバスについて

1. エディタの中心部にキャンバスを作成します。これは一般的には div 要素で表現され、特定のスタイル（例えば、背景色やサイズ）を適用します。

2. ドラッグ可能な要素のカスタマイズ：現在、すべてのドラッグ可能な要素が同じ見た目（DraggableComponent というテキスト）になっています。これを、各要素の type プロパティに基づいて異なる見た目にするようにカスタマイズします。例えば、type が"h1"の場合は大きなテキスト、"p"の場合は小さなテキスト、"img"の場合は画像アイコンなどを表示します。

3. ドロップ時の要素の作成：現在、ドロップされた要素はその type プロパティを表示するだけです。これを、ドロップされた要素の type に基づいて異なるコンポーネントを作成するように変更します。例えば、type が"h1"の場合は<h1>要素、"p"の場合は<p>要素、"img"の場合は<img>要素などを作成します。

4. 要素の編集機能：ドロップされた要素をクリックすると、その要素の詳細（例えば、テキストや画像の URL）を編集できるようにします。これには、モーダルやサイドバーなどの UI を作成し、その中で編集フォームを表示します。

5. 要素の移動とリサイズ：ドロップされた要素をドラッグして移動したり、そのサイズを変更したりできるようにします。これには、react-dnd ライブラリの useDrag と useDrop フックを再利用し、要素の位置やサイズのステートを管理します。

- ドラッグ＆ドロップ機能
  ユーザーが要素を直感的に配置できるようにするためには、ドラッグ＆ドロップ機能が必要です。これは HTML5 の Drag and Drop API や、React 用のライブラリである react-dnd などを使用して実装できます。

- ドラッグ可能な各要素について
  ドラッグ可能な各要素は、通常、プリセットのコンポーネントとして用意します。これらのコンポーネントは、HTML の基本的な要素（例えば、<h1>, <p>, <img>など）を模倣したもので、それぞれが特定のスタイルや機能を持つように設計されます。

  例えば、<h1>要素を模倣したコンポーネントは、大きなテキストを表示するためのもので、ユーザーがテキスト内容を編集できるようにすることができます。また、<img>要素を模倣したコンポーネントは、画像を表示するためのもので、ユーザーが画像の URL を入力したり、画像ファイルをアップロードしたりできるようにすることができます。

  それぞれのコンポーネントには、ドラッグ＆ドロップ機能を追加するためのコード（HTML5 の Drag and Drop API や react-dnd などを使用）が含まれます。

  これらのプリセットのコンポーネントをツールバーに表示し、ユーザーが選択して HTML ボードにドラッグ＆ドロップできるようにします。そして、ユーザーがコンポーネントを HTML ボードに配置したら、そのコンポーネントの状態（位置、サイズ、スタイルなど）を管理し、ユーザーがそれを自由に編集できるようにします。

- コンポーネントの状態管理
  ユーザーが行った変更を保存し、再度ロードできるようにするためには、状態管理が必要です。これは React の Zustand を使用します。

- サーバーサイドの保存
  ユーザーが作成したページを保存し、後で再度開けるようにするためには、サーバーサイドでのデータ保存が必要です。Prisma を使用して PostgreSQL に保存します。

- ダウンロード機能
  作成した Web サイトの HTML, CSS, JS を 1 つの HTML としてダウンロードする機能です。
  まず、ユーザーが作成した Web サイトの HTML, CSS, JS を生成します。これは、ユーザーが追加・編集した各要素の状態を元に HTML, CSS, JS を動的に生成します。
  次に、生成した CSS と JS を HTML に埋め込みます。CSS は<style>タグ内に、JS は<script>タグ内に埋め込むことができます。
  最後に、生成した HTML をダウンロードできるようにします。これは、JavaScript の Blob オブジェクトと URL.createObjectURL()メソッドを使用して、生成した HTML を表す URL を作成し、その URL を<a>タグの href 属性に設定することで実現できます。そして、<a>タグの download 属性を設定することで、リンクをクリックしたときにファイルがダウンロードされるようにします。

- リアルタイムプレビュー
  ユーザーがページを編集すると同時に、その変更がリアルタイムでプレビューに反映されます。これにより、ユーザーは自分が行っている変更がどのように見えるかをすぐに確認することができます。

- リッチなコンポーネントライブラリ
  テキスト、画像、ビデオ、マップ、ボタンなど、さまざまな種類のコンポーネントを提供しています。これらのコンポーネントは、ユーザーが自分のウェブサイトに追加して自由にカスタマイズできます。

- テンプレート
  ユーザーが自分のウェブサイトの作成を始めるための多数のプロフェッショナルなテンプレートを提供しています。

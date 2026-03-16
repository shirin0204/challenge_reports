---
challengeId: "linux-filesystem-top-level"
reportId: "day06"
day: 6
title: "Day 6: /home"
summary: "homeディレクトリを学習。"
publishedAt: "2026-03-16"
draft: false
---

## ディレクトリの概要

/homeは一般ユーザーの個人データを保存するディレクトリ。

Linuxではユーザごとに専用のフォルダが作られ、そのユーザの設定やファイルは基本ここに保存される。

```jsx
la -1 /home/<username>
.bash_history
.bash_logout
.bashrc
.cache
.config
.copilot
Desktop
Documents
.dotnet
Downloads
.gitconfig
.gnupg
go
google-chrome-stable_current_amd64.deb
.gphoto
.lesshst
.local
Music
.npm
.nvm
Pictures
.pki
.profile
Public
snap
.ssh
.sudo_as_admin_successful
Templates
Videos
.vscode
.zcompdump
.zsh_history
.zshrc
```

※.(ドット)で始まるファイル(ディレクトリ)は隠しファイル(ディレクトリ)

## 中身の分類

### シェル設定・履歴

ターミナルの動作に関係するファイル。

| ファイル | 役割 |
| --- | --- |
| `.bashrc` | bashの設定 |
| `.bash_logout` | ログアウト時の処理 |
| `.zshrc` | zshの設定 |
| `.bash_history` | bashコマンド履歴 |
| `.zsh_history` | zshコマンド履歴 |
| `.zcompdump` | zsh補完キャッシュ |

※zsh補完キャッシュとは、Tab補完機能を高速化するためのキャッシュ

例）
ユーザー入力`git <TAB>`
↓
zsh が _comps を確認
↓
git → _git
↓
_git 関数を実行
↓
補完候補を生成


### アプリケーション設定

Linuxアプリがユーザ設定を保存する場所。

| ディレクトリ | 内容 |
| --- | --- |
| `.config` | 多くのアプリの設定 |
| `.cache` | アプリのキャッシュ |
| `.local` | ローカルデータ（ユーザー専用のアプリデータ・実行ファイル） |
| `.pki` | ブラウザなどのPKI証明書（暗号通信をする際、相手の正当性を確認する） |
| `.ssh` | SSH鍵 |
| `.gnupg` | GPG鍵 |
| `.npm` | npm設定 |
| `.nvm` | Node Version Manager |
| `.vscode` | VSCode設定 |
| `.copilot` | GitHub Copilot |

※GPG鍵はファイルやメールの暗号化と電子署名に使う鍵

`.local`の中身

```jsx
la -1 ~/.local
bin  ※自分だけの/bin
share ※ユーザ用のアプリデータ（.desktopファイルやアイコンなど）
state　※アプリの状態情報（セッション状態、アプリ履歴など）
```

### ユーザデータ

普通のファイル保存用ディレクトリ。GUI環境が自動生成する。

| ディレクトリ | 用途 |
| --- | --- |
| Desktop | デスクトップ |
| Documents | 文書 |
| Downloads | ダウンロード |
| Music | 音楽 |
| Pictures | 画像 |
| Videos | 動画 |
| Public | 公開用 |
| Templates | 新規作成用のテンプレート |

### 開発ツール関連

| ディレクトリ | 内容 |
| --- | --- |
| `go` | Go言語のワークスペース |
| `.dotnet` | .NET SDK |
| `.gitconfig` | Git設定 |

### その他

| ファイル | 内容 |
| --- | --- |
| `.sudo_as_admin_successful` | sudo実行の記録 |
| `.lesshst` | lessコマンド履歴 |
| `snap` | snapパッケージ |
---
challengeId: "linux-filesystem-top-level"
reportId: "day03"
day: 4
title: "Day 3: /boot"
summary: "bootディレクトリを学習。"
publishedAt: "2026-03-13"
draft: false
---

## ディレクトリの概要

`/boot`はLinuxの起動に必要なファイルを保存するディレクトリ。

カーネルやinitramfs、ブートローダー関連ファイルが置かれている。

PC起動時の流れの中で、

**ブートローダー→カーネル**起動の部分に関わる重要な場所

`/boot`の中身

```jsx
%la -1
config-6.14.0-37-generic
config-6.17.0-14-generic
efi
grub
initrd.img
initrd.img-6.14.0-37-generic
initrd.img-6.17.0-14-generic
initrd.img.old
memtest86+ia32.bin
memtest86+ia32.efi
memtest86+x64.bin
memtest86+x64.efi
System.map-6.14.0-37-generic
System.map-6.17.0-14-generic
vmlinuz
vmlinuz-6.14.0-37-generic
vmlinuz-6.17.0-14-generic
vmlinuz.old
```

※laはls -aのエイリアス

## Linuxカーネル

/boot内にあるLinuxカーネルとは、常に動いているカーネル本体のことではなく、

起動時に読み込むためのカーネルの実体ファイルのこと。

`vmlinuz` がこれに当たり、圧縮された実行バイナリである。

- `vm` virtual memory
- `linu` Linux
- `z` gzip圧縮

カーネル更新時に旧バージョンも残すため、ファイルは複数ある。

（新カーネルでの起動失敗時やドライバ不具合時に旧カーネルでの起動をするため。）

※起動後、動いているカーネルはメモリ上で動作する。

## ブートローダ

ブートローダーとは、PC起動時にOSをメモリに読み込んで起動させるプログラムのこと。

電源を入れた直後、ブートローダーが

1. OSの場所を探す
2. カーネルをメモリに読み込む
3. カーネルを起動する

という作業を行う

GRUBはLinuxでよく使われるブートローダーの名前で、

GNU gRand Unified Bootloader の略

## initramfs

起動初期に使うミニLinuxで、カーネル単体では

- ディスク
- ファイルシステム
- ドライバ

をまだ十分扱えないことがあるため、`initramfs`が一時的に起動して、

- ストレージドライバ読み込み
- root filesystem検出
- 必要なモジュールロード

などを行う。

その後、実際のroot filesystem(/)へ切り替わる。

## カーネル設定

```jsx
config-6.14.0-37-generic
config-6.17.0-14-generic
```

ここにはカーネルビルド時の設定が入っており、

- どの機能を有効にしたか
- モジュールが組み込みか

などを記録している。

※ビルドとは、ソースコードから実行できるプログラムを作る作業のこと。

## System.map

カーネルシンボルテーブルで、カーネルの関数名とメモリアドレスの対応表。

（関数名→メモリ上の場所を一覧にしたファイル）

形式は

メモリアドレス　種別　シンボル名

になっている

```jsx
%sudo head System.map-6.14.0-37-generic
0000000000000000 D __per_cpu_start
0000000000000000 D fixed_percpu_data
0000000000001000 D cpu_debug_store
0000000000002000 D irq_stack_backing_store
0000000000006000 D cpu_tss_rw
000000000000b000 D gdt_page
000000000000c000 d exception_stacks
0000000000018000 d entry_stack_storage
0000000000019000 D espfix_waddr
0000000000019008 D espfix_stack
```

| 種別 | 意味 |
| --- | --- |
| **T** | テキスト領域（関数・実行コード） |
| **D** | 初期化済みデータ（グローバル変数など） |
| **B** | 未初期化データ（BSS領域） |
| **R** | 読み取り専用データ |
| **A** | 絶対アドレス |
| **U** | 未定義シンボル |

主な用途は

- カーネルデバッグ
- クラッシュ解析
- カーネル開発

## ブートローダー関連

`grub`

GRUBブートローダーの設定が含まれており、どのカーネルで起動するかを決める。

`efi`

UEFIブート用ファイルで、PCがUEFIの場合ここを使う。

※UEFIはBIOSの後継となるファームウェア仕様で、下記の役割を担っている

　・ハードウェア初期化

　・起動デバイスの確認

　・OSの起動

## メモリテストツール

```jsx
memtest86+x64.bin
memtest86+x64.efi
memtest86+ia32.bin
```

RAMの故障チェックツール

メモリテストは

1. RAｍに特定の値を書く
2. その値を読み出す
3. 一致しているか確認

という流れで確認を行う。

PCが頻繁にフリーズしたり、原因不明のクラッシュが起こったときにRAM故障の可能性を調べるために使う。
---
challengeId: "linux-filesystem-top-level"
reportId: "day08"
day: 8
title: "Day 8:/media と /mnt"
summary: "mediaディレクトリとmntディレクトリを学習。"
publishedAt: "2026-03-18"
draft: false
---

## Linuxの仕組みとの関係

Linuxではストレージはそのままは使用できず、マウントして初めて使える。マウントによって、異なるストレージも１つのディレクトリ構造として扱える。

すべてのストレージはディレクトリツリーに統合される。

`/media`は自動マウント用

`/mnt`は手動マウント用（管理者向け）

## ディレクトリの概要

### /media

`/media`は、USBメモリや外付けHDDなどのリムーバブルメディアを（主にデスクトップ環境で）自動マウントされる場所。ユーザがデバイス接続したときに使われる。

- USBメモリやSDカードのマウント先
- 外付けのストレージの一時的な接続場所
- GUI環境での自動マウント先ディレクトリ

※マウントとは、ストレージの中身をLinuxのディレクトリとしてアクセスできるようにすること。（デバイスをフォルダとして扱えるようにする仕組み）

### /mnt

`/mnt`は、一時的にストレージを手動でマウントするためのディレクトリ。主に管理者が検証や作業目的で使う「作業用のマウントポイント」。

- 手動でディスクやISOをマウントする場所
- 一時的な検証/作業用のマウントポイント
- 自動マウント(/media)とは別の管理者用エリア

※ISOとはCD/DVDなどの光ディスクの中身を、構造ごと１つのファイルにまとめたディスクイメージ

## よくある中身

### /media

- `/media/ユーザー名/USB名` USBを挿すと自動で作られるディレクトリ。中にファイルが見える
- `/media/ユーザー名/SDカード名` SDカードも同様に自動マウントされる
- `/media/ユーザー名/外付けHDD名` 大容量ストレージもここに接続される
- `/media/cdrom` CD/DVDドライブ用のマウントポイント
- `/media/floppy` フロッピーディスク（古..）

### /mnt

基本的に固定の中身はなく、用途に応じて自由に作る。

- `/mnt/backup` バックアップ用ディスクをマウントして使う
- `/mnt/test` 新しいディスクや設定の検証用
- `/mnt/iso` ISOファイルをマウントして中身を確認する
- `/mnt/data` 一時的に外部ストレージを接続

## 検証してみる

### /mnt

```jsx
%dd if=/dev/zero of=sample.img bs=1M count=10
10+0 records in
10+0 records out
10485760 bytes (10 MB, 10 MiB) copied, 0.00820565 s, 1.3 GB/s
```

- `dd` バイト単位でそのままコピーするコマンド
- `if=/dev/zero` 入力：0を出し続ける特殊デバイス
- `of=sample.img` 出力：sample.imgに書く
- `bs=1M` 一回に１MB書く
- `count=10` 10回書く

（つまり中身が全部0の10MBのファイルができる）

```jsx
%mkfs.ext4 sample.img
mke2fs 1.47.0 (5-Feb-2023)
Discarding device blocks: done                            
Creating filesystem with 2560 4k blocks and 2560 inodes

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (1024 blocks): done
Writing superblocks and filesystem accounting information: done
```

- `mkfs.ext4` ext4のシステム構造を書き込む

```jsx
%sudo mount -o loop sample.img ~/mnt_test/
```

- `mount` ファイルシステムをディレクトリに接続

マウント対象：sample.img、マウントポイント：~/mnt_test

- `-o loop` ファイルをデバイスとして扱うためのオプション

流れ：

sample.imgを読む
↓

中にあるext4ファイルシステムを認識

↓
loopデバイスに割り当て（カーネルが仮想デバイスを作る）
↓
`/mnt_test` に接続

※GUI上にもmountされた`mnt_test`が表示された

![image.png](attachment:16df5569-5e55-4b64-8c27-bb45143034af:image.png)

```jsx
%sudo mount -o loop sample.img ~/mnt_test/
%ls ~/mnt_test/
lost+found
%sudo touch ~/mnt_test/hello.txt
%ls ~/mnt_test/
hello.txt  lost+found
```

※`~/mnt_test`に書き込んでいるように見えるが、実際には`sample.img`の中にデータが保存されている。

```jsx
%sudo umount ~/mnt_test
%ls ~/mnt_test/
（何もない）
```

アンマウントすると仮想デバイスが切断され、`~/mnt_test`の中身が見えなくなる

```jsx
%sudo mount -o loop sample.img ~/mnt_test/
%ls ~/mnt_test/
hello.txt  lost+found
```

再マウントするとさっき作った`hello.txt`が見える

### /media

```jsx
%sudo mkdir -p /media/$USER/testusb 
%sudo mount -o loop sample.img /media/$USER/testusb
%ls /media/$USER/testusb
hello.txt  lost+found
```

`/media/$USER/testusb`ディレクトリを作成し、さっき作った`sample.img`をマウント

中身を確認すると、先程作成した`hello.txt`が入っている。

```jsx
%sudo umount /media/$USER/testusb
%ls /media/$USER/testusb
```

アンマウント後にもう一度`media/$USER/testusb`ディレクトリを確認すると中身が見えなくなる。
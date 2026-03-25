---
challengeId: "linux-filesystem-top-level"
reportId: "day10"
day: 10
title: "Day 10:/proc"
summary: "procディレクトリを学習。"
publishedAt: "2026-03-20"
draft: false
---

## ディレクトリの概要

`/proc` はLinuxカーネルの状態をファイルとして見せている特殊なディレクトリ。実際のファイルではなく、**メモリ上の情報をリアルタイムで表示する**仮想ファイルシステム。

- システム情報（CPU, メモリ等）の確認
- 実行中プロセスの状態確認
- カーネル設定の参照・変更

## よくある中身

- `/proc/cpuinfo` CPUの情報（コア数・モデルなど）を確認できる
- `/proc/meminfo` メモリ仕様状況（空き・使用量）を確認できる
- `/proc/uptime` システムが起動してからの経過時間
- `/proc/[PID]` 各プロセスごとの情報ディレクトリ（PID単位）
- `proc/sys` カーネルパラメータ（設定値）を管理する場所

## 実際の中身を見てみる

### cpuinfo

```jsx
cat proc/cpuinfo
processor	: 0
vendor_id	: AuthenticAMD
cpu family	: 23
model		: 96
model name	: AMD Ryzen 5 4500U with Radeon Graphics
stepping	: 1
microcode	: 0x860010f
cpu MHz		: 3709.207
cache size	: 512 KB
physical id	: 0
siblings	: 6
core id		: 0
cpu cores	: 6
apicid		: 0
initial apicid	: 0
fpu		: yes
fpu_exception	: yes
cpuid level	: 16
wp		: yes
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ht syscall nx mmxext fxsr_opt pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology nonstop_tsc cpuid extd_apicid aperfmperf rapl pni pclmulqdq monitor ssse3 fma cx16 sse4_1 sse4_2 movbe popcnt aes xsave avx f16c rdrand lahf_lm cmp_legacy svm extapic cr8_legacy abm sse4a misalignsse 3dnowprefetch osvw ibs skinit wdt tce topoext perfctr_core perfctr_nb bpext perfctr_llc mwaitx cpb cat_l3 cdp_l3 hw_pstate ssbd mba ibrs ibpb stibp vmmcall fsgsbase bmi1 avx2 smep bmi2 cqm rdt_a rdseed adx smap clflushopt clwb sha_ni xsaveopt xsavec xgetbv1 cqm_llc cqm_occup_llc cqm_mbm_total cqm_mbm_local clzero irperf xsaveerptr rdpru wbnoinvd arat npt lbrv svm_lock nrip_save tsc_scale vmcb_clean flushbyasid decodeassists pausefilter pfthreshold avic v_vmsave_vmload vgif v_spec_ctrl umip rdpid overflow_recov succor smca
bugs		: sysret_ss_attrs spectre_v1 spectre_v2 spec_store_bypass retbleed smt_rsb srso ibpb_no_ret spectre_v2_user vmscape
bogomips	: 4741.22
TLB size	: 3072 4K pages
clflush size	: 64
cache_alignment	: 64
address sizes	: 48 bits physical, 48 bits virtual
power management: ts ttp tm hwpstate cpb eff_freq_ro [13] [14]

（後略）
```

- `cpu cores	: 6` 物理コア数=6
- `siblings	: 6` 論理CPU数=6
- `processor	: 0` 論理CPUごとの番号（0~5の合計6個）
- `cpu MHz		: 3709.207` クロック周波数（CPUの処理スピード、動的に変化）
- `flags		: fpu vme de pse tsc msr...` CPUが対応している機能一覧
- `bugs		: sysret_ss_attrs spectre_v1 spectre_v2 ...` CPUの脆弱性情報

### meminfo

```jsx
cat proc/meminfo
MemTotal:       15682236 kB
MemFree:         4743960 kB
MemAvailable:   10130764 kB
Buffers:          338584 kB
Cached:          3991076 kB
SwapCached:            0 kB
Active:          5195804 kB
Inactive:        3255552 kB
Active(anon):    3546104 kB
Inactive(anon):        0 kB
Active(file):    1649700 kB
Inactive(file):  3255552 kB
Unevictable:         172 kB
Mlocked:             172 kB
SwapTotal:       4194300 kB
SwapFree:        4194300 kB
Zswap:                 0 kB
Zswapped:              0 kB
Dirty:              1880 kB
Writeback:             4 kB
AnonPages:       4121840 kB
Mapped:          1116520 kB
Shmem:             47412 kB
KReclaimable:     816232 kB
Slab:            1109708 kB
SReclaimable:     816232 kB
SUnreclaim:       293476 kB
KernelStack:       23488 kB
PageTables:        60800 kB
SecPageTables:      2276 kB
NFS_Unstable:          0 kB
Bounce:                0 kB
WritebackTmp:          0 kB
CommitLimit:    12035416 kB
Committed_AS:   16198788 kB
VmallocTotal:   34359738367 kB
VmallocUsed:       87192 kB
VmallocChunk:          0 kB
Percpu:             7776 kB
HardwareCorrupted:     0 kB
AnonHugePages:         0 kB
ShmemHugePages:        0 kB
ShmemPmdMapped:        0 kB
FileHugePages:     67584 kB
FilePmdMapped:         0 kB
CmaTotal:              0 kB
CmaFree:               0 kB
```

- `MemTotal:       15682236 kB` 搭載されているメモリ総量（約15GB）
- `MemFree:         4743960 kB` 未使用のメモリ（あまり重要じゃない）
- `MemAvailable:   10130764 kB` 実際にアプリが使える空きメモリ量
- `Cached:          3991076 kB` ファイルキャッシュ（最近使ったデータをメモリに保存）
- `Buffers:          338584 kB` ディスク書き込み用のバッファ
- `Active:          5195804 kB` 最近使われているメモリ
- `Inactive:        3255552 kB` あまり使われていない（開放候補）メモリ
- `SwapTotal:       4194300 kB` 仮想メモリ（約4GB）

### /proc/1

```jsx
ls -1 proc/1
arch_status
attr
autogroup
auxv
cgroup
clear_refs
cmdline
comm
coredump_filter
cpu_resctrl_groups
cpuset
cwd
environ
exe
fd
fdinfo
gid_map
io
ksm_merging_pages
ksm_stat
latency
limits
loginuid
map_files
maps
mem
mountinfo
mounts
mountstats
net
ns
numa_maps
oom_adj
oom_score
oom_score_adj
pagemap
patch_state
personality
projid_map
root
sched
schedstat
sessionid
setgroups
smaps
smaps_rollup
stack
stat
statm
status
syscall
task
timens_offsets
timers
timerslack_ns
uid_map
wchan
```

/proc/1/statusの中身（一部抜粋）

```jsx
cat proc/1/status
Name:	systemd
Umask:	0000
State:	S (sleeping)
Tgid:	1
Ngid:	0
Pid:	1
PPid:	0
TracerPid:	0
Uid:	0	0	0	0
Gid:	0	0	0	0
FDSize:	512
...
VmPeak:	   23708 kB
VmSize:	   23536 kB
VmLck:	       0 kB
VmPin:	       0 kB
VmHWM:	   14776 kB
VmRSS:	   14776 kB
...
Cpus_allowed:	3f
Cpus_allowed_list:	0-5
voluntary_ctxt_switches:	24981
nonvoluntary_ctxt_switches:	2803
```

- `PID 1` systemd（init）
- `PPid 0`  親なし（最初のプロセス）
- `Uid 0` root権限

つまり、OSの起点プロセス

- `State:	S (sleeping)` 待機中、イベント待ち
- `VmRSS:	   14776 kB` 実際に使っている物理メモリ（約14MB）
- `Cpus_allowed_list:	0-5` CPU割当（全CPU使用可能）
- `voluntary_ctxt_switches:	24981` 自分からCPUを譲った回数（CPUは1つのコアで同時に1つの処理しかできないので、プロセス同士でスケジューリングが行われる）
## **Overview**:

Tiny nodejs script that parses virt-top output and converts it into InfluxDB format, file is dumped in /tmp directory and can be read by telegraf. Requires virt-top.

## **Example output of virt-top**:
```
Hostname,Time,Arch,Physical CPUs,Count,Running,Blocked,Paused,Shutdown,Shutoff,Crashed,Active,Inactive,%CPU,Total hardware memory (KB),Total memory (KB),Total guest memory (KB),Total CPU time (ns),Domain ID,Domain name,CPU (ns),%CPU,Mem (bytes),%Mem,Block RDRQ,Block WRRQ,Net RXBY,Net TXBY
Sirius,21:03:02,x86_64,16,4,3,0,0,0,0,0,3,1,0.0,32817036,22020096,22020096,0,1,Polaris,0.,0.,0,0,,,,,2,Mimosa,0.,0.,0,0,,,,,3,Proxima,0.,0.,0,0,,,,
Sirius,21:03:05,x86_64,16,4,3,0,0,0,0,0,3,1,3.0,32817036,22020096,22020096,1438745971,1,Polaris,96054875.,0.198921324126,3145728,9,0,0,606,889,2,Mimosa,421128343.,0.872120312648,8388608,25,0,0,1140,0,3,Proxima,921562753.,1.90847661914,10485760,31,0,2,1140,0
```

## **Example output of this script**:
```
vmhost,host=Sirius Time="21:05:05",Architecture="x86_64",CpuCount=16,VMCount=4,VMRunning=3,VMBlocked=0,VMPaused=0,VMShuttingDown=0,VMShutOff=0,VMCrashed=0,VMActvive=3,VMInactive=1,CpuUse=3.0,RamHardwareTotal=32817036,RamTotal=22020096,RamGuestTotal=22020096,CpuTimeTotal=1462884330
virtualmachine,name=Polaris TotalCpu=71086847.,CpuUsage=0.147203142178,TotalMemory=3145728,MemoryUsage=9,BlockRDRQ=0,BlockWRRQ=0,NetRXBY=5742,NetTXBY=1239
virtualmachine,name=Mimosa TotalCpu=424499137.,CpuUsage=0.879031908932,TotalMemory=8388608,MemoryUsage=25,BlockRDRQ=0,BlockWRRQ=0,NetRXBY=5978,NetTXBY=112
virtualmachine,name=Proxima TotalCpu=967298346.,CpuUsage=2.00303378141,TotalMemory=10485760,MemoryUsage=31,BlockRDRQ=0,BlockWRRQ=0,NetRXBY=6161,NetTXBY=126
```

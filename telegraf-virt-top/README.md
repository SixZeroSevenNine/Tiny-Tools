## **Overview**:

Tiny nodejs script that parses virt-top output and converts it into InfluxDB format, file is dumped in /tmp directory and can be read by telegraf.

## **Example output**:
```
Hostname,Time,Arch,Physical CPUs,Count,Running,Blocked,Paused,Shutdown,Shutoff,Crashed,Active,Inactive,%CPU,Total hardware memory (KB),Total memory (KB),Total guest memory (KB),Total CPU time (ns),Domain ID,Domain name,CPU (ns),%CPU,Mem (bytes),%Mem,Block RDRQ,Block WRRQ,Net RXBY,Net TXBY
Sirius,21:03:02,x86_64,16,4,3,0,0,0,0,0,3,1,0.0,32817036,22020096,22020096,0,1,Polaris,0.,0.,0,0,,,,,2,Mimosa,0.,0.,0,0,,,,,3,Proxima,0.,0.,0,0,,,,
Sirius,21:03:05,x86_64,16,4,3,0,0,0,0,0,3,1,3.0,32817036,22020096,22020096,1438745971,1,Polaris,96054875.,0.198921324126,3145728,9,0,0,606,889,2,Mimosa,421128343.,0.872120312648,8388608,25,0,0,1140,0,3,Proxima,921562753.,1.90847661914,10485760,31,0,2,1140,0
```

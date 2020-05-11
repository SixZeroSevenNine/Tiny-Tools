const fs = require('fs');
const cp = require('child_process');

const vmHostColumns = [
    "HostName",
    "Time",
    "Architecture",
    "CpuCount",
    "VMCount",
    "VMRunning",
    "VMBlocked",
    "VMPaused",
    "VMShuttingDown",
    "VMShutOff",
    "VMCrashed",
    "VMActvive",
    "VMInactive",
    "CpuUse",
    "RamHardwareTotal",
    "RamTotal",
    "RamGuestTotal",
    "CpuTimeTotal"];

const vmColumns = [
    "ID",
    "DomainName",
    "TotalCpu",
    "CpuUsage",
    "TotalMemory",
    "MemoryUsage",
    "BlockRDRQ",
    "BlockWRRQ",
    "NetRXBY",
    "NetTXBY"];

const sourceCsv = "/tmp/telegraf-virt-top.csv";
const targetInflux = "/tmp/telegraf-virt-top.influxdb";

cp.exec("/usr/bin/virt-top -n 2 -b --script --csv /tmp/telegraf-virt-top.csv", function (err, stdout, stderr) {
    // handle err, stdout, stderr
    let result = {};
    const data = fs.readFileSync(sourceCsv, { encoding: 'utf8', flag: 'r' });
    let rows = data.split("\n");
    if (rows.length >= 3) {
        // telegraf-virt-top.sh output:
        // Row 0 = header.
        // Row 1 = useless, all stats at zero.
        // Row 2 = data we need to parse.
        dataRow = rows[2].split(",");
        let host = {};
        let vms = [];

        // Parse host information.
        for (let i = 0; i < vmHostColumns.length; i++) {
            host[vmHostColumns[i]] = dataRow[i];
        }

        // We got at least one VM?
        if (dataRow.length > vmHostColumns.length && dataRow.length > vmHostColumns.length) {
            var vmData = dataRow.slice(vmHostColumns.length);
            for (let i = 0, j = 0, vmNo = 0; i < vmData.length; i++) {
                if (i % vmColumns.length === 0 && i != 0) {
                    j = 0;
                    vmNo++;
                }
                if (typeof vms[vmNo] === "undefined") {
                    vms[vmNo] = {};
                }
                vms[vmNo][vmColumns[j]] = vmData[i];
                j++;
            }
        }
        result.Host = host;
        result.VMs = vms;

        // Influx db protocol line, vm host.
        let influxHost = "vmhost,host=" + result.Host.HostName + " ";
        for (let i = 1; i < vmHostColumns.length; i++) {
            let value = result.Host[vmHostColumns[i]];
            if (["Time","Architecture"].indexOf(vmHostColumns[i]) != -1) {
                value = "\"" + value + "\"";
            }
            influxHost = influxHost + (i == 1 ? "" : ",") + vmHostColumns[i] + "=" + value;
        }
        influxHost = influxHost + "\n";

        // Influx db protocol line, vms.
        for (let i = 0; i < result.VMs.length; i++) {
            let influxVm = "virtualmachine,name=" + result.VMs[i].DomainName + " ";
            for (let j = 2; j < vmColumns.length; j++) {
                influxVm = influxVm + (j == 2 ? "" : ",") + vmColumns[j] + "=" + result.VMs[i][vmColumns[j]];
            }
            influxVm = influxVm + "\n";
            influxHost += influxVm;
        }
        fs.writeFileSync(targetInflux, influxHost, { mode: 0o644 });
    }
    else {
        console.error("Invalid data.");
    }
});

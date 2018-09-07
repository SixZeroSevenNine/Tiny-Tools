window.ParsedDisks = (function(disks) {
	function FindLineIndex(lines, startsWith) {
		for (var i=0; i < lines.length; i++) {
			if (lines[i].indexOf(startsWith) == 0) {
					return i + 0;
			}
		}
		return -1;
	}
	
	function ParseDisks(disks) {
		var result = [];
		for (var i in disks) { 
		    var disk = {};
		    disk.Device = disks[i].Device;
		    disk.Timestamp = disks[i].Timestamp;
			disk.DiskInfo = [];
			disk.SmartAttributes = [];
			
		    var lines = disks[i].RawData.split("__NEWLINE__");
			
			// Device information starts from line below this one.
			var infoStart = FindLineIndex(lines, "=== START OF INFORMATION SECTION ===") + 1; 
			
			// 2 of these lines to indicate end of device information.
			var infoEnd = FindLineIndex(lines, "SMART support is:") + 1; 
			
			// SMART data starts from line below this one.
			var smartStart = FindLineIndex(lines, "ID#") + 1; 
			
			// SMART data is last part in lines collection.
			var smartEnd = lines.length;
			
			// Parse the disk information.
			for (var i = infoStart; i <= infoEnd; i++) {
				var split = lines[i].split(':');
				var key = split[0].trim();
				var value = split.slice(1).join(':').trim();
				
				// Skip some warnings for firmware updates (Seagate mostly).
				if (key != "" && key.indexOf('==> WARNING') == -1 && value != "" && key.indexOf('http') == -1) {
				    disk.DiskInfo.push({"Key": key, "Value": value});
				}
			}

			/*
			Parsing SMART data can't be split, has to be parsed as fixed length text columns. Example:
			
ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      UPDATED  WHEN_FAILED RAW_VALUE

0000000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
  5 Reallocated_Sector_Ct   0x0032   100   100   000    Old_age   Always       -       0
  9 Power_On_Hours_and_Msec 0x0032   100   100   000    Old_age   Always       -       15968h+16m+22.440s
 12 Power_Cycle_Count       0x0032   099   099   000    Old_age   Always       -       1313
			*/
			for (var i = smartStart; i< smartEnd; i++) {
				var smartAttributes = {};
				smartAttributes.Id = lines[i].substr(0,3).trim();
				smartAttributes.Attribute = lines[i].substr(4,23).trim();
				smartAttributes.Flag = lines[i].substr(28,6).trim();
				smartAttributes.Value = lines[i].substr(37,3).trim();
				smartAttributes.Worst = lines[i].substr(43,3).trim();
				smartAttributes.Threshold = lines[i].substr(49,3).trim();
				smartAttributes.Type = lines[i].substr(56,9).trim();
				smartAttributes.Updated = lines[i].substr(66,8).trim();
				smartAttributes.WhenFailed = lines[i].substr(75,11).trim();
				if (smartAttributes.WhenFailed == "-") { smartAttributes.WhenFailed = "Never"; }
				smartAttributes.RawValue = lines[i].substr(87,11).trim();
				disk.SmartAttributes.push(smartAttributes);
			}
			SetAlerts(disk.SmartAttributes);
			result.push(disk);
		}
		return result;
	}
	
	// Sets alert levels for view to be able to color code 
	function SetAlerts(smartAttributes) {
	    for (var i = 0; i< smartAttributes.length; i++) {
			// We'll analyse the following properties and determine if they are healthy.
			// This is based on Backblaze's data for which SMART attributes indicate 
			// impending disk failures.
			
			// Current pending sector count.
			if (smartAttributes[i].Id == 197) {
				SetWarningLevel(smartAttributes[i], 10, 5);
			}
			
			// Reallocated sector count.
			if (smartAttributes[i].Id == 5) {
				SetWarningLevel(smartAttributes[i], 10, 5);
			}
			
			// Offline uncorrectable.
			if (smartAttributes[i].Id == 198) {
				SetWarningLevel(smartAttributes[i], 4, 2);
			}
			
			// Reported uncorrected.
			if (smartAttributes[i].Id == 187) {
				SetWarningLevel(smartAttributes[i], 4, 2);
			}
			
			// Some of the below might be specific to brands.
			// Intel SSDs, NAND wearout indicator.
			if (smartAttributes[i].Id == 233) {
				SetWarningLevel(smartAttributes[i], 25, 75, false, true);
			}
			
			// Intel SSDs, available reserved space.
			if (smartAttributes[i].Id == 232) {
				SetWarningLevel(smartAttributes[i], 25, 75, false, true);
			}
			
			// Intel SSDs, program fail.
			if (smartAttributes[i].Id == 171) {
				SetWarningLevel(smartAttributes[i], 5, 10);
			}
			
			// Intel SSDs, erase fail.
			if (smartAttributes[i].Id == 172) {
				SetWarningLevel(smartAttributes[i], 5, 10);
			}
	    }
	}
	
	// For each watched attribute we'll add a member WarningLevel to the model
	// if raw value is bigger or equal than the warning or the error threshold. 
	// WarningLevel will be set to 2 = Error, 1 = Warning, 0 = all good.
	function SetWarningLevel(smartAttribute, errorLimit, warningLimit, useRawValue, useReverseCompare) {
		if (typeof useRawValue === 'undefined') {
			useRawValue = true;
		}
		if (typeof useReverseCompare === 'undefined') {
			useReverseCompare = false;
		}
		var value = useRawValue ? smartAttribute.RawValue : smartAttribute.Value;
		smartAttribute.WarningLevel = 0;
		
		if (!useReverseCompare) {
		    if (value >= errorLimit) {
			    smartAttribute.WarningLevel = 2;
		    }
		    else if (value >= warningLimit) {
			    smartAttribute.WarningLevel = 1;
		    }
		}
		else {
			if (value <= errorLimit) {
			    smartAttribute.WarningLevel = 2;
		    }
		    else if (value <= warningLimit) {
			    smartAttribute.WarningLevel = 1;
		    } 
		}
	}

	return ParseDisks(disks);
})(Disks);
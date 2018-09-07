window.SmartDataViewer = new function() {
	const skeletonMainRow = '<tr class="BGCLASS"><td>INFO_TABLE</td><td>SMART_TABLE</td></tr>';
	const skeletonInfoRow = '<tr><td class="font-weight-bold">INFO_KEY</td><td>INFO_VALUE</td></tr>';
	const skeletonInfoRowHeader = '<thead><tr><th colspan="2" class="bg-primary text-light text-center">DEVICE</th></tr></thead>';
	const skeletonSMARTRow = '<tr class="SMART_ALERT_CLASS"><td>ID</td><td>ATTRIBUTE</td><td>FLAG</td><td>VALUE</td><td>WORST</td><td>THRESHOLD</td><td>TYPE</td><td>UPDATED</td><td>FAILED</td><td>RAW_VALUE</td></tr>';
	const skeletonSMARTHeader = '<thead><tr><th>Id</th><th>Attribute</th><th>Flag</th><th>Value</th><th>Worst</th><th>Threshold</th><th>Type</th><th>Updated</th><th>Failed On</th><th>Raw Value</th></tr></thead>';
	var _self = this;
	var tbodySelector = "";
	var menuStartSelector = "";
	var healthSelector = "";
	
	this.Init = function(disks, b, m, h) {
		tbodySelector = b;
		menuStartSelector = m;
		healthSelector = h;
		var errorCount = 0;
		var healthClass="bg-success";
		for (var i = 0; i < disks.length; i++) {
			var menuColor = "bg-success text-light";
			for (var j = 0; j < disks[i].SmartAttributes.length; j++) {
			    if (typeof disks[i].SmartAttributes[j].WarningLevel !== 'undefined') {
					if (disks[i].SmartAttributes[j].WarningLevel == 2) {
						menuColor = "bg-danger text-light";
						healthClass = "bg-danger";
						errorCount++;
					}
					else if (disks[i].SmartAttributes[j].WarningLevel == 1) {
					    if (menuColor.indexOf('danger') == -1) {
						    menuColor = "bg-warning text-dark";
						    healthClass = "bg-warning";
					    }
						errorCount++;
					}
				}
			}
			$(healthSelector).addClass(healthClass).addClass('text-light').removeClass('text-dark').text(errorCount > 0 ? '(' + errorCount + ') Problems' : 'No problems');
		    $(menuStartSelector).parent().append('<a class="dropdown-item ' + menuColor + '" href="#" data-binding="' + disks[i].Device + '">/dev/' + disks[i].Device + '</a>');
		}
	};
	
	this.FillTableWithData = function(disks) {
		for (var i = 0; i < disks.length; i++) {
			var row = skeletonMainRow.replace('INFO_TABLE', GenerateInformationRow(disks[i].DiskInfo,'/dev/' + disks[i].Device));
			row = row.replace('SMART_TABLE', GenerateSMARTRow(disks[i].SmartAttributes));
			if (i%2 == 0) {
			    $(tbodySelector).append(row.replace(/BGCLASS/g,'bg-dark'));
			}
			else {
				$(tbodySelector).append(row.replace(/BGCLASS/g,'bg-secondary'));
			}
		}
	};
	
	// Wire click handlers for drive dropdown.
	this.WireEventHandlers = function() {
	    $('.dropdown-item').click(function() {
		    var id = $(this).attr('data-binding');
			$(tbodySelector).children().detach();
			if (id != 'all') {
				// Specific drive.
				var disks = window.ParsedDisks;
				for (var i = 0; i < disks.length; i++) {
					if (disks[i].Device == id) {
					    _self.FillTableWithData([disks[i]]);
						break;
					}
				}
			}
			else {
				// Display all.
				_self.FillTableWithData(window.ParsedDisks);
			}
		});
	};
	
	function GenerateInformationRow(diskInfos, device) {
		var result = '<table class="table text-dark bg-light">' + skeletonInfoRowHeader.replace('DEVICE', device) + '<tbody>';
		var rows = "";
		for (var i = 0; i < diskInfos.length; i++) {
			rows = rows + skeletonInfoRow.replace('INFO_KEY', diskInfos[i].Key).replace('INFO_VALUE', diskInfos[i].Value);
		}
		result = result + rows + '</tbody></table>';
		return result;
	}
	
	function GenerateSMARTRow(smartAttributes) {
		var result = '<table class="table text-dark bg-light">' + skeletonSMARTHeader + '<tbody>';
		var rows = "";
		for (var i = 0; i < smartAttributes.length; i++) {
			var smartAlertClass = "";
			if (typeof smartAttributes[i].WarningLevel !== 'undefined') {
				if (smartAttributes[i].WarningLevel == 2) {
					smartAlertClass = "bg-danger text-light";
				}
				else if (smartAttributes[i].WarningLevel == 1) {
					smartAlertClass = "bg-warning text-dark";
				}
				else {
					var smartAlertClass = "bg-success text-light";
				}
			}

			rows = rows + skeletonSMARTRow
			    .replace('SMART_ALERT_CLASS', smartAlertClass)
			    .replace('ID', smartAttributes[i].Id)
				.replace('ATTRIBUTE', smartAttributes[i].Attribute)
				.replace('FLAG', smartAttributes[i].Flag)
				.replace('VALUE', smartAttributes[i].Value)
				.replace('WORST', smartAttributes[i].Worst)
				.replace('THRESHOLD', smartAttributes[i].Threshold)
				.replace('TYPE', smartAttributes[i].Type)
				.replace('UPDATED', smartAttributes[i].Updated)
				.replace('FAILED', smartAttributes[i].WhenFailed)
				.replace('RAW_VALUE', smartAttributes[i].RawValue)
		}
		result = result + rows + '</tbody></table>';
		return result;
	}
}
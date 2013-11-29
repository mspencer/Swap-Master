var calculator = {};
	
calculator.mainjs = (function () {
	var pressedValue,
		firstNumberStr = "",
		secondNumberStr = "",
		resultValue = 0,
		operatorFlag = false,
		theOperator = "",
		mathOperator = "";
	function bindButton (elemSel, actionStr) {
		$( elemSel ).bind( actionStr, categoriseButton );
	}
	
	function categoriseButton () {
		pressedValue = $(this).attr('id');
		if ( !isNaN(+pressedValue) ) {
			storeNumber(pressedValue);
		} else if ( pressedValue == "add" ) {
			doOperation(pressedValue);
		} else if ( pressedValue == "subtract" ) {
			doOperation(pressedValue);
		} else if ( pressedValue == "equal" ) {
			doEqual();
		} else if ( pressedValue == "clearAll" ) {
			alert("clearall!");
		} else if ( pressedValue == "clearLast" ) {
			alert("clearlast!");
		}		
	}
	
	function storeNumber (numStr) {
		if (operatorFlag == false) {
			firstNumberStr += numStr;
			showInDiv(numStr);
		} else {
			secondNumberStr += numStr;
			showInDiv(numStr);
		}		
	}
	
	function doOperation (theOperation) {
		if (theOperation == "add") {
			mathOperator = '+';
		} else if (theOperation == "subtract") {
			mathOperator = '-';
		}
		
		if (operatorFlag == false) {
			theOperator = theOperation;
			// output
			showInDiv(mathOperator);
			// reset operatorFlag
			operatorFlag = true;
		} else { // operatorFlag == true
			if (theOperator != "" && secondNumberStr == "") { // already click one theOperator
				theOperator = theOperation;
				// output
				clearLastCharInDiv();
				showInDiv(mathOperator);
			} else {
				if (theOperator == "add") {
					resultValue = (+firstNumberStr) + (+secondNumberStr);
					afterOperation(resultValue, mathOperator);
					theOperator = theOperation;
				} else if (theOperator == "subtract") {
					resultValue = (+firstNumberStr) - (+secondNumberStr);
					afterOperation(resultValue, mathOperator);
					theOperator = theOperation;
				}
			}
		}
	}
	
	function afterOperation (theResult, mathSymbol) {
		//theOperator = "";
		secondNumberStr = "";
		resultValue = 0;
		firstNumberStr = theResult;
		// output
		clearInDiv();
		if (pressedValue == "equal") {
			operatorFlag = false;
			showInDiv(theResult);
		} else {
			showInDiv(theResult + mathSymbol);
		}
	}
	
	function doEqual() {
		if (secondNumberStr == "") {
		} else {
			doOperation(theOperator);
		}
		/*
		alert("firstNumberStr: " + firstNumberStr + "\n" + 
		"secondNumberStr: " + secondNumberStr + "\n" +
		"resultValue: " + resultValue + "\n" +
		"operatorFlag: " + operatorFlag + "\n" +
		"theOperator: " + theOperator + "\n" +
		"mathOperator: " + mathOperator);
		*/
	}
	
	function showInDiv (toShowStr) {
		$('#output').append(toShowStr);
	}
	
	function clearLastCharInDiv () {
		var outputLength = $('#output').text().length;
		var newOutput = $('#output').text().slice(0, outputLength - 1);
		clearInDiv();
		$('#output').text(newOutput);
	}
	
	function clearInDiv () {
		$('#output').empty();
	}
	
	return {
		bindButton:bindButton
	};
})();
var calculator = {};
	
calculator.mainjs = (function () {
	var firstNumStr = "",
		secondNumStr ="",
		mathOprt = "",
		oprtName = "",
		oprtFlag = false,
		result = 0;
	
	function bindButton (elemSel, actionStr) {
		$(elemSel).bind( actionStr, categoriseButton );
	}
	
	function categoriseButton () {
		pressedValue = $(this).attr('id');
		if ( !isNaN(+pressedValue) ) {
			pressNumber(pressedValue);
		} else if ( pressedValue == "add" ) {
			var mathOperator = "+";
			pressOperator(mathOperator, pressedValue);
		} else if ( pressedValue == "subtract" ) {
			var mathOperator = "-";
			pressOperator(mathOperator, pressedValue);
		} else if ( pressedValue == "equal" ) {
			doEqual();
		} else if ( pressedValue == "clearAll" ) {
			alert("clearall!");
		} else if ( pressedValue == "clearLast" ) {
			alert("clearlast!");
		}		
	}
	
	function pressNumber (numStr) {
		if (oprtFlag == false) {
			firstNumStr += numStr;
			showInDiv(numStr);
		} else {
			secondNumStr += numStr;
			showInDiv(numStr);
		}
	}
	
	function pressOperator (mathOperator, operatorName) {
		if (oprtFlag == false) {
			oprtFlag = true;
			mathOprt = mathOperator;
			oprtName = operatorName;
			showInDiv(mathOperator);
		} else {
			if (secondNumStr != "") {
				doTheMath(firstNumStr, secondNumStr, mathOprt);
				mathOprt = mathOperator;
				oprtName = operatorName;
				firstNumStr = result;
				secondNumStr = "";
				result = 0;
			} else {
				mathOprt = mathOperator;
				oprtName = operatorName;
				clearLastCharInDiv();
			}
			showInDiv(mathOperator);
		}
	}
	
	function doTheMath (firstStr, secondStr, operatorStr) {
		if (secondStr == "") {		
		} else {
			if (operatorStr == "+") {
				result = (+firstStr) + (+secondStr);
			} else if (operatorStr == "-") {
				result = (+firstStr) - (+secondStr);
			}
			clearInDiv();
			showInDiv(result);
		}
	}
	
	function doEqual () {
		if ( firstNumStr != "" && secondNumStr != "" && oprtName != "" ) {
			doTheMath(firstNumStr, secondNumStr, mathOprt);
			mathOprt = "";
			oprtName = "";
			firstNumStr = result;
			secondNumStr = "";
			result = 0;
			oprtFlag = false;
		} else {
			var currentOutput = $("#output").text();
			clearInDiv();
			showInDiv(currentOutput);
		}
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
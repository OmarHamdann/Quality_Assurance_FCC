
//this function splits the input string into a number and a unit
function numberStringSplitter(input) {
  const number= input.match(/[.\d/]+/g)||["1"];
  const unit = input.match(/[a-zA-Z]+/g)[0];
  return [number[0], unit];

}

//check if the number is a valid number
function checkDiv(possibleFraction) {
  let nums=possibleFraction.split('/');
  if (nums.length>2) {
    return false;
  }
  return nums;
}



function ConvertHandler() {
  
  this.getNum = function(input) {
    let result;
    result = numberStringSplitter(input)[0];
    let divCheck = checkDiv(result);
    
    if(!divCheck) { 
      return undefined;
    }

    let num = divCheck[0];
    let denom = divCheck[1] || 1;
    result = parseFloat(num)/parseFloat(denom);

    if(isNaN(num) || isNaN(denom)) {
      return undefined;
    }
    
    return result;
  };
  
  this.getUnit = function(input) {
    let result;
    result = numberStringSplitter(input)[1].toLowerCase();
    let validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
    if(!validUnits.includes(result)) {
      return undefined;
    }
    
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    let result;
    let unitMap = {
      gal: 'l',
      l: 'gal',
      mi: 'km',
      km: 'mi',
      lbs: 'kg',
      kg: 'lbs'
    };
    result = unitMap[initUnit];


    
    return result;
  };

  this.spellOutUnit = function(unit) {
    let result;
    let unitMap = {
      gal: 'gallons',
      l: 'liters',
      mi: 'miles',
      km: 'kilometers',
      lbs: 'pounds',
      kg: 'kilograms'
    };
    result = unitMap[unit] || "invalid unit";

    
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    let unitMap = {
      gal: galToL,
      l: 1/galToL,
      mi: miToKm,
      km: 1/miToKm,
      lbs: lbsToKg,
      kg: 1/lbsToKg
    };
    result = initNum * unitMap[initUnit];

    
    return parseFloat(result.toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let result;
    result = `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum.toFixed(5)} ${this.spellOutUnit(returnUnit)}`;
    
    return result;
  };
  
}

module.exports = ConvertHandler;

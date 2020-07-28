function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function convertFloatvalue(num) {
    var ReturnVal = 0;
    if (num > 1000000000000) {
        ReturnVal= (num / 1000000000000).toFixed(1) + "T";
    }
    else if (num > 1000000000) {
        ReturnVal= (num / 1000000000).toFixed(1) + "B";
    }
    else if (num > 1000000) {
        ReturnVal= (num / 1000000).toFixed(1) + "M";
    }
    else if (num > 1000) {
        ReturnVal= (num / 1000).toFixed(1) + "K";
    }
    else {
        ReturnVal= num.toFixed(0);
    }
    return ReturnVal;
}
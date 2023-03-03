export {sum, multiply, difference, division};


function sum(num1, num2) {
    [num1, num2] = convertToBigInt(num1, num2);
    return num1 + num2;
}


function multiply(num1, num2) {
    [num1, num2] = convertToBigInt(num1, num2);
    return num1 * num2;
}


function difference(num1, num2) {
    [num1, num2] = convertToBigInt(num1, num2);
    return num1 - num2;
}


function division(num1, num2) {
    [num1, num2] = convertToBigInt(num1, num2);
    return num1 / num2;
}


function convertToBigInt(num1, num2) {
    num1 = BigInt(num1);
    num2 = BigInt(num2);
    return [num1, num2];
}

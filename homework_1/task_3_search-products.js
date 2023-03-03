"use strict";

class Product {
    constructor(name, price, quantity, description) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
    }
}


let products = [];

let jeans = new Product('Джинсы fd-12', 2, 6, 'Синие 145abc');
let socks = new Product('Носки', 2, 6, 'Цвет морковныйabc');
let gloves = new Product('Перчатки fdop', 2, 6, 'Шерстяныеabc');
let prod4 = new Product('ss', 10, 4, 'qwerty');
let prod5 = new Product('fd', 2, 5, 'descr abc');

products.push(jeans);
products.push(socks);
products.push(gloves);
products.push(prod4);
products.push(prod5);


let parameters = 'name-contains-fd&price-=2&quantity->5&description-ends-abc';
// let parameters = 'name-starts-fd&quantity-=5';


console.log(searchProducts(parameters));


function searchProducts(parameters) {
    let separatedParameters = getSeparatedParams(parameters);
    let products = getFilterProducts(separatedParameters);
    return products;
}


function getSeparatedParams(parameters) {
    let separatedParameters = [];
    let paramArr = parameters.split('&');

    for (let param of paramArr) {
        let conditions = param.split('-');
        let attr = conditions[0];
        let operator;
        let targetValue;
        if (conditions.length == 2) {
            operator = getOperator(conditions[1]);
            targetValue = conditions[1].replaceAll(operator, '');
        }
        if (conditions.length == 3) {
            operator = conditions[1];
            targetValue = conditions[2];
        }
        let map = new Map([
            ['attr', attr], ['operator', operator], ['value', targetValue],
        ]);
        separatedParameters.push(map);
    }
    return separatedParameters;
}


function getOperator(condition) {
    for (let operator of ['<=', '>=', '<', '=', '>',]) {
        if (condition.indexOf(operator) != -1) {
            return operator;
        }
    }
}


function getFilterProducts(selectionParameters) {
    let suitableProducts = [];

    nextProduct:
        for (let product of products) {
            let isSuitable = true;

            for (let [fieldName, fieldValue] of Object.entries(product)) {
                for (let param of selectionParameters) {
                    if (param.get('attr') == fieldName) {
                        isSuitable = conditionIsTrue(
                            fieldValue,
                            param.get('operator'),
                            param.get('value'));
                        if (!isSuitable) {
                            continue nextProduct;
                        }
                    }
                }
            }
            suitableProducts.push(product);
        }
    return suitableProducts;
}


function conditionIsTrue(productField, operator, targetValue) {
    switch (operator) {
        case 'contains':
            return productField.includes(targetValue);
        case 'starts':
            return productField.startsWith(targetValue);
        case 'ends':
            return productField.endsWith(targetValue);
        case '<':
            return Number(productField) < Number(targetValue);
        case '=':
            return Number(productField) == Number(targetValue);
        case '>':
            return Number(productField) > Number(targetValue);
        case '<=':
            return Number(productField) <= Number(targetValue);
        case '>=':
            return Number(productField) >= Number(targetValue);
    }
}

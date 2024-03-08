

const string = [{ "id": 1, "price": '12,000원' }, { "id": 2, "price": '15,000원' }]

const strPrice = string.map((a) => a.price)

const numberPri = strPrice.map((a) => parseInt(a.replace(',', '')))


console.log(numberPri)




const res =
{
    "age": 1,
    "orders": [{
        "id": 2,
        "createdAt": "2024-02-26T21:43:28.883Z",
        "updatedAt": "2024-02-26T21:44:58.486Z",
        "orderNumber": 1,
        "userName": "winter",
        "userAddress": "서초구 서밋푸르지오 1동 2301",
        "userPhone": "010-2222-2222",
        "menus": [
            {
                "id": 1,
                "name": "황올",
                "price": "17,000원"
            },
            {
                "id": 2,
                "name": "반반",
                "price": "18,000원"
            }
        ],
    }]
};


const menus = res.orders.map((a) => a.menus).flat()
const price = menus.map((a) => a.price)
console.log(price)





const fa = '0원'

console.log(parseInt(fa, 10))


function solution(number, n, m) {
    const result = number % n === 0 && number % m === 0 ? 1 : 0

    return result
};

console.log(solution(10, 3, 5))


function solution2(str, n) {

    let result = ''

    for (let i = 0; i < n; i++) {

        result += str
    }
    return result

};

console.log(solution2('ㅈ1', 5))




const str = 'HeWWe'

const result = str.split('').map((a) => {

    if (a === a.toLowerCase()) {

        return a.toUpperCase()
    } else {

        return a.toLowerCase()
    }
});

console.log(result.join(''))


function add(h) {

    for (let i = 0; i < h; i++) {

        console.log(' '.repeat(h - i - 1) + '*'.repeat(2 * i + 1))
    }
}

add(5)


const order = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }]

const orderNumber = [2];


console.log(order.find((a) => orderNumber.includes(a.id)))


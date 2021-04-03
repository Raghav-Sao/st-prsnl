const data = [];
let counter = 0;
function fakeAPI(data) {
    return new Promise((res, rej) => {
        setTimeout(() => res([data]), 1000)
    })
}
function test() {
    callBackHandler(action);
}

async function action() {
    console.log("helloo");
    console.log("helloo");

    
    const data = await fakeAPI(counter++);
    console.log(data, "---data---->");
    for (let index = 0; index < 10; index++) {
        console.log(10);
    }
}

function callBackHandler(callBack) {
    setInterval(() => {
        callBack();
    }, 501);
}
test()
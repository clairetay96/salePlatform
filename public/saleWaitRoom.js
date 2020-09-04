console.log("Hello!")

let liveButton = document.querySelector("#liveSale")

liveButton.addEventListener("click", ()=>{
    let now = new Date()
    if(now > Date.parse(document.querySelector("#date-req").innerText)){
        location.href = "live"
    }

})
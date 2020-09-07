

let liveButton = document.querySelector("#liveSale")
let saleDeadline = Date.parse(document.querySelector("#date-req").innerText)

liveButton.addEventListener("click", ()=>{
    let now = new Date()
    if(now > Date.parse(document.querySelector("#date-req").innerText)){
        this.location.href = "live"
    }

})


let countdown = setInterval(()=>{
        let now = new Date()

        let timeleft = saleDeadline - now

        if(timeleft <= 0){
            document.querySelector(".countdown").innerHTML = "SALE IS LIVE"

        } else {
            let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
            let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);


            let countdown = document.createElement("p")
            countdown.innerText = days+" days "+hours+" hours "+minutes+" minutes "+seconds+" seconds"

            document.querySelector(".countdown").innerHTML = ""
            document.querySelector(".countdown").appendChild(countdown)
        }



}, 1000)
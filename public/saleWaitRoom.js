

let liveButton = document.querySelector("#liveSale")
let saleDeadline = Date.parse(document.querySelector("#date-req").innerText)

//only bring user to live page if time is past sale live time
liveButton.addEventListener("click", ()=>{
    let now = new Date()
    if(now > Date.parse(document.querySelector("#date-req").innerText)){
        this.location.href = "live"
    }
})

//generates the time-left to sale on page load so there's no delay in generating the countdown timer
let now = new Date()
    let timeleft = saleDeadline - now
    if(timeleft <= 0){
        document.querySelector(".countdown").innerHTML = "SALE IS LIVE"
    } else {
        let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
        let units = [days, hours, minutes, seconds]
        for(let i=0;i<units.length;i++){
            if(units[i]<10){
                units[i] = "0" + units[i].toString()
            }
        }
        let countdown = document.createElement("p")
        countdown.innerText = units[0]+":"+units[1]+":"+units[2]+":"+units[3]
        document.querySelector(".countdown").innerHTML = ""
        document.querySelector(".countdown").appendChild(countdown)
    }


//implement countdown
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

            let units = [days, hours, minutes, seconds]
            for(let i=0;i<units.length;i++){
                if(units[i]<10){
                    units[i] = "0" + units[i].toString()
                }
            }


            let countdown = document.createElement("p")
            countdown.innerText = units[0]+":"+units[1]+":"+units[2]+":"+units[3]

            document.querySelector(".countdown").innerHTML = ""
            document.querySelector(".countdown").appendChild(countdown)
        }



}, 1000)
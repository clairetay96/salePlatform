let allDeadlines = document.querySelectorAll(".livetime")

allDeadlines.forEach((element)=>{
    let countDownDate = Date.parse(element.innerText)
    var myFunc = setInterval(()=>{
        let now = new Date()
        let timeleft = countDownDate - now

        let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);


        let countdown = document.createElement("p")
        countdown.innerText = days+" days "+hours+" hours "+minutes+" minutes "+seconds+" seconds"

        element.querySelector(".countdown").innerHTML = ""
        element.querySelector(".countdown").appendChild(countdown)



    }, 1000)


})
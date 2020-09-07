let allDeadlines = document.querySelectorAll(".countdown")

let username = document.querySelector("#username").innerText


allDeadlines.forEach((element)=>{
    let countDownDate = Date.parse(element.querySelector(".livetime").innerText)
    var myFunc = setInterval(()=>{
        let now = new Date()
        let timeleft = countDownDate - now

        let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        let countdown;

        if(timeleft<=0){
            countdown = "SALE IS LIVE!"
        } else if(days>=1){
            countdown = days==1? days + " day": days + " days"
        } else {
            countdown = hours + ":" + minutes + ":" + seconds
        }

        element.querySelector(".timer").innerHTML = countdown



    }, 1000)


})

let allClickedRows = document.querySelectorAll(".table-row-link")

allClickedRows.forEach((item)=>{
    item.addEventListener("click", ()=>{
        if(item.querySelectorAll(".order-ID").length > 0){
            let orderID = item.querySelector(".order-ID").innerText
            window.location = "/orders/"+orderID
        } else if (item.querySelectorAll(".sale-ID").length > 0) {
            let saleID = item.querySelector(".sale-ID").innerText
            window.location = "/seller/"+username+"/sales/"+saleID+"/orders/"
        }
    })

})
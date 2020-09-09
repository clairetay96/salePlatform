let allDeadlines = document.querySelectorAll(".countdown")

let username =  document.querySelector("#username")? document.querySelector("#username").innerText : null


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
            countdown = "LIVE!"
        } else if(days>=1){
            countdown = days==1? days + " day": days + " days"
        } else {
            let units = [hours, minutes, seconds]
            for(let i=0;i<units.length;i++){
                if (units[i]<10){
                    units[i] = "0" + units[i].toString()
                }
            }
            countdown = units[0] + ":" + units[1] + ":" + units[2]
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


let trackedSales = document.querySelectorAll(".tracked-sale-row")

trackedSales.forEach((element)=>{
    element.addEventListener("mouseover", ()=>{
        element.querySelector(".align-to-right").style.opacity = 0.8
    })

    element.addEventListener("mouseout", ()=>{
        element.querySelector(".align-to-right").style.opacity = 0

    })
})

let dbTables=document.querySelectorAll(".db-table")

dbTables.forEach((element)=>{
    let searchBar = element.querySelector(".filter-table")
    let table = element.querySelector("table")

    searchBar.addEventListener("keyup", ()=>{
        let query = event.target.value.toLowerCase()

        let tableRows = table.querySelectorAll("tr")
        tableRows.forEach((row, index)=>{
            if(index!=0){
                let eachCell = row.querySelectorAll("td")
                let containsSearch = false
                for(let i=0;i<eachCell.length;i++){
                    if(eachCell[i].innerText.toLowerCase().includes(query)){
                        containsSearch=true
                        break
                    }
                }
                if(containsSearch){
                    row.style.display = ""
                } else {
                    row.style.display = "none"
                }
            }
        })
    })
})


let dbDivBoxes = document.querySelectorAll(".db-divbox")
if(dbDivBoxes){
    dbDivBoxes.forEach((element)=>{
        let searchBar = element.querySelector(".filter-search")
        let selectionArea = element
        if(element.querySelector(".catalogue-items")){
            selectionArea = element.querySelector(".catalogue-items")
        }

        searchBar.addEventListener("keyup", ()=>{
            let query = event.target.value.toLowerCase()
            let cards = selectionArea.querySelectorAll(":scope > div")

            cards.forEach((card, index)=>{
                let containsSearch=false
                if(card.innerText.toLowerCase().includes(query)){
                    containsSearch=true
                }
                if(containsSearch){
                    card.style.display = ""
                } else {
                    card.style.display = "none"
                }
            })
        })
    })
}
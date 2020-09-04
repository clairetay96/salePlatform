let confirmButton = document.querySelector("#confirm")
let confirmDiv = document.querySelector("#confirmOrder")

confirmButton.addEventListener("click", ()=>{

    confirmDiv.innerHTML = ""
    let tallyTable = document.createElement("table")
    let tableheader = document.createElement("tr")

    let headers = ["Item", "Quantity", "Cost"]
    headers.forEach((item)=>{
        let cell = document.createElement("th")
        cell.innerText = item
        tableheader.appendChild(cell)
    })

    tallyTable.appendChild(tableheader)

    let allItems = document.querySelectorAll(".saleItem")

    allItems.forEach((element)=>{
        let row = document.createElement("tr")
        let values = [element.querySelector(".itemName").innerText, element.querySelector(".orderqty").value, (element.querySelector(".itemPrice").innerText*element.querySelector(".orderqty").value).toFixed(2)]
        values.forEach((item)=>{
            let cell = document.createElement("td")
            cell.innerText = item
            row.appendChild(cell)
        })
        tallyTable.appendChild(row)
    })

    confirmDiv.appendChild(tallyTable)

    let message = document.createElement("p")
    message.innerText = "To edit your order, make changes on the main form, then click confirm order again."
    confirmDiv.appendChild(message)

    let submitButton = document.createElement("input")
    submitButton.type = "submit"
    confirmDiv.appendChild(submitButton)

})
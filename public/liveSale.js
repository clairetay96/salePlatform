let confirmButton = document.querySelector("#confirm")
let confirmDiv = document.querySelector("#confirmOrder")

confirmButton.addEventListener("click", ()=>{
    let sumTotal = 0

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
        let itemName = element.querySelector(".itemName").innerText
        let itemQty = element.querySelector(".orderqty").value
        let itemPrice = element.querySelector(".itemPrice").innerText
        itemPrice = parseFloat(itemPrice.slice(1, itemPrice.length))
        let itemCost = (itemPrice*itemQty).toFixed(2)
        sumTotal += parseFloat(itemCost)

        if (itemQty>0){
            let values = [itemName, itemQty, itemCost]
            values.forEach((item)=>{
                let cell = document.createElement("td")
                cell.innerText = item
                row.appendChild(cell)
            })
            tallyTable.appendChild(row)

        }

    })

    let message = document.createElement("p")
    message.className= "subtitle-font"
    message.innerText = "To edit your order, make changes on the main form, then click confirm order again."
    confirmDiv.appendChild(message)

    let sumTotalRow = document.createElement("tr")
    sumTotalRow.innerHTML = `<td></td><td>Total</td><td>${sumTotal.toFixed(2)}</td>`
    tallyTable.appendChild(sumTotalRow)

    confirmDiv.appendChild(tallyTable)

    let submitButton = document.createElement("input")
    submitButton.type = "submit"
    submitButton.innerText = "Submit Order"
    confirmDiv.appendChild(submitButton)

})
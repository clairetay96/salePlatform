let confirmButton = document.querySelector("#confirm")
let confirmDiv = document.querySelector("#confirmOrder")

confirmButton.addEventListener("click", ()=>{

    confirmDiv.innerHTML = ""

    let allItems = document.querySelectorAll(".saleItem")

    allItems.forEach((element)=>{
        let itemName = element.querySelector(".itemName").innerText
        let orderQty = element.querySelector(".orderqty").value
        let itemDiv = document.createElement("p")
        itemDiv.className = "order"
        itemDiv.innerHTML = itemName + " : " + orderQty
        confirmDiv.appendChild(itemDiv)
    })

    let message = document.createElement("p")
    message.innerText = "To edit your order, make changes on the main form."
    confirmDiv.appendChild(message)

    let submitButton = document.createElement("input")
    submitButton.type = "submit"
    confirmDiv.appendChild(submitButton)

})
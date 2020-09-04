let x=2

document.querySelector("#addItemBtn").addEventListener("click", ()=>{
    let input = document.createElement("div")
    input.className = "itemInput"
    input.innerHTML = `Item name: <input type="text" name="item_name${x}" autocomplete="off"/> <br/><br/>Price: <input type="text" name="price${x}" autocomplete="off"/><br/><br/>Description: <input type="text" name="product_desc${x}" autocomplete="off"/><br/><br/>Image URL: <input type="text" name="imgURL${x}" autocomplete="off"/><br/><br/><button type="button" class="removeItemBtn" id="remove${x}">Delete Item</button><br/><br/>`
    document.querySelector(".allItems").appendChild(input)

    x++

    let allRemoveButtons = document.querySelectorAll(".removeItemBtn")
    console.log(allRemoveButtons)

    for(k=0;k<allRemoveButtons.length;k++){
        allRemoveButtons[k].addEventListener("click", function(){
            this.parentNode.parentNode.removeChild(this.parentNode)

        })
}
})
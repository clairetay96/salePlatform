let y=2
randomWords = ['goodbye', 'hello','gentle','world','first']

document.querySelector("#addItemBtn").addEventListener("click", ()=>{
    let input = document.createElement("div")
    input.className = "itemInput"
    x = y + randomWords[Math.floor(Math.random()*randomWords.length)] + y + randomWords[Math.floor(Math.random()*randomWords.length)]
    input.innerHTML = `<div class="field"><label>Item name</label> <input type="text" name="item_name${x}" autocomplete="off" required/> </div><div class="field"><label>Price</label> <input type="number" step=".01" name="price${x}" autocomplete="off" min="0" required/></div><div class="field"><label>Image URL</label> <input type="text" name="imgURL${x}" autocomplete="off" required/></div><div class="field"><label>Description</label> <textarea name="product_desc${x}" autocomplete="off" required/></textarea></div><input type="hidden" name="item_id${x}"><button type="button" class="removeItemBtn" id="remove${x}">Delete Item</button><br/><br/>`
    document.querySelector(".allItems").appendChild(input)

    y++

    let allRemoveButtons = document.querySelectorAll(".removeItemBtn")

    for(k=0;k<allRemoveButtons.length;k++){
        allRemoveButtons[k].addEventListener("click", function(){
            this.parentNode.parentNode.removeChild(this.parentNode)

        })
}
})
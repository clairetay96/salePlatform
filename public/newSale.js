let x=2

document.querySelector("#addLiveDate").addEventListener("click", ()=>{
    let input = document.createElement("div")
    input.className = "liveDate"
    input.innerHTML = `Date Live<input type="datetime-local" name="time_live${x}"/><button class="rmDate">Remove date</button>`
    document.querySelector("#livedates").appendChild(input)

    x++

    let allRemoveButtons = document.querySelectorAll(".rmDate")

    for(k=0;k<allRemoveButtons.length;k++){
        allRemoveButtons[k].addEventListener("click", function(){
            this.parentNode.parentNode.removeChild(this.parentNode)

        })
}
})
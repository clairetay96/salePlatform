let x=2

//add a new date functionality for creating a new sale

document.querySelector("#addLiveDate").addEventListener("click", ()=>{
    let input = document.createElement("div")

    input.className = "liveDate"
    input.innerHTML = `Date Live<input type="datetime-local" name="time_live${x}"/><button class="rmDate">Remove date</button>`
    document.querySelector("#livedates").appendChild(input)

    x++ //increment to generate unique field names for each date

    let allRemoveButtons = document.querySelectorAll(".rmDate")
    //each time a new date is added, add event listener to all remove buttons on page to remove parent node
    for(k=0;k<allRemoveButtons.length;k++){
        allRemoveButtons[k].addEventListener("click", function(){
            this.parentNode.parentNode.removeChild(this.parentNode)

        })
}
})
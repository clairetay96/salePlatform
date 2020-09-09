let newPasswordButton = document.querySelector("#new-password-option")
let newPasswordBox = document.querySelector("#new-password")
newPasswordBox.style.display = 'none'

newPasswordButton.addEventListener("click", (event)=>{
    if(newPasswordBox.style.display=='none'){
        newPasswordBox.style.display = 'initial'
        event.target.innerText = "Keep old password"
    } else {
        newPasswordBox.style.display = 'none'
        newPasswordBox.querySelector("input").value=""
        event.target.innerText = "Set a new password"

    }
})
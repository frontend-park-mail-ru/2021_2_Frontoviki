const signUpButton = document.getElementById('overlay-sign-up'); 
const signInButton = document.getElementById('overlay-sign-in'); 
const container = document.getElementById('modal-window'); 
 
signUpButton.addEventListener('click', () => { 
 container.classList.add("right-panel-active"); 
}); 
 
signInButton.addEventListener('click', () => { 
 container.classList.remove("right-panel-active"); 
});
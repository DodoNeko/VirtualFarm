const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/logout", {
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        }
    });
    if (response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/";
    }
});


function handleAlert(alert, ok, message) {
    alert.classList.remove("d-none");
    if (ok) {
        alert.classList.remove('alert-danger');
        alert.classList.add('alert-success');
        alert.innerHTML = message;
    }
    else {
        alert.classList.add('alert-danger');
        alert.classList.remove('alert-success');
        alert.innerHTML = message;
    }
}
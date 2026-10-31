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
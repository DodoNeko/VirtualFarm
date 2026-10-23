// 1. ANIMACJE
document.getElementById('startBtn').addEventListener('click', function(e) {
    const registerPage = document.getElementById('registerPage');

    document.getElementById('continueBtn').classList.add('d-none');
    document.getElementById('startBtn').classList.add('d-none');
    registerPage.classList.remove('d-none');
    
    setTimeout(function() {
      registerPage.classList.add('show');
    }, 150);

  });

document.getElementById('continueBtn').addEventListener('click', function(e) {
    const loginPage = document.getElementById('loginPage');

    document.getElementById('continueBtn').classList.add('d-none');
    document.getElementById('startBtn').classList.add('d-none');
    loginPage.classList.remove('d-none');

    
    setTimeout(function() {
      loginPage.classList.add('show');
    }, 150);

  });


  document.getElementById('openLoginBtn').addEventListener('click', function(e) {
    e.preventDefault();
    const registerPage = document.getElementById('registerPage');
    const loginPage = document.getElementById('loginPage');

    registerPage.classList.remove('show');
    
    setTimeout(function() {
      registerPage.classList.add('d-none');
      loginPage.classList.remove('d-none');
    
        setTimeout(function() {
            loginPage.classList.add('show')
        }, 20); 
    }, 150);

  });

document.getElementById('openRegisterBtn').addEventListener('click', function(e) {
    e.preventDefault();
    const registerPage = document.getElementById('registerPage');
    const loginPage = document.getElementById('loginPage');

    loginPage.classList.remove('show');
    
    setTimeout(function() {
      loginPage.classList.add('d-none');
      registerPage.classList.remove('d-none');
    
        setTimeout(function() {
            registerPage.classList.add('show')
        }, 20); 
    }, 150);
  });

  // 2. Logowanie

const form = document.querySelector("#loginForm");

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }

    const response = await fetch("/api/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (response.ok) {
        window.location.href = `/profile/`;
        console.log("logged in");
    }
    else {
        console.log("not logged in");
    }
});


form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = document.querySelector("#loginEmail").value;
    const password = document.querySelector("#loginPassword").value;

    const response = await fetch(
        "/api/auth/login",
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email,
                password
            })
        }
    );


    const data = await response.json();
    if(response.ok){
        localStorage.setItem(
            "token",
            data.token.token
        );
        window.location.href = `/profile/`;
    } else {
        handleAlert(document.querySelector("#loginAlert"), false, `${data.error}`);
    }
});


const registerAlert = document.querySelector("#registerAlert");
document.querySelector("#consents").checked = false;

// 3. REJESTRACJA 
document.querySelector("#registerForm").addEventListener("submit", async(e)=>{
    e.preventDefault();
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;
    const consents = document.querySelector("#consents").checked;

    if (name == "") {
        handleAlert(registerAlert, false, "Fill username field");
        return;
    }
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        handleAlert(registerAlert, false, "Invalid e-mail address");
        return;
    }

    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
        handleAlert(registerAlert, false, "The password must be 8 characters long, with at least one uppercase letter, one lowercase letter, and one number.")
        return;
    }
    if (password != confirmPassword) {
        handleAlert(registerAlert, false, "Passwords don't match");
        return;
    }
    if (password != confirmPassword) {
        handleAlert(registerAlert, false, "Passwords don't match");
        return;
    }
    if (!consents) {
        handleAlert(registerAlert, false, "Please read and accept regulations before register");
        return;
    }
    
    console.log(JSON.stringify({ name, email, password}));

    const response = await fetch("/api/auth/register", {
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({ name, email, password})
    });
    
    const data = await response.json();
    if (response.ok) {
        handleAlert(registerAlert, true, "Account created");
    } else {
        handleAlert(registerAlert, false,  `${data.error}`);
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
// ==========================
// GLOBAL VARIABLES
// ==========================
let problems = parseInt(localStorage.getItem("problems")) || 0;
let chart = null;

// ==========================
// PAGE LOAD
// ==========================
window.onload = function(){

    // Load problems
    document.getElementById("problems").innerText = problems;

    // Load tasks
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTask(task));

    // Load features
    loadGitHub();
    loadRepos();
    loadStreak();
    showWelcome();

    // Chart
    updateChart();

    // Sidebar active state
    document.querySelectorAll(".sidebar li").forEach(item => {
        item.addEventListener("click", function(){
            document.querySelectorAll(".sidebar li").forEach(i => i.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Enter key for task
    document.getElementById("taskInput").addEventListener("keypress", function(e){
        if(e.key === "Enter"){
            addTask();
        }
    });
};

// ==========================
// ADD PROBLEM
// ==========================
function addProblem(){
    problems++;
    localStorage.setItem("problems", problems);
    document.getElementById("problems").innerText = problems;

    updateStatsBreakdown();  // ADD THIS
    updateChart();
}

// ==========================
// RESET DATA
// ==========================
function resetData(){
    localStorage.clear();
    location.reload();
}

// ==========================
// TASK MANAGEMENT
// ==========================
function addTask(){
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();

    if(taskText === "") return;

    createTask(taskText);
    saveTask(taskText);

    input.value = "";
}

function createTask(taskText){
    let li = document.createElement("li");
    li.innerText = taskText;

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.style.marginLeft = "10px";

    deleteBtn.onclick = function(){
        li.remove();
        removeTask(taskText);
    };

    li.appendChild(deleteBtn);
    document.getElementById("taskList").appendChild(li);
}

function saveTask(task){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(task){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ==========================
// CHART (DOUGHNUT)
// ==========================
function updateChart(){

    const ctx = document.getElementById("codingChart");
    if(!ctx) return;

    let easy = Math.floor(problems * 0.5);
    let medium = Math.floor(problems * 0.3);
    let hard = problems - (easy + medium);

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Easy", "Medium", "Hard"],
            datasets: [{
                data: [easy, medium, hard],
                backgroundColor: ["#22c55e", "#eab308", "#ef4444"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation:{
                duration:1000
            }
        }
    });

    // Progress text
    let percent = (problems / 300 * 100).toFixed(1);
    let el = document.getElementById("progressText");
    if(el){
        el.innerText = "Progress: " + percent + "% of 300 problems";
    }
}

// ==========================
// GITHUB PROFILE
// ==========================
function loadGitHub(){
    fetch("https://api.github.com/users/Navaneeth6374")
    .then(res => res.json())
    .then(data => {
        document.getElementById("githubAvatar").src = data.avatar_url;
        document.getElementById("githubName").innerText = data.login;
        document.getElementById("githubRepos").innerText = data.public_repos;
        document.getElementById("githubFollowers").innerText = data.followers;
    })
    .catch(() => {
        document.getElementById("githubName").innerText = "Error loading";
    });
}

// ==========================
// GITHUB REPOS
// ==========================
function loadRepos(){
    fetch("https://api.github.com/users/Navaneeth6374/repos")
    .then(res => res.json())
    .then(repos => {

        let repoList = document.getElementById("repoList");
        repoList.innerHTML = "";

        repos.slice(0,5).forEach(repo => {

            let li = document.createElement("li");

            let link = document.createElement("a");
            link.href = repo.html_url;
            link.innerText = repo.name;
            link.target = "_blank";

            li.appendChild(link);
            repoList.appendChild(li);
        });
    });
}

// ==========================
// THEME TOGGLE
// ==========================
function toggleTheme(){
    document.body.classList.toggle("light-mode");
}

// ==========================
// STREAK
// ==========================
function loadStreak(){
    let streak = localStorage.getItem("streak") || 0;
    document.getElementById("streak").innerText = streak;
    updateStreakUI(streak);
}

function increaseStreak(){
    let streak = localStorage.getItem("streak") || 0;
    streak++;
    localStorage.setItem("streak", streak);
    document.getElementById("streak").innerText = streak;
    updateStreakUI(streak);
}

function updateStreakUI(streak){

    // Progress (max 30 days)
    let percent = Math.min((streak / 30) * 100, 100);
    document.getElementById("streakFill").style.width = percent + "%";

    // Motivation messages
    let msg = "Start today 🚀";

    if(streak >= 3) msg = "Good start 👍";
    if(streak >= 7) msg = "You're consistent 🔥";
    if(streak >= 15) msg = "Great discipline 💪";
    if(streak >= 30) msg = "Beast mode activated 🧠⚡";

    document.getElementById("streakMessage").innerText = msg;
}
// ==========================
// SMOOTH SCROLL
// ==========================
function scrollToSection(id){
    const element = document.getElementById(id);
    if(element){
        element.scrollIntoView({
            behavior: "smooth"
        });
    }
}

// ==========================
// WELCOME MESSAGE
// ==========================
function showWelcome(){
    const hour = new Date().getHours();
    let msg = "Hello";

    if(hour < 12) msg = "Good Morning ☀️";
    else if(hour < 18) msg = "Good Afternoon 🌤️";
    else msg = "Good Evening 🌙";

    let el = document.getElementById("welcomeMsg");
    if(el){
        el.innerText = msg + ", Navaneeth!";
    }
}
function updateStatsBreakdown(){

    let easy = Math.floor(problems * 0.5);
    let medium = Math.floor(problems * 0.3);
    let hard = Math.floor(problems * 0.2);

    document.getElementById("easyCount").innerText = easy;
    document.getElementById("mediumCount").innerText = medium;
    document.getElementById("hardCount").innerText = hard;
}

function resetStats(){
    problems = 0;
    localStorage.setItem("problems", 0);
    document.getElementById("problems").innerText = 0;
    updateStatsBreakdown();
    updateChart();
}
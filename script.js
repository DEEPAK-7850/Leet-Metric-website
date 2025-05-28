document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".container");
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("user-input");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const statscontainer = document.querySelector(".stats-container");
  const cardstatscontainer = document.querySelector(".stats-card-container");

  // Check if all required elements are present
  if (!cardstatscontainer) {
    console.error("Could not find stats card container element. Make sure HTML has an element with class 'stats-card-container'");
  }

  function validusername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    return true;
  }

  async function fetchuserdetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`; 
    try {
      searchButton.textContent = 'Searching...';
      searchButton.disabled = true;
      const response = await fetch(url);
      console.log("response:", response);
      if (!response.ok) {
        throw new Error("Unable to fetch details");
      }
      const parsedData = await response.json();
      console.log("Logging data:", parsedData);
      displayUserData(parsedData);
    }
    catch (error) {
      statscontainer.innerHTML = "Unable to log the data";
      console.error(error);
    }
    finally {
      searchButton.textContent = 'Search';
      searchButton.disabled = false;
    }
  }

  function updateprogress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 360;
    circle.style.setProperty("--progress-degree", `${progressDegree}deg`);
    label.textContent = `${solved}/${total}`;
  }
  
  function displayUserData(parsedData) {
    try {
      const acceptanceRate = parsedData.acceptanceRate;
      const contributionPoints = parsedData.contributionPoints;
      const easySolved = parsedData.easySolved;
      const hardSolved = parsedData.hardSolved;
      const mediumSolved = parsedData.mediumSolved;
      const ranking = parsedData.ranking;
      const reputation = parsedData.reputation;
      const totalEasy = parsedData.totalEasy;
      const totalMedium = parsedData.totalMedium;
      const totalHard = parsedData.totalHard;
      const totalQuestions = parsedData.totalQuestions;
      const totalSolved = parsedData.totalSolved;
      
      updateprogress(easySolved, totalEasy, easyLabel, easyProgressCircle);
      updateprogress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
      updateprogress(hardSolved, totalHard, hardLabel, hardProgressCircle);
      
      const carddata = {
        acceptanceRate: { label: "Acceptance Rate", value: acceptanceRate },
        ranking: { label: "Ranking", value: ranking },
        totalSolved: { label: "Total Solved", value: totalSolved },
        reputation: { label: "Reputation", value: reputation }
      };

      console.log("carddata", carddata);

      if (cardstatscontainer) {
        cardstatscontainer.innerHTML = Object.values(carddata).map(data => {
          return `
              <div class="card">
                <span>${data.label}</span>
                <span>${data.value}</span>
              </div>
              `;
        }).join('');
      }
    } catch (error) {
      console.error("Error displaying user data:", error);
      if (statscontainer) {
        statscontainer.innerHTML = "Error displaying user statistics";
      }
    }
  }

  searchButton.addEventListener("click", function () {
    const username = searchInput.value.trim();
    console.log("Logging username:", username);

    if (!validusername(username)) {
      return;
    }
    fetchuserdetails(username);
    console.log("Proceeding with valid username...");
  });
});

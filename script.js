document.addEventListener('DOMContentLoaded', function() {
  const cacheKey = 'githubReposCache';
  const cacheExpiration = 5 * 60 * 60 * 1000; // Cache expiration time in milliseconds (24 hours)

  // Function to fetch data from the API
  const fetchData = () => {
    fetch('https://api.github.com/users/FrodoB4884/repos')
      .then(response => response.json())
      .then(data => {
        // Save data to localStorage with a timestamp
        const cacheData = {
          timestamp: new Date().getTime(),
          data: data
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        displayData(data);
      });
  };

  // Function to display the data
  const displayData = (data) => {
    const projectsContainer = document.getElementById('github-projects');
    projectsContainer.innerHTML = ''; // Clear existing content

    data.forEach(repo => {
      const project = document.createElement('div');
      project.classList.add('project');

      const endBreak = document.createElement('hr');
      project.appendChild(endBreak);

      const projectTitle = document.createElement('h3');
      projectTitle.textContent = repo.name;
      project.appendChild(projectTitle);

      const projectDescription = document.createElement('p');
      projectDescription.textContent = repo.description || 'No description available';
      project.appendChild(projectDescription);

      const projectLink = document.createElement('a');
      projectLink.href = repo.html_url;
      projectLink.textContent = 'View on GitHub';
      projectLink.target = '_blank';
      project.appendChild(projectLink);

      projectsContainer.appendChild(project);
    });
  };

  // Check if data is available in localStorage
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const parsedCacheData = JSON.parse(cachedData);
    const currentTime = new Date().getTime();

    // Check if cache is still valid
    if (currentTime - parsedCacheData.timestamp < cacheExpiration) {
      displayData(parsedCacheData.data);
      return;
    }
  }

  // If no valid cache, fetch new data
  fetchData();
});

document.addEventListener("DOMContentLoaded", function() {
    const username = "FrodoB4884"; // replace with the GitHub username
    const readmeUrl = `https://api.github.com/repos/${username}/${username}/contents/README.md`;

    fetch(readmeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.content) {
                // The content is Base64 encoded, so decode it
                const content = atob(data.content);
                document.getElementById("github-about").innerText = content;
            } else {
                document.getElementById("github-about").innerText = "README not found.";
            }
        })
        .catch(error => {
            console.error('Error fetching the README:', error);
            document.getElementById("github-about").innerText = "Error fetching the README.";
        });
});


function openModal(imageSrc, captionText) {
    var modal = document.getElementById("modal");
    var modalImg = document.getElementById("modal-img");
    var caption = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = imageSrc;
    caption.innerHTML = captionText;
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
}
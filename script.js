document.addEventListener('DOMContentLoaded', function() {
  const cacheKey = 'githubReposCache';
  const cacheExpiration = 5 * 60 * 60 * 1000; // Cache expiration time in milliseconds (5 hours)
  const username = "FrodoB4884";
  const repo = "frodob4884.github.io";
  const artFolder = "Art";
  const artContainer = document.querySelector('#art .grid-container');

  // Function to fetch data from the GitHub API
  const fetchData = () => {
    fetch(`https://api.github.com/users/${username}/repos`)
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

  // Function to display GitHub repos data
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

  // Function to fetch and display README content
	const fetchReadme = () => {
 		 const readmeUrl = `https://api.github.com/repos/${username}/${username}/contents/README.md`;

		  fetch(readmeUrl)
 		   .then(response => response.json())
 		   .then(data => {
  		    if (data.content) {
  		      // The content is Base64 encoded, decode it
  		      const content = atob(data.content);
   		     // Decode as UTF-8
 		       const utf8Content = new TextDecoder("utf-8").decode(new Uint8Array([...content].map(char => char.charCodeAt(0))));

   		     // Convert the decoded Markdown content to HTML using marked.js
 		       const htmlContent = marked.parse(utf8Content); // Use the correct `marked` method

 		       // Inject the HTML content into the page
 		       document.getElementById("github-about").innerHTML = htmlContent;
  		    } else {
  		      document.getElementById("github-about").innerText = "README not found.";
 		     }
 		   })
 		   .catch(error => {
  		    console.error('Error fetching the README:', error);
  		    document.getElementById("github-about").innerText = "Error fetching the README.";
  		  });
		};


  // Function to fetch images from GitHub repo
  const fetchArtImages = () => {
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${artFolder}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          const imagePromises = data
            .filter(file => file.type === "file" && (file.name.endsWith(".png") || file.name.endsWith(".jpg") || file.name.endsWith(".gif")))
            .map(file => {
              return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = file.download_url;
                img.onload = () => {
                  resolve({
                    element: img,
                    ratio: img.width / img.height,
                    name: file.name
                  });
                };
                img.onerror = reject;
              });
            });

          Promise.all(imagePromises).then(images => {
            images.sort((a, b) => b.ratio - a.ratio);

            images.forEach(image => {
              const gridItem = document.createElement("div");
              gridItem.className = "grid-item";
              gridItem.appendChild(image.element);
              gridItem.onclick = () => openModal(image.element.src, image.name);

              artContainer.appendChild(gridItem);
            });
          }).catch(error => console.error('Error loading images:', error));
        } else {
          console.error("Error: No images found in the Art folder.");
        }
      })
      .catch(error => console.error('Error fetching images from GitHub:', error));
  };

  // Check if data is available in localStorage
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const parsedCacheData = JSON.parse(cachedData);
    const currentTime = new Date().getTime();

    // Check if cache is still valid
    if (currentTime - parsedCacheData.timestamp < cacheExpiration) {
      displayData(parsedCacheData.data);
    } else {
      fetchData();
    }
  } else {
    fetchData();
  }

  fetchReadme();
  fetchArtImages(); // Call the function to load images
});

// Function to open the modal with the clicked image
function openModal(imageSrc, captionText) {
  var modal = document.getElementById("modal");
  var modalImg = document.getElementById("modal-img");
  var caption = document.getElementById("caption");

  // Remove the file extension from the caption text
  var captionWithoutExtension = captionText.replace(/\.[^/.]+$/, "");

  modal.style.display = "block";
  modalImg.src = imageSrc;
  caption.innerHTML = captionWithoutExtension;
}

// Function to close the modal
function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}

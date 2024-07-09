document.addEventListener('DOMContentLoaded', function() {
  fetch('https://api.github.com/users/FrodoB4884/repos')
    .then(response => response.json())
    .then(data => {
      const projectsContainer = document.getElementById('github-projects');
      data.forEach(repo => {
        const project = document.createElement('div');
        project.classList.add('project');

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
    });
});

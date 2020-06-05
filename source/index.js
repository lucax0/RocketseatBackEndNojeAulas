const express = require('express');
const { uuid , isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

const projects = [];

function logRequests(request, response, next){  
  const { method, url } = request;  //desestruturacao de obj 

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();
  
  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next){
  const { id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ "error": "Invalid Project ID" });
  }

  return next();
}

app.use(logRequests);

app.get('/projects',(request, response) => {
  const { title } = request.query;
  
  const results = title ? projects.filter(
    project => project.title.includes(title)) : projects;

  return response.json(results)  

  return response.json(projects)
})

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  console.log("Titulo Projeto: " + title);

  projects.push(project);

  return response.json(projects);
})

app.put('/projects/:id',validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ "error": "Project Not Found" });
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project;

  return response.json({
    "Status": "Update Sucessfull",
    "Updated Project": project
  })
})

app.delete('/projects/:id',validateProjectId, (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ "error": "Project Not Found" });
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send()
})


app.listen(5000, () => {
  console.log('App Running on 5000 ✌')
});
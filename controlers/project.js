const project = require('../models/project');
var Project = require('../models/project');
var path = require('path')
var fs = require('fs');
var controller = {
    home: function(req, res) {
        return res.status(200).send({
            message: 'Soy la home'
        })
    },
    test: function(req, res) {
        return res.status(200).send({
            message: 'Soy el metodo test'
        })
    },
    saveProject: function(req, res) {
        var project = new Project();
        var params = req.body;
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.technologies = params.technologies;
        project.year = params.year;
        project.image = null;
        project.link = params.link

        project.save((err, projectStored) => {
            if (err) return res.status(500).send({ message: 'error en la petición al guardar' })
            if (!projectStored) return res.status(404).send({ message: 'No se he podido guardar el proyecto' })
            return res.status(200).send({ project: projectStored })
        })

    },
    getProject: function(req, res) {
        var projectId = req.params.id;
        if (projectId == null) return res.status(500).send({ message: 'error al devolver el dato' })
        Project.findById(projectId, (err, project) => {
            if (err) return res.status(500).send({ message: 'error al devolver el dato' })
            if (!projectId) return res.status(404).send({ message: 'No se enconto el proyecto' })
            return res.status(200).send({ project })
        })
    },
    getProjects: function(req, res) {
        Project.find({}).sort('+year').exec((err, projects) => {
            if (err) return res.status(500).send({ message: 'Error al listar los datos' })
            if (!Project) return res.status(404).send({ message: 'No hay proyectos para mostar' })
            return res.status(200).send({ projects })
        })
    },
    updateProject: function(req, res) {
        var projectId = req.params.id;
        var update = req.body;
        Project.findByIdAndUpdate(projectId, update, { new: true }, (err, projectUpdate) => {
            if (err) return res.status(500).send({ message: 'Error, no se puede actulizar' })
            if (!projectUpdate) return res.status(404).send({ message: 'No sé encontro el proyecto' })
            return res.status(200).send({ project: projectUpdate, message: 'Se borro de la base de datos' })
        })
    },
    // deleteProject: function(req, res) {
    //     var projectId = req.params.id;
    //     Project.findByIdAndRemove(projectId, (err, projectRemoved) => {
    //         if (err) return res.status(500).send({ message: 'Error, no se puede eliminar el documento' })
    //         if (!projectRemoved) return res.status(404).send({ message: 'No sé encontro el proyecto' })
    //         Project.res.status(200).send({ project: projectRemoved })
    //     })
    // },
    deleteProject: function(req, res) {
        var projectId = req.params.id;

        Project.findByIdAndRemove(projectId, (err, projectRemoved) => {
            if (err) return res.status(500).send({ message: 'No se ha podido borrar el proyecto' });

            if (!projectRemoved) return res.status(404).send({ message: "No se puede eliminar ese proyecto." });

            return res.status(200).send({
                project: projectRemoved
            });
        });
    },

    uploadImage: function(req, res) {
        var projectId = req.params.id;
        var fileName = 'Imagen no subida...'

        if (req.files) {
            var filePath = req.files.image.path
            var fileSplit = filePath.split('\\')
            var fileName = fileSplit[1]
            var exSplit = fileName.split('\.')
            var fileExt = exSplit[1]
            if (fileExt == 'PNG' || fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                Project.findByIdAndUpdate(projectId, { image: fileName }, { new: true }, (err, projectUpdate) => {
                    if (err) return res.status(500).send({ message: 'La imagen no ha subido' })
                    if (!projectUpdate) return res.status(404).send({ message: 'El proyecto no existe y no se ha subido la imagen' })
                    return res.status(200).send({
                        project: projectUpdate
                    })
                })

            } else {
                fs.unlink(filePath, (err) => {
                    return res.status(200).send({ message: 'la extensión no es valida' })
                })
            }

        } else {
            return res.status(200).send({
                message: fileName
            })
        }
    },
    getImageFile: function(req, res) {
        var file = req.params.image;
        var path_file = './uploads/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file))
            } else {
                return res.status(200).send({
                    message: 'No existe la imagen'
                })

            }
        })
    }

}
module.exports = controller;
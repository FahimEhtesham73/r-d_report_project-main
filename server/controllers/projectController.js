import mongoose from "mongoose";
import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      uniqueId,
      description,
      projectLead,
      projectMembers,
      duration,
    } = req.body;

    // Parse projectMembers from a JSON string to an array
    const parsedProjectMembers = Array.isArray(JSON.parse(projectMembers))
      ? JSON.parse(projectMembers).map(
          (member) => new mongoose.Types.ObjectId(member)
        ) // Use 'new' here
      : [];

    const newProject = new Project({
      title,
      uniqueId,
      description,
      projectLead: new mongoose.Types.ObjectId(projectLead),
      projectMembers: parsedProjectMembers,
      duration,
    });

    await newProject.save();
    res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("projectLead", "name")
      .populate("projectMembers", "name");

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("projectLead", "name")
      .populate("projectMembers", "name");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    console.log(req.body)
    const project = await Project.findByIdAndUpdate(req.params.id, req.body);
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

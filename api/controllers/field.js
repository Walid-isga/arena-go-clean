import Field from "../models/field.js";

// ➡️ Créer un terrain
export const createField = async (req, res) => {
  try {
    const newField = new Field({
      ...req.body,
      photos: req.file ? [req.file.path] : [],
    });
    const savedField = await newField.save();
    res.status(201).json({ message: "Terrain créé avec succès", field: savedField });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➡️ Modifier un terrain
export const updateField = async (req, res) => {
  try {
    const updatedField = await Field.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json({ message: "Terrain modifié avec succès", field: updatedField });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➡️ Supprimer un terrain
export const deleteField = async (req, res) => {
  try {
    await Field.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Terrain supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➡️ Récupérer un seul terrain
export const getField = async (req, res) => {
  try {
    const foundField = await Field.findById(req.params.id);
    res.status(200).json(foundField);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➡️ Récupérer tous les terrains
export const getAllFields = async (req, res) => {
  try {
    const fields = await Field.find();
    res.status(200).json(fields);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

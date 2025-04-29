import Field from "../models/field.js";

// ➡️ Créer un terrain
export const createField = async (req, res) => {
  try {
    console.log("➡️ req.body:", req.body);
    console.log("➡️ req.file:", req.file);

    const newField = new Field({
      name: req.body.name,
      sport: req.body.sport,
      surfaceType: req.body.surfaceType,
      city: req.body.city,
      description: req.body.description,
      lights: req.body.lights === "true",
      dimensions: {
        length: Number(req.body.length),
        width: Number(req.body.width),
      },
      photos: req.file ? [req.file.path] : [],
    });

    const savedField = await newField.save();
    res.status(201).json({ message: "Terrain créé avec succès", field: savedField });
  } catch (err) {
    console.error("💥 Erreur createField :", err.message);
    res.status(500).json({ error: "Erreur lors de la création du terrain" });
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

// fieldController.js

// 🔥 Nouvelle route pour chercher un terrain par sport

export const getFieldsBySport = async (req, res) => {
  const { sport } = req.query; // 🔥 récupérer le sport demandé

  try {
    // 🔥 CHERCHE le terrain correspondant au sport
    const fields = await Field.find({ sport: { $regex: new RegExp(sport, "i") } });

    if (!fields.length) {
      return res.status(404).json({ message: "Aucun terrain trouvé pour ce sport." });
    }

    res.json(fields);
  } catch (error) {
    console.error("Erreur getFieldsBySport:", error);
    res.status(500).json({ message: error.message });
  }
};

  

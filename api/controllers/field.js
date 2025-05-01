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
      location: {
        city: req.body.city, // ✅ CORRECT
      },
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




// ✅ Contrôleur : mise à jour d’un terrain
export const updateField = async (req, res) => {
  const fieldId = req.params.id;
  const {
    name,
    sport,
    surfaceType,
    description,
    length,
    width,
    city,
  } = req.body;

  const file = req.file; // l'image uploadée si présente

  try {
    // Récupérer le terrain existant
    const field = await Field.findById(fieldId);
    if (!field) {
      return res.status(404).json({ message: "Terrain non trouvé." });
    }

    // Mettre à jour les champs
    field.name = name || field.name;
    field.sport = sport || field.sport;
    field.surfaceType = surfaceType || field.surfaceType;
    field.description = description || field.description;
    field.dimensions = {
      length: Number(length) || field.dimensions.length,
      width: Number(width) || field.dimensions.width,
    };
    field.location = {
      city: city || field.location.city,
    };

    // Si une nouvelle image a été uploadée
    if (file) {
      // on remplace l'ancienne
      field.photos = [file.filename];
    }

    // Sauvegarder les modifications
    const updated = await field.save();

    res.status(200).json({
      message: "✅ Terrain modifié avec succès",
      field: updated,
    });
  } catch (err) {
    console.error("❌ Erreur updateField :", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du terrain." });
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

  

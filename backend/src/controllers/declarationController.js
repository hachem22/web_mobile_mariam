const Declaration = require('../models/Declaration');

// @desc    Create a new emergency declaration
// @route   POST /api/declarations
// @access  Private (Nageur)
const createDeclaration = async (req, res) => {
    try {
        const declaration = await Declaration.create({
            ...req.body,
            nageur_id: req.user?._id || req.user?.id
        });

        const newDeclaration = await Declaration.findById(declaration._id)
            .populate('nageur_id', 'nom prenom');

        // Emit Socket.IO event 'new_declaration' to managers
        const io = req.app.get('io');
        if (io) {
            console.log('🚨 Nouvelle déclaration d\'urgence reçue:', newDeclaration._id);
            io.emit('new_declaration', newDeclaration);
        }

        res.status(201).json(newDeclaration);
    } catch (error) {
        console.error('Declaration creation error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all declarations
// @route   GET /api/declarations
// @access  Private
const getDeclarations = async (req, res) => {
    try {
        const declarations = await Declaration.find()
            .populate('nageur_id', 'nom prenom')
            .sort({ timestamp: -1 });
        res.json(declarations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a declaration status
// @route   PUT /api/declarations/:id
// @access  Private (Manager)
const updateDeclaration = async (req, res) => {
    try {
        const declaration = await Declaration.findByIdAndUpdate(
            req.params.id,
            { statut: req.body.statut },
            { new: true, runValidators: true }
        ).populate('nageur_id', 'nom prenom');

        if (!declaration) {
            return res.status(404).json({ message: 'Déclaration non trouvée' });
        }

        res.json(declaration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createDeclaration,
    getDeclarations,
    updateDeclaration
};

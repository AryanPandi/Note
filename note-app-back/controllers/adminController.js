const NoteAppUser = require('../model/noteUser');


// Controller to get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await NoteAppUser.find(); // Retrieve all users from the database
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send('Error retrieving users');
    }
};


exports.checkUserWithAdminRole = async (req, res) => {
    try {
        const { id } = req.params.id;
        NoteAppUser.findById(userId)
            .then(user => {
                if (user && user.role === 'admin') {
                    next(); // If user is an admin, proceed to the next middleware
                } else {
                    return res.status(403).json({ message: 'Access denied. Admins only.' });
                }
            })
            .catch(err => {
                return res.status(500).json({ message: 'Server error' });
            });
    } catch (e) {


    }
}
exports.getAdminUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query;
        if (!id || !role) {
            return res.status(400).json({ message: 'User ID and role are required' });
        }
        const user = await NoteAppUser.findOne({ _id: id, role: role });
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} and role ${role} not found` });
        }
        user.password = undefined;
        res.status(200).json({ user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Controller to delete a user
exports.deleteUser = async (req, res) => {
    const userId = req.params._id;


    try {
        const user = await NoteAppUser.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
};



/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
const { Router } = require('express');
const User = require('../serverModels/user.ts');

const router = Router();

router.post('/create', async (req, res) => {
    try {
        const { id } = req.body;
        const isExist = await User.findOne({ id });
        if (isExist) {
            await User.findOneAndUpdate(id, { $set: req.body });
            res.status(201).json({ message: 'OK' });
            return;
        }
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/read', async (req, res) => {
    try {
        const { sortType, sortDirection, page } = req.body;
        const user = await User.find()
            .sort({ [sortType]: sortDirection ? 1 : -1 })
            .skip(page * 10)
            .limit(10);
        res.json(user);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/update', async (req, res) => {
    try {
        await User.findOneAndUpdate({ id: req.body.id }, { $set: req.body });
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        await User.deleteOne({ id });
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

module.exports = router;

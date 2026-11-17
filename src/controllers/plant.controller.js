import * as plantService from "../services/plant.service.js";

export const create = async (req, res) => {
    try {
        const result = await plantService.create(req.body, req.user.id);
        res.status(201).json(result);

    } catch (err) {

        res.status(400).json({
            error: err.message
        });

    }
};

export const change = async (req, res) => {
    try {
        const result = await plantService.change(req.query.action, req.body.plantId);
        res.status(201).json(result);

    } catch (err) {

        res.status(400).json({
            error: err.message
        });

    }
};
export const evolve = async (req, res) => {
    try {
        const result = await plantService.evolve(req.body.success, req.body.plantId);
        res.status(201).json(result);

    } catch (err) {

        res.status(400).json({
            error: err.message
        });

    }
};
export const harvest = async (req, res) => {
    try {
        const result = await plantService.harvest(req.body.exp, req.user.id);
        res.status(201).json(result);

    } catch (err) {

        res.status(400).json({
            error: err.message
        });

    }
};

export const get = async (req, res) => {
    try {
        const result = await plantService.get(req.user.id);
        res.status(201).json(result);

    } catch (err) {

        res.status(400).json({
            error: err.message
        });

    }
}
import * as plantService from "../services/plant.service.js";

export const create = async (req, res) => {
    try {
        console.log(req.user.id);
        const result = await plantService.create(req.body, req.user.id);
        res.status(201).json(result);

    } catch(err) {

        res.status(400).json({
            error: err.message
        });

    }
};

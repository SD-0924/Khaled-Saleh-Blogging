"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResult = validateResult;
const express_validator_1 = require("express-validator");
function validateResult(req, res, next) {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const error = {
            name: result.array()[0].path,
            message: result.array()[0].msg
        };
        res.status(400).json(error);
        return;
    }
    next();
}

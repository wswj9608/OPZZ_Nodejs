import { Request, Response } from "express";

/**
 * Home page.
 * @route GET /
 */
export const index = (req: Request, res: Response) => {
    console.log(req);
    res.json({
        title: "Home"
    });
};

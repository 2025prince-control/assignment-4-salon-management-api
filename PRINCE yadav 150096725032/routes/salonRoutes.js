const express = require("express");
const supabase = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();



router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("salons")
            .select("*");

        if (error) {
            return res.status(500).json({
                message: error.message
            });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


router.get("/top", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("salons")
            .select("*")
            .order("rating", { ascending: false })
            .limit(5);

        if (error) {
            return res.status(500).json({
                message: error.message
            });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


router.get("/city/:city", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("salons")
            .select("*")
            .ilike("city", req.params.city);

        if (error) {
            return res.status(500).json({
                message: error.message
            });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("salons")
            .select("*")
            .eq("id", req.params.id)
            .single();

        if (error || !data) {
            return res.status(404).json({
                message: "Salon not found"
            });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            city,
            address,
            rating
        } = req.body;

        if (
            !name ||
            !city ||
            !address ||
            rating === undefined
        ) {
            return res.status(400).json({
                message: "Name, city, address and rating are required"
            });
        }

        const { data, error } = await supabase
            .from("salons")
            .insert([
                {
                    name,
                    city,
                    address,
                    rating
                }
            ])
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(201).json({
            message: "Salon created successfully",
            salon: data
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            city,
            address,
            rating
        } = req.body;

        const { data, error } = await supabase
            .from("salons")
            .update({
                name,
                city,
                address,
                rating
            })
            .eq("id", req.params.id)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({
                message: "Salon not found"
            });
        }

        res.status(200).json({
            message: "Salon updated successfully",
            salon: data
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("salons")
            .delete()
            .eq("id", req.params.id)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({
                message: "Salon not found"
            });
        }

        res.status(200).json({
            message: "Salon deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;
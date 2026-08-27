const express = require("express");
const supabase = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/services/available", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .eq("isavailable", true);

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


router.get("/salons/:id/services", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .eq("salonid", req.params.id);

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


router.post(
    "/salons/:id/services",
    authMiddleware,
    async (req, res) => {

        try {
            const {
                serviceName,
                price,
                duration,
                isAvailable
            } = req.body;


           
            if (
                !serviceName ||
                price === undefined ||
                !duration ||
                isAvailable === undefined
            ) {
                return res.status(400).json({
                    message:
                        "serviceName, price, duration and isAvailable are required"
                });
            }


            
            const {
                data: salon,
                error: salonError
            } = await supabase
                .from("salons")
                .select("id")
                .eq("id", req.params.id)
                .single();


            if (salonError || !salon) {
                return res.status(404).json({
                    message: "Salon not found"
                });
            }


          
            const {
                data,
                error
            } = await supabase
                .from("services")
                .insert([
                    {
                        salonid: req.params.id,
                        servicename: serviceName,
                        price: price,
                        duration: duration,
                        isavailable: isAvailable
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
                message: "Service created successfully",

                service: {
                    id: data.id,
                    salonId: data.salonid,
                    serviceName: data.servicename,
                    price: data.price,
                    duration: data.duration,
                    isAvailable: data.isavailable
                }
            });

        } catch (error) {

            res.status(500).json({
                message: "Server error"
            });

        }
    }
);



router.put(
    "/services/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                serviceName,
                price,
                duration,
                isAvailable
            } = req.body;


            
            if (
                !serviceName ||
                price === undefined ||
                !duration ||
                isAvailable === undefined
            ) {
                return res.status(400).json({
                    message:
                        "serviceName, price, duration and isAvailable are required"
                });
            }


            const {
                data,
                error
            } = await supabase
                .from("services")
                .update({
                    servicename: serviceName,
                    price: price,
                    duration: duration,
                    isavailable: isAvailable
                })
                .eq("id", req.params.id)
                .select()
                .single();


            if (error || !data) {
                return res.status(404).json({
                    message: "Service not found"
                });
            }


            res.status(200).json({
                message: "Service updated successfully",

                service: {
                    id: data.id,
                    salonId: data.salonid,
                    serviceName: data.servicename,
                    price: data.price,
                    duration: data.duration,
                    isAvailable: data.isavailable
                }
            });

        } catch (error) {

            res.status(500).json({
                message: "Server error"
            });

        }
    }
);



router.delete(
    "/services/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                data,
                error
            } = await supabase
                .from("services")
                .delete()
                .eq("id", req.params.id)
                .select()
                .single();


            if (error || !data) {
                return res.status(404).json({
                    message: "Service not found"
                });
            }


            res.status(200).json({
                message: "Service deleted successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: "Server error"
            });

        }
    }
);


module.exports = router;
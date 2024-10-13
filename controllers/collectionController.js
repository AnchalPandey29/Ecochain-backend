// Schedule Pickup
const schedulePickup = async (req, res) => {
    try {
      const pickupDetails = req.body;
      // Simulate scheduling pickup
      res.status(201).send({ message: 'Pickup scheduled successfully', pickupDetails });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
  
  // Get Pickup Schedule
  const getPickupSchedule = async (req, res) => {
    try {
      // Fetch pickup schedule
      res.send({ schedule: 'Your upcoming pickup schedule' });
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  module.exports = { schedulePickup, getPickupSchedule };
  
import Address from "../models/Address.js";

export const saveAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, addressLine, district, province, pincode } = req.body;

    if (!fullName || !phone || !addressLine || !district || !province || !pincode) {
      return res.status(400).json({ message: "All address fields are required" });
    }

    // Check if address already exists
    const existingAddress = await Address.findOne({
      userId,
      fullName,
      phone,
      addressLine,
      district,
      province,
      pincode,
    });

    if (existingAddress) {
      return res.status(400).json({ 
        message: "This address already exists",
        address: existingAddress 
      });
    }

    // Deactivate all previous addresses for this user
    await Address.updateMany(
      { userId },
      { active: false }
    );

    // Create new address with active: true
    const address = await Address.create({
      userId,
      fullName,
      phone,
      addressLine,
      district,
      province,
      pincode,
      active: true,
    });

    res.json({ message: "Address saved successfully", address });
  } catch (err) {
    res.status(500).json({ message: "Error while saving address" });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ userId });

    // If no addresses exist, return empty array
    if (addresses.length === 0) {
      return res.json({ 
        message: "No addresses found", 
        address: [] 
      });
    }

    // If exactly one address, make sure it's active
    if (addresses.length === 1 && !addresses[0].active) {
      await Address.findByIdAndUpdate(
        addresses[0]._id, 
        { active: true },
        { returnDocument: 'after' }
      );
      addresses[0].active = true;
    }

    res.json({ 
      message: "got address", 
      address: addresses 
    });
  } catch (err) {
    res.status(500).json({ message: "Error while getting address" });
  }
};

// Set an address as active
export const setAddressActive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;

    // Deactivate all other addresses for this user
    await Address.updateMany(
      { userId, _id: { $ne: addressId } },
      { active: false }
    );

    // Activate the selected address
    const address = await Address.findByIdAndUpdate(
      addressId,
      { active: true },
      { returnDocument: 'after' }
    );

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ message: "Address set as active", address });
  } catch (err) {
    res.status(500).json({ message: "Error while setting address active" });
  }
};